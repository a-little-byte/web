#!/usr/bin/env node

const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const rootDir = process.cwd();

function findEmscriptenModules() {
  const modules = [];
  
  function scanDirectory(dir) {
    const srcDir = path.join(dir, 'src');
    const incDir = path.join(dir, 'inc');
    
    if (fs.existsSync(srcDir) && fs.existsSync(incDir)) {
      const sourceFiles = fs.readdirSync(srcDir)
        .filter(file => file.endsWith('.c') || file.endsWith('.cpp'));
      
      if (sourceFiles.length > 0) {
        modules.push({
          name: path.basename(dir),
          path: dir,
          srcDir,
          incDir
        });
      }
    }
    
    try {
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      for (const entry of entries) {
        if (entry.isDirectory() && !entry.name.startsWith('.') && entry.name !== 'node_modules') {
          scanDirectory(path.join(dir, entry.name));
        }
      }
    } catch (err) {
      // Ignore errors reading directories
    }
  }
  
  scanDirectory(rootDir);
  return modules;
}


function buildModule(module) {
  console.log(`\n=== Building ${module.name} module ===`);
  
  const sourceFiles = fs.readdirSync(module.srcDir)
    .filter(file => file.endsWith('.c') || file.endsWith('.cpp'))
    .map(file => path.join(module.srcDir, file));
  
  const buildDir = path.join(module.path, 'build');
  try {
    fs.mkdirSync(buildDir, { recursive: true });
  } catch (err) {
  }
  
  const outputFile = path.join(buildDir, `${module.name.toLowerCase()}.js`);
  
  const exportedFunctions = findKeepaliveFunctions(module.srcDir, module.incDir);
  
  if (!exportedFunctions.includes('_malloc')) {
    exportedFunctions.push('_malloc');
  }
  if (!exportedFunctions.includes('_free')) {
    exportedFunctions.push('_free');
  }
  
  console.log(`Exported functions: ${exportedFunctions.join(', ')}`);
  
  const emccCommand = [
    "emcc",
    ...sourceFiles,
    "-I", module.incDir,
    "-o", outputFile,
    "-s", "WASM=1",
    "-s", `EXPORTED_FUNCTIONS=['${exportedFunctions.join("','")}']`,
    "-s", `EXPORTED_RUNTIME_METHODS=['ccall','cwrap','UTF8ToString','stringToUTF8','lengthBytesUTF8','setValue','getValue','HEAPU8']`,
    "-s", "ALLOW_MEMORY_GROWTH=1",
    "-s", "INITIAL_MEMORY=16777216",
    "-s", "MAXIMUM_MEMORY=2147483648",
    "-s", "MODULARIZE=1",
    "-s", "EXPORT_ES6=1", 
    "-s", "ENVIRONMENT=web,worker",
    //"-s", "SINGLE_FILE=1",
    "-O3"
  ].join(" ");
  
  try {
    console.log(`Source files: ${sourceFiles.map(f => path.basename(f)).join(', ')}`);
    console.log(`Output: ${outputFile}`);
    console.log(`Running Emscripten compilation...`);
    
    execSync(emccCommand, { stdio: "inherit" });
    console.log(`✓ Successfully built ${module.name} module!`);
    return true;
  } catch (error) {
    console.error(`✗ Failed to build ${module.name} module`);
    return false;
  }
}

function findKeepaliveFunctions(srcDir, incDir) {
  const functions = [];
  
  function scanFile(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      
      const keepaliveMatches = content.match(/EMSCRIPTEN_KEEPALIVE[\s\n]*([a-zA-Z0-9_*]+\s+)+([a-zA-Z0-9_]+)\s*\(/g);
      
      if (keepaliveMatches) {
        for (const match of keepaliveMatches) {
          const funcNameMatch = match.match(/([a-zA-Z0-9_]+)\s*\($/);
          if (funcNameMatch && funcNameMatch[1]) {
            const funcName = funcNameMatch[1];
            functions.push(`_${funcName}`);
          }
        }
      }
      
      const asteriskMatches = content.match(/EMSCRIPTEN_KEEPALIVE[\s\n]*([a-zA-Z0-9_]+\s+)+\*\s*([a-zA-Z0-9_]+)\s*\(/g);
      
      if (asteriskMatches) {
        for (const match of asteriskMatches) {
          const funcNameMatch = match.match(/\*?\s*([a-zA-Z0-9_]+)\s*\($/);
          if (funcNameMatch && funcNameMatch[1]) {
            const funcName = funcNameMatch[1];
            functions.push(`__${funcName}`);
            const singleIndex = functions.indexOf(`_${funcName}`);
            if (singleIndex !== -1) {
              functions.splice(singleIndex, 1);
            }
          }
        }
      }
      
    } catch (err) {
      // Ignore file reading errors
    }
  }
  
  fs.readdirSync(incDir)
    .filter(file => file.endsWith('.h'))
    .forEach(file => scanFile(path.join(incDir, file)));
  
  fs.readdirSync(srcDir)
    .filter(file => file.endsWith('.c') || file.endsWith('.cpp'))
    .forEach(file => scanFile(path.join(srcDir, file)));
  
  return functions;
}

function main() {
  console.log("Finding Emscripten modules...");
  const modules = findEmscriptenModules();
  
  if (modules.length === 0) {
    console.error("No Emscripten modules found!");
    process.exit(1);
  }
  
  console.log(`Found ${modules.length} module(s): ${modules.map(m => m.name).join(', ')}`);
  
  const args = process.argv.slice(2);
  const modulesToBuild = args.length > 0
    ? modules.filter(m => args.includes(m.name))
    : modules;
  
  if (args.length > 0 && modulesToBuild.length === 0) {
    console.error(`No matching modules found for: ${args.join(', ')}`);
    process.exit(1);
  }
  
  let allSuccessful = true;
  for (const module of modulesToBuild) {
    const success = buildModule(module);
    if (!success) allSuccessful = false;
  }
  
  if (allSuccessful) {
    console.log("\nAll modules built successfully!");
  } else {
    console.error("\nSome modules failed to build.");
    process.exit(1);
  }
}

main();
