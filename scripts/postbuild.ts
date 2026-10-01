import * as fs from 'fs';
import * as path from 'path';

console.log('Running postbuild for GitHub Pages & standalone deployment...');

const rootDir = process.cwd();
const distDir = path.join(rootDir, 'dist');
const docsDir = path.join(rootDir, 'docs');
const assetsDir = path.join(rootDir, 'assets');
const downloadsDir = path.join(rootDir, 'downloads');

function copyRecursive(src: string, dest: string) {
  if (!fs.existsSync(src)) return;
  const stats = fs.statSync(src);
  if (stats.isDirectory()) {
    if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
    for (const file of fs.readdirSync(src)) {
      copyRecursive(path.join(src, file), path.join(dest, file));
    }
  } else {
    fs.copyFileSync(src, dest);
  }
}

// 1. Copy dist/assets to root assets and docs/assets
if (fs.existsSync(path.join(distDir, 'assets'))) {
  copyRecursive(path.join(distDir, 'assets'), assetsDir);
  copyRecursive(path.join(distDir, 'assets'), path.join(docsDir, 'assets'));
}

// 2. Ensure docs folder has complete static site
copyRecursive(distDir, docsDir);
if (fs.existsSync(path.join(rootDir, 'index.html'))) {
  fs.copyFileSync(path.join(rootDir, 'index.html'), path.join(docsDir, 'index.html'));
}

// 3. Ensure downloads are synchronized across downloads, docs/downloads, public/downloads
const apkName = 'telugu-panchangam-2027.apk';
const apkSource = path.join(downloadsDir, apkName);
if (fs.existsSync(apkSource)) {
  const docsDownloads = path.join(docsDir, 'downloads');
  if (!fs.existsSync(docsDownloads)) fs.mkdirSync(docsDownloads, { recursive: true });
  fs.copyFileSync(apkSource, path.join(docsDownloads, apkName));

  const publicDownloads = path.join(rootDir, 'public', 'downloads');
  if (!fs.existsSync(publicDownloads)) fs.mkdirSync(publicDownloads, { recursive: true });
  fs.copyFileSync(apkSource, path.join(publicDownloads, apkName));
}

// 4. Create .nojekyll in root, dist, and docs
fs.writeFileSync(path.join(rootDir, '.nojekyll'), '', 'utf-8');
fs.writeFileSync(path.join(distDir, '.nojekyll'), '', 'utf-8');
fs.writeFileSync(path.join(docsDir, '.nojekyll'), '', 'utf-8');

// 5. Create 404.html in root, dist, and docs for GitHub Pages SPA routing
const notFoundHtml = `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>Telugu Panchangam 2027</title>
    <script>
      sessionStorage.redirect = location.href;
      location.replace('./');
    </script>
  </head>
  <body>
    Redirecting to Telugu Panchangam 2027...
  </body>
</html>`;

fs.writeFileSync(path.join(rootDir, '404.html'), notFoundHtml, 'utf-8');
fs.writeFileSync(path.join(distDir, '404.html'), notFoundHtml, 'utf-8');
fs.writeFileSync(path.join(docsDir, '404.html'), notFoundHtml, 'utf-8');

// 6. Ensure ads.txt is in dist and docs
const adsTxtSource = path.join(rootDir, 'ads.txt');
if (fs.existsSync(adsTxtSource)) {
  fs.copyFileSync(adsTxtSource, path.join(distDir, 'ads.txt'));
  fs.copyFileSync(adsTxtSource, path.join(docsDir, 'ads.txt'));
}

console.log('Postbuild finished successfully! Root & docs synchronized.');
