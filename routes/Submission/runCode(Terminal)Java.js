const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");
const crypto = require("crypto");
const util = require("util");
const { execFile } = require("child_process");
const Problems = require("../../models/Problems");

const execPromise = util.promisify(exec);

const tempDir = path.join(__dirname, "temp");
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir);
}

/* ---------------- INPUT BUILDER ---------------- */
function buildJavaInput(tc, type) {
  return [
    type,
    tc.input.nums.length,
    tc.input.nums.join(" "),
    tc.input.target,
  ].join("\n");
}

/* ---------------- JAVA RUNNER TEMPLATE ---------------- */
const JAVA_RUNNER = `
import java.util.*;

class ListNode {
    int val;
    ListNode next;
    ListNode(int x) { val = x; }
}

/*USER_CODE*/

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);

        String type = sc.nextLine();

        if (type.equals("array")) {
            int n = Integer.parseInt(sc.nextLine());
            String[] arr = sc.nextLine().split(" ");

            int[] nums = new int[n];
            for (int i = 0; i < n; i++) nums[i] = Integer.parseInt(arr[i]);

            int target = Integer.parseInt(sc.nextLine());

            Solution sol = new Solution();
            int[] res = sol.twoSum(nums, target);

            System.out.println(res[0] + " " + res[1]);
        }
    }
}
`;

/* ---------------- RUN JAVA WITH STDIN ---------------- */
function runJava(command, args, input) {
    return new Promise((resolve, reject) => {
        const child = execFile(command, args, { timeout: 5000, maxBuffer: 1024 * 500 }, (err, stdout, stderr) => {
            if (err && err.killed) return reject("Memory or Time Limit Exceeded");
            if (stderr) return reject(stderr);
            resolve(stdout);
        });

        child.stdin.write(input);
        child.stdin.end();
    });
}

/* ---------------- OUTPUT NORMALIZER ---------------- */
function parseOutput(str) {
  return str.trim().split(/\s+/).filter(Boolean).map(Number);
}

function normalize(arr) {
  return JSON.stringify(arr);
}

/* ---------------- MAIN ROUTE ---------------- */
router.post("/runcode", async (req, res) => {
  const { code, language, _id } = req.body;
  const jobId = crypto.randomBytes(4).toString("hex");

  try {
    const problemDetail = await Problems.findById(_id).lean();

    if (
      !problemDetail ||
      !problemDetail.defaultCode ||
      !problemDetail.defaultCode[language]
    ) {
      return res.status(400).json({ error: "Judge template not found." });
    }

    if (language !== "java") {
      return res.status(400).json({ error: "Language not supported" });
    }

    console.log(code, language, _id);
    /* ---------------- BUILD FINAL CODE ---------------- */
    const finalCode = JAVA_RUNNER.replace("/*USER_CODE*/", code);

    const className = `Main_${jobId}`;
    const fileName = path.join(tempDir, `${className}.java`);

    const javaCodeReady = finalCode.replace(
      /public\s+class\s+Main/g,
      `public class ${className}`,
    );

    fs.writeFileSync(fileName, javaCodeReady);

    /* ---------------- COMPILE ---------------- */
    await execPromise(`javac ${fileName}`, { timeout: 5000 });

    /* ---------------- RUN TEST CASES ---------------- */
    const results = [];

    for (const tc of problemDetail.testCases) {
      const input = buildJavaInput(tc, problemDetail.tags[0]);

      // const stdout = await runJava(`java -cp ${tempDir} ${className}`, input);
      const stdout = await runJava("java", ["-cp", tempDir, className], input);

      const actualArr = parseOutput(stdout);
      const expectedArr = tc.output; // ARRAY FROM DB

      const passed = normalize(actualArr) === normalize(expectedArr);

      results.push({
        input,
        expected: expectedArr,
        actual: actualArr,
        passed,
      });
    }

    return res.json({
      success: true,
      results,
      summary: {
        total: results.length,
        passed: results.filter((r) => r.passed).length,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.stderr || error.message,
      details: "Compilation or Runtime Error",
    });
  } 
});

module.exports = router;
