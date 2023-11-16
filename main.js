const fs = require('fs');
const transformData = require('./utils/transformer');

// Function to read file as a string
function readFileAsString(filePath) {
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch (e) {
    console.error(e);
  }
}


// Function to write the new file
function writeFileAsString(data, filePath) {
  try {
    fs.writeFileSync(filePath, data, 'utf8');
  } catch (e) {
    console.error(e);
  }
}

// Main function to execute the transformation
function main() {
  if (process.argv.length < 3) {
    console.log("Usage: node transformYAML.js <filename>");
    process.exit(1);
  }

  const oldFilePath = process.argv[2];
  const newFilePath = oldFilePath.replace('.yaml', '-transformed.yaml');

  const oldDataString = readFileAsString(oldFilePath);
  const newDataString = transformData(oldDataString);
  writeFileAsString(newDataString, newFilePath);

  console.log(`Transformed YAML file saved as: ${newFilePath}`);
}

main();
