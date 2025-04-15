import { initWasmModule } from "../utils";
import crypto from "node:crypto";

const module = "aes";

const generateIV = (length = 12) => {
  return crypto.randomBytes(length);
};

export const encrypt = async (
  plaintext: string | Buffer,
  key: string | Buffer,
  iv?: Buffer,
  aad?: Array<string | Buffer>
) => {
  const plaintextBuffer = typeof plaintext === "string" 
    ? Buffer.from(plaintext) 
    : plaintext;
  
  const keyBuffer = typeof key === "string" 
    ? Buffer.from(key) 
    : key;
  
  const ivBuffer = iv || generateIV();

  const aadBuffers: Buffer[] = [];
  const aadLengths: number[] = [];
  
  if (aad && aad.length > 0) {
    aad.forEach(item => {
      const buffer = typeof item === "string" ? Buffer.from(item) : item;
      aadBuffers.push(buffer);
      aadLengths.push(buffer.length);
    });
  }

  try {
    const wasmModule = await initWasmModule(module);

    if (!wasmModule?.ccall) {
      throw new Error("WASM module not properly initialized");
    }

    const outputLength = plaintextBuffer.length + 16;
    const outputPtr = wasmModule._malloc(outputLength);
    
    if (!outputPtr) {
      throw new Error("Failed to allocate memory for output");
    }

    const inputPtr = wasmModule._malloc(plaintextBuffer.length);
    wasmModule.HEAPU8.set(plaintextBuffer, inputPtr);
    
    const keyPtr = wasmModule._malloc(keyBuffer.length);
    wasmModule.HEAPU8.set(keyBuffer, keyPtr);
    
    const ivPtr = wasmModule._malloc(ivBuffer.length);
    wasmModule.HEAPU8.set(ivBuffer, ivPtr);

    let aadBuffersPtr = 0;
    let aadLengthsPtr = 0;

    if (aadBuffers.length > 0) {
      aadBuffersPtr = wasmModule._malloc(aadBuffers.length * 4); // 4 bytes per pointer
      aadLengthsPtr = wasmModule._malloc(aadLengths.length * 4); // 4 bytes per size_t

      for (let i = 0; i < aadBuffers.length; i++) {
        const buf = aadBuffers[i];
        const bufPtr = wasmModule._malloc(buf.length);
        wasmModule.HEAPU8.set(buf, bufPtr);
        wasmModule.setValue(aadBuffersPtr + i * 4, bufPtr, 'i32'); // Store pointer
        wasmModule.setValue(aadLengthsPtr + i * 4, buf.length, 'i32'); // Store length
      }
    }

    const result = wasmModule.ccall(
      "_aes_gcm_encrypt",
      "number",
      ["number", "number", "number", "number", "number", "number", "number", "number", "number", "number"],
      [outputPtr, inputPtr, plaintextBuffer.length, keyPtr, keyBuffer.length, ivPtr, ivBuffer.length, 
       aadBuffers.length > 0 ? aadBuffersPtr : 0, 
       aadBuffers.length > 0 ? aadLengthsPtr : 0, 
       aadBuffers.length]
    );

    if (result < 0) {
      throw new Error("Encryption failed");
    }

    const encryptedData = Buffer.from(wasmModule.HEAPU8.subarray(outputPtr, outputPtr + plaintextBuffer.length));
    const tag = Buffer.from(wasmModule.HEAPU8.subarray(outputPtr + plaintextBuffer.length, outputPtr + outputLength));

    wasmModule._free(outputPtr);
    wasmModule._free(inputPtr);
    wasmModule._free(keyPtr);
    wasmModule._free(ivPtr);

    if (aadBuffers.length > 0) {
      for (let i = 0; i < aadBuffers.length; i++) {
        const bufPtr = wasmModule.getValue(aadBuffersPtr + i * 4, 'i32');
        wasmModule._free(bufPtr);
      }
      wasmModule._free(aadBuffersPtr);
      wasmModule._free(aadLengthsPtr);
    }

    return {
      ciphertext: encryptedData,
      iv: ivBuffer,
      tag: tag
    };
  } catch (err) {
    const error = err as Error;
    console.error("Encryption error:", error.message || error);
    throw new Error("Failed to encrypt data");
  }
};

