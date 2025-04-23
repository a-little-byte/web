import { initWasmModule } from "../utils";
import crypto from "crypto";

const module = "AES";
const wasmName = "aes";

const generateIV = (length = 12) => {
  return crypto.randomBytes(length);
};

export const encrypt = async (
  plaintext: string | Buffer,
  key: string | Buffer,
  aad?: Array<string | Buffer>
) => {
  const plaintextBuffer = typeof plaintext === "string" 
    ? Buffer.from(plaintext) 
    : plaintext;
  
  const keyBuffer = typeof key === "string" 
    ? Buffer.from(key) 
    : key;
  
  const ivBuffer = generateIV();

  const aadBuffers = aad?.map(item => 
    typeof item === "string" ? Buffer.from(item) : item
  ) || [];

  try {
    const wasmModule = await initWasmModule(module, wasmName);

    if (!wasmModule?.ccall) {
      throw new Error("WASM module not properly initialized");
    }

    const outputSize = plaintextBuffer.length + 16; 
    const outputPtr = wasmModule._malloc(outputSize);
    
    const plaintextPtr = wasmModule._malloc(plaintextBuffer.length);
    wasmModule.HEAPU8.set(new Uint8Array(plaintextBuffer), plaintextPtr);
    
    const keyPtr = wasmModule._malloc(keyBuffer.length);
    wasmModule.HEAPU8.set(new Uint8Array(keyBuffer), keyPtr);
    
    const ivPtr = wasmModule._malloc(ivBuffer.length);
    wasmModule.HEAPU8.set(new Uint8Array(ivBuffer), ivPtr);
    
    let aadPtrsPtr = 0;
    let aadLengthsPtr = 0;
    const bufferPtrs = [];
    
    if (aadBuffers.length > 0) {
      aadPtrsPtr = wasmModule._malloc(aadBuffers.length * 4); 
      aadLengthsPtr = wasmModule._malloc(aadBuffers.length * 4); 
      
      for (let i = 0; i < aadBuffers.length; i++) {
        const buf = aadBuffers[i];
        const bufPtr = wasmModule._malloc(buf.length);
        wasmModule.HEAPU8.set(new Uint8Array(buf), bufPtr);
        bufferPtrs.push(bufPtr);
        
        wasmModule.setValue(aadPtrsPtr + (i * 4), bufPtr, 'i32');
        wasmModule.setValue(aadLengthsPtr + (i * 4), buf.length, 'i32');
      }
    }

    const result = wasmModule.ccall(
      "_aes_gcm_encrypt",
      "number",  
      ["number", "number", "number", "number", "number", "number", "number", "number", "number", "number"],
      [
        outputPtr,             // Output buffer
        plaintextPtr,          // Input buffer
        plaintextBuffer.length, // Input length
        keyPtr,                // Key buffer
        keyBuffer.length,      // Key length
        ivPtr,                 // IV buffer
        ivBuffer.length,       // IV length
        aadPtrsPtr,            // AAD pointers array
        aadLengthsPtr,         // AAD lengths array
        aadBuffers.length      // Number of AAD buffers
      ]
    );

    if (result < 0) {
      throw new Error(`Encryption failed with code: ${result}`);
    }

    const encryptedData = new Uint8Array(wasmModule.HEAPU8.buffer, outputPtr, outputSize);
    const ciphertext = Buffer.from(encryptedData);

    wasmModule._free(outputPtr);
    wasmModule._free(plaintextPtr);
    wasmModule._free(keyPtr);
    wasmModule._free(ivPtr);
    
    if (aadBuffers.length > 0) {
      wasmModule._free(aadPtrsPtr);
      wasmModule._free(aadLengthsPtr);
      
      for (const ptr of bufferPtrs) {
        wasmModule._free(ptr);
      }
    }

    return {
      ciphertext: ciphertext.toString("base64"),
      iv: ivBuffer.toString("base64"),
    };
  } catch (err) {
    const error = err as Error;
    console.error("Encryption error:", error.message || error);
    throw new Error("Failed to encrypt data");
  }
};

