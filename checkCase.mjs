import fs from 'fs';
import path from 'path';

const srcDir = './src';

function getAllFiles(dirPath, arrayOfFiles) {
  const files = fs.readdirSync(dirPath);

  arrayOfFiles = arrayOfFiles || [];

  files.forEach(function (file) {
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      arrayOfFiles = getAllFiles(fullPath, arrayOfFiles);
    } else {
      if (file.endsWith('.js') || file.endsWith('.jsx')) {
        arrayOfFiles.push(fullPath);
      }
    }
  });

  return arrayOfFiles;
}

const files = getAllFiles(srcDir);

files.forEach(file => {
  const content = fs.readFileSync(file, 'utf-8');
  const importRegex = /import.*?from\s+['"](.*?)['"]/g;
  let match;
  while ((match = importRegex.exec(content)) !== null) {
    const importPath = match[1];
    if (importPath.startsWith('.')) {
      const dirPath = path.dirname(file);
      let resolvedPath = path.resolve(dirPath, importPath);
      
      // Try appending .js, .jsx, etc.
      const extensions = ['', '.js', '.jsx'];
      let found = false;
      let actualResolvedPath = '';

      for (const ext of extensions) {
         if (fs.existsSync(resolvedPath + ext)) {
           found = true;
           actualResolvedPath = resolvedPath + ext;
           break;
         }
      }

      if (found) {
        // check case sensitivity
        const dir = path.dirname(actualResolvedPath);
        const basename = path.basename(actualResolvedPath);
        const dirFiles = fs.readdirSync(dir);
        if (!dirFiles.includes(basename)) {
          console.error(`Case mismatch in ${file}:\nImport path: ${importPath}\nActual file: ${actualResolvedPath}`);
        }
      }
    }
  }
});
console.log('Case check complete.');
