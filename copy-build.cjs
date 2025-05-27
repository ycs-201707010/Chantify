// copy-build.js
const fse = require("fs-extra");
const path = require("path");

const buildDir = path.resolve(__dirname, "dist"); // Vite 쓸 경우 'dist', CRA면 'build'
const targetDir = path.resolve(
  "C:/Users/user/eclipse-workspace/ChantifyServer/src/main/webapp"
);

(async () => {
  try {
    console.log("📦 React 빌드 결과 복사 시작...");
    await fse.copy(buildDir, targetDir, { overwrite: true });
    console.log("✅ 복사 완료! JSP 프로젝트에 최신 빌드 반영됨.");
  } catch (err) {
    console.error("❌ 복사 실패:", err);
  }
})();