export const decrypt = async (
  ciphertext: string | Buffer,
  key: string | Buffer,
  iv: string | Buffer,
  aad?: Array<string | Buffer>
) => {
  const ciphertextBuffer = typeof ciphertext === "string" 
    ? Buffer.from(ciphertext, 'base64') 
    : ciphertext;
  
  const keyBuffer = typeof key === "string" 
    ? Buffer.from(key) 
    : key;
  
  const ivBuffer = typeof iv === "string" 
    ? Buffer.from(iv, 'base64') 
    : iv;

  const aadBuffers = aad?.map(item => 
    typeof item === "string" ? Buffer.from(item) : item
  ) || [];

  try {
    const wasmModule = await initWasmModule(module, wasmName);

    if (!wasmModule?.ccall) {
      throw new Error("WASM module not properly initialized");
    }

    const outputSize = ciphertextBuffer.length - 16; 
    const outputPtr = wasmModule._malloc(outputSize > 0 ? outputSize : 1);
    
    const ciphertextPtr = wasmModule._malloc(ciphertextBuffer.length);
    wasmModule.HEAPU8.set(new Uint8Array(ciphertextBuffer), ciphertextPtr);
    
    const keyPtr = wasmModule._malloc(keyBuffer.length);
    wasmModule.HEAPU8.set(new Uint8Array(keyBuffer), keyPtr);
    
    const ivPtr = wasmModule._malloc(ivBuffer.length);
    wasmModule.HEAPU8.set(new Uint8Array(ivBuffer), ivPtr);
    
    let aadPtrsPtr = 0;
    let aadLengthsPtr = 0;
    const bufferPtrs = [];
    
    if (aadBuffers.length > 0) {
      aadPtrsPtr = wasmModule._malloc(aadBuffers.length * 4); 
      aadLengthsPtr = wasmModule._malloc(aadBuffers.length * 4); 
      
      for (let i = 0; i < aadBuffers.length; i++) {
        const buf = aadBuffers[i];
        const bufPtr = wasmModule._malloc(buf.length);
        wasmModule.HEAPU8.set(new Uint8Array(buf), bufPtr);
        bufferPtrs.push(bufPtr);
        
        wasmModule.setValue(aadPtrsPtr + (i * 4), bufPtr, 'i32');
        wasmModule.setValue(aadLengthsPtr + (i * 4), buf.length, 'i32');
      }
    }

    const result = wasmModule.ccall(
      "_aes_gcm_decrypt",
      "number",  
      ["number", "number", "number", "number", "number", "number", "number", "number", "number", "number"],
      [
        outputPtr,              // Output buffer
        ciphertextPtr,          // Input buffer
        ciphertextBuffer.length, // Input length
        keyPtr,                 // Key buffer
        keyBuffer.length,       // Key length
        ivPtr,                  // IV buffer
        ivBuffer.length,        // IV length
        aadPtrsPtr,             // AAD pointers array
        aadLengthsPtr,          // AAD lengths array
        aadBuffers.length       // Number of AAD buffers
      ]
    );

    if (result < 0) {
      throw new Error("Decryption failed - authentication failed");
    }

    const decryptedData = new Uint8Array(wasmModule.HEAPU8.buffer, outputPtr, outputSize);
    const plaintext = Buffer.from(decryptedData);

    wasmModule._free(outputPtr);
    wasmModule._free(ciphertextPtr);
    wasmModule._free(keyPtr);
    wasmModule._free(ivPtr);
    
    if (aadBuffers.length > 0) {
      wasmModule._free(aadPtrsPtr);
      wasmModule._free(aadLengthsPtr);
      
      for (const ptr of bufferPtrs) {
        wasmModule._free(ptr);
      }
    }

    return plaintext.toString("utf8");
  } catch (err) {
    const error = err as Error;
    console.error("Decryption error:", error.message || error);
    throw new Error("Failed to decrypt data");
  }
};
