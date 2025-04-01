const path = require('path');

let nativeModule;
try {
  nativeModule = require(path.resolve('./native/your-binding.node'));
} catch (error) {
  console.error('Failed to load native module:', error);
}

export default nativeModule;