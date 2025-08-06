const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const srcDir = path.join(__dirname, 'src');
const distDir = path.join(__dirname, 'dist');

function runTests() {
  try {
    execSync('npm test', { stdio: 'inherit' });
    return true;
  } catch (error) {
    return false;
  }
}

function copyRecursiveSync(src, dest) {
  const exists = fs.existsSync(src);
  const stats = exists && fs.statSync(src);
  const isDirectory = exists && stats.isDirectory();
  if (isDirectory) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest);
    }
    fs.readdirSync(src).forEach((childItemName) => {
      if (childItemName === '.gitkeep') return;
      copyRecursiveSync(path.join(src, childItemName), path.join(dest, childItemName));
    });
  } else if (exists) {
    fs.copyFileSync(src, dest);
  }
}

if (!runTests()) {
  console.error('Tests failed. Build aborted.');
  process.exit(1);
}

copyRecursiveSync(srcDir, distDir);
console.log(`Copied files from ${srcDir} to ${distDir}`);
