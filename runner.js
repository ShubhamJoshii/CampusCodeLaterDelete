const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");

const tempDir = path.join(__dirname, "temp");

// ensure temp exists
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir);
}

function createJavaFile(userCode) {
  const fullCode = `
import java.util.*;

${userCode}

class Runner {
    public static void main(String[] args) {
        System.out.println("DOCKER WORKING");
    }
}
`;

  const filePath = path.join(tempDir, "Solution.java");
  fs.writeFileSync(filePath, fullCode);
}

function runDocker() {
  return new Promise((resolve, reject) => {
    // 🔥 CRITICAL FIX (Windows path)
    const dockerPath = tempDir.replace(/\\/g, "/").replace("C:", "/c");

    const command = `
docker run -i --rm \
-v "${dockerPath}:/app" \
-w /app openjdk:17 \
bash -c "ls -l && javac Solution.java && java Runner"
`;

    exec(command, (error, stdout, stderr) => {
      console.log("STDOUT:\n", stdout);
      console.log("STDERR:\n", stderr);

      if (error) return reject(stderr || error.message);

      resolve(stdout);
    });
  });
}

function cleanUp() {
  const file = path.join(tempDir, "Solution.java");
  if (fs.existsSync(file)) fs.unlinkSync(file);
}

module.exports = { createJavaFile, runDocker, cleanUp };