const { execSync } = require('child_process');
const path = require('path');

const sourceFiles = [
  'src/main.c',
  'src/pbkdf2.c',
  'src/sha256.c',
  'src/utils.c'
];

const includeDir = 'inc';
const outputDir = 'build';
const outputFile = 'hash.js';

try {
  execSync(`mkdir -p ${outputDir}`);
} catch (error) {
  // Directory might already exist, ignore error
}

const emccCommand = [
  'emcc',
  ...sourceFiles,
  '-I', includeDir,
  '-o', path.join(outputDir, outputFile),
  '-s', 'WASM=1',
  '-s', "EXPORTED_FUNCTIONS=['_malloc','_free','__hash','__verify']",
  '-s', "EXPORTED_RUNTIME_METHODS=['ccall','cwrap','UTF8ToString','stringToUTF8','lengthBytesUTF8']",
  '-s', 'ALLOW_MEMORY_GROWTH=1',
  '-s', 'INITIAL_MEMORY=16777216',
  '-s', 'MAXIMUM_MEMORY=2147483648',
  '-s', 'MODULARIZE=1',
  '-s', 'EXPORT_ES6=1',
  '-s', 'ENVIRONMENT=web,worker',
  '-s', 'SINGLE_FILE=1',
  '-O3'
].join(' ');

try {
  execSync(emccCommand, { stdio: 'inherit' });
  console.log('Build completed successfully!');
} catch (error) {
  console.error('Build failed:', error);
  process.exit(1);
} 