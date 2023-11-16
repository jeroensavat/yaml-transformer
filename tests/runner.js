const fs = require('fs');
const path = require('path');

const transformData = require('../utils/transformer'); // import your transformData function

function runTests(testFoldersPath) {
  const folders = fs.readdirSync(testFoldersPath, { withFileTypes: true })
                    .filter(dirent => dirent.isDirectory())
                    .map(dirent => dirent.name);

  folders.forEach(folder => {
    const folderPath = path.join(testFoldersPath, folder);
    const inputFilePath = path.join(folderPath, 'original.yaml');
    const outputFilePath = path.join(folderPath, 'original-transformed.yaml');

    const inputContent = fs.readFileSync(inputFilePath, 'utf8');
    const expectedOutputContent = fs.readFileSync(outputFilePath, 'utf8');

    const transformedContent = transformData(inputContent);

    if (transformedContent === expectedOutputContent) {
      console.log(`Test passed for folder: ${folder}`);
    } else {
      console.log(`Test FAILED!!!!! for folder: ${folder}`);
    }
  });
}

runTests('./tests/inputs');
