#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const buildDirName = process.env.EXPO_BUILD_DIR || 'web-build';
const WEB_BUILD_DIR = path.join(process.cwd(), buildDirName);

// 遞迴抓符合副檔名的檔案
function walk(dir, extList, fileList = []) {
  const files = fs.readdirSync(dir);
  files.forEach((file) => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      walk(fullPath, extList, fileList);
    } else if (extList.some((ext) => file.endsWith(ext))) {
      fileList.push(fullPath);
    }
  });
  return fileList;
}

function patchAssetsPath() {
  const exts = ['.js', '.css', '.html', '.map'];
  const files = walk(WEB_BUILD_DIR, exts);
  let patchedCount = 0;

  files.forEach((file) => {
    let content = fs.readFileSync(file, 'utf8');
    // 這裡直接把 "/assets/" 換成 "web-build/assets/"
    const newContent = content.replace(/(["'`])\/assets\//g, `$1web-build/assets/`);
    if (newContent !== content) {
      fs.writeFileSync(file, newContent, 'utf8');
      patchedCount++;
    }
  });

  console.log(`✅ Patched ${patchedCount} file(s) in web-build.`);
}

patchAssetsPath();