export const decrypt = async (
  ciphertext: Buffer,
  tag: Buffer,
  key: string | Buffer,
  iv: Buffer,
  aad?: Array<string | Buffer>
) => {
  const keyBuffer = typeof key === "string" ? Buffer.from(key) : key;
  
  const inputBuffer = Buffer.concat([ciphertext, tag]);

  const aadBuffers: Buffer[] = [];
  const aadLengths: number[] = [];
  
  if (aad && aad.length > 0) {
    aad.forEach(item => {
      const buffer = typeof item === "string" ? Buffer.from(item) : item;
      aadBuffers.push(buffer);
      aadLengths.push(buffer.length);
    });
  }

  try {
    const wasmModule = await initWasmModule(module);

    if (!wasmModule?.ccall) {
      throw new Error("WASM module not properly initialized");
    }

    const outputLength = ciphertext.length;
    const outputPtr = wasmModule._malloc(outputLength);
    
    if (!outputPtr) {
      throw new Error("Failed to allocate memory for output");
    }

    const inputPtr = wasmModule._malloc(inputBuffer.length);
    wasmModule.HEAPU8.set(inputBuffer, inputPtr);
    
    const keyPtr = wasmModule._malloc(keyBuffer.length);
    wasmModule.HEAPU8.set(keyBuffer, keyPtr);
    
    const ivPtr = wasmModule._malloc(iv.length);
    wasmModule.HEAPU8.set(iv, ivPtr);

    let aadBuffersPtr = 0;
    let aadLengthsPtr = 0;

    if (aadBuffers.length > 0) {
      aadBuffersPtr = wasmModule._malloc(aadBuffers.length * 4); // 4 bytes per pointer
      aadLengthsPtr = wasmModule._malloc(aadLengths.length * 4); // 4 bytes per size_t

      for (let i = 0; i < aadBuffers.length; i++) {
        const buf = aadBuffers[i];
        const bufPtr = wasmModule._malloc(buf.length);
        wasmModule.HEAPU8.set(buf, bufPtr);
        wasmModule.setValue(aadBuffersPtr + i * 4, bufPtr, 'i32'); // Store pointer
        wasmModule.setValue(aadLengthsPtr + i * 4, buf.length, 'i32'); // Store length
      }
    }

    const result = wasmModule.ccall(
      "_aes_gcm_decrypt",
      "number",
      ["number", "number", "number", "number", "number", "number", "number", "number", "number", "number"],
      [outputPtr, inputPtr, inputBuffer.length, keyPtr, keyBuffer.length, ivPtr, iv.length, 
       aadBuffers.length > 0 ? aadBuffersPtr : 0, 
       aadBuffers.length > 0 ? aadLengthsPtr : 0, 
       aadBuffers.length]
    );

    if (result < 0) {
      throw new Error("Decryption failed - authentication failed");
    }

    const decryptedData = Buffer.from(wasmModule.HEAPU8.subarray(outputPtr, outputPtr + outputLength));

    wasmModule._free(outputPtr);
    wasmModule._free(inputPtr);
    wasmModule._free(keyPtr);
    wasmModule._free(ivPtr);

    if (aadBuffers.length > 0) {
      for (let i = 0; i < aadBuffers.length; i++) {
        const bufPtr = wasmModule.getValue(aadBuffersPtr + i * 4, 'i32');
        wasmModule._free(bufPtr);
      }
      wasmModule._free(aadBuffersPtr);
      wasmModule._free(aadLengthsPtr);
    }

    return decryptedData;
  } catch (err) {
    const error = err as Error;
    console.error("Decryption error:", error.message || error);
    throw new Error("Failed to decrypt data");
  }
};

export const encryptToString = async (
  plaintext: string,
  key: string | Buffer,
  aad?: Array<string | Buffer>
) => {
  const result = await encrypt(plaintext, key, undefined, aad);
  
  return {
    ciphertext: result.ciphertext.toString('base64'),
    iv: result.iv.toString('base64'),
    tag: result.tag.toString('base64')
  };
};

export const decryptFromString = async (
  ciphertext: string,
  tag: string,
  iv: string,
  key: string | Buffer,
  aad?: Array<string | Buffer>
) => {
  const ciphertextBuffer = Buffer.from(ciphertext, 'base64');
  const tagBuffer = Buffer.from(tag, 'base64');
  const ivBuffer = Buffer.from(iv, 'base64');
  
  const result = await decrypt(ciphertextBuffer, tagBuffer, key, ivBuffer, aad);
  
  return result.toString('utf8');
};
