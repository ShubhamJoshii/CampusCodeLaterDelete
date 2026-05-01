const fs = require("fs");
const path = require("path");
const { exec, execFile } = require("child_process");
const crypto = require("crypto");
const util = require("util");
const Problems = require("../../models/Problems");
const buildJavaInput = require("../../util/buildJavaInput");

const execPromise = util.promisify(exec);

const tempDir = path.join(__dirname, "temp");
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir);
}

// ✅ Run Java with proper error classification
function runJava(command, args, input) {
  return new Promise((resolve, reject) => {
    const child = execFile(
      command,
      args,
      { timeout: 5000, maxBuffer: 1024 * 500 },
      (err, stdout, stderr) => {
        // ⏱️ Time Limit Exceeded
        if (err && err.killed) {
          return reject({ type: "TLE", message: "Time Limit Exceeded" });
        }

        // ❌ Runtime Error
        if (err) {
          return reject({
            type: "RUNTIME_ERROR",
            message: stderr || err.message,
          });
        }

        // ✅ Ignore harmless stderr, return output
        resolve(stdout);
      }
    );

    child.stdin.write(input);
    child.stdin.end();
  });
}

// ✅ Normalize output for comparison
function normalizeOutput(input) {
  if (Array.isArray(input)) return input.map(String);

  if (typeof input === "string") {
    return input.trim().split(/\r?\n/).filter(Boolean);
  }

  return [String(input)];
}

// ✅ Compare expected vs actual
function compareOutputs(actual, expected) {
  actual = normalizeOutput(actual);
  expected = normalizeOutput(expected);

  if (actual.length !== expected.length) return false;

  for (let i = 0; i < actual.length; i++) {
    if (String(actual[i]).trim() !== String(expected[i]).trim()) {
      return false;
    }
  }
  return true;
}

// 🚀 Main runner
const runCodeFunction = async (code, language, problemId) => {
  const jobId = crypto.randomBytes(4).toString("hex");
  let filesCreated = [];

  try {
    const problemDetail = await Problems.findById(problemId).lean();

    if (!problemDetail?.judgeCode?.[language]) {
      throw new Error("Judge code template not found");
    }

    const template = problemDetail.judgeCode[language];
    const finalCode = template.replace("/*USER_CODE*/", code);

    if (language === "java") {
      const className = `Main_${jobId}`;
      const fileName = path.join(tempDir, `${className}.java`);

      filesCreated.push(fileName, path.join(tempDir, `${className}.class`));

      const javaCodeReady = finalCode.replace(
        /public\s+class\s+Main/g,
        `public class ${className}`
      );

      fs.writeFileSync(fileName, javaCodeReady);

      try {
        await execPromise(`javac ${fileName}`, { timeout: 5000 });
      } catch (err) {
        return {
          success: false,
          type: "COMPILATION_ERROR",
          error: err.stderr || err.message,
        };
      }

      const results = [];

      // ⚙️ Execution Phase (Run-time)
      for (const tc of problemDetail.testCases) {
        const input = buildJavaInput(tc, problemDetail.tags?.[0]);

        try {
          const stdout = await runJava(
            "java",
            ["-cp", tempDir, className],
            input
          );

          const passed = compareOutputs(stdout, tc.output);

          results.push({
            input,
            expected: normalizeOutput(tc.output),
            actual: normalizeOutput(stdout),
            passed,
            verdict: passed ? "ACCEPTED" : "WRONG_ANSWER",
          });

        } catch (err) {
          results.push({
            input,
            expected: normalizeOutput(tc.output),
            actual: [],
            passed: false,
            errorType: err.type || "RUNTIME_ERROR",
            error: err.message,
          });

          break; // 🔥 Stop on first runtime error / TLE
        }
      }

      return {
        success: true,
        results,
        summary: {
          total: results.length,
          passed: results.filter((r) => r.passed).length,
        },
      };
    }

    throw new Error("Language not supported");

  } catch (error) {
    return {
      success: false,
      type: "SYSTEM_ERROR",
      error: error.message,
    };
  } finally {
    // 🧹 Cleanup
    filesCreated.forEach((file) => {
      if (fs.existsSync(file)) {
        try {
          fs.unlinkSync(file);
        } catch {}
      }
    });
  }
};

module.exports = runCodeFunction;