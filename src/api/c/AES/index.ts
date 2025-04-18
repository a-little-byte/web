import { initWasmModule } from "../utils";
import crypto from "crypto";

const module = "aes";

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
    const wasmModule = await initWasmModule(module);

    if (!wasmModule?.ccall) {
      throw new Error("WASM module not properly initialized");
    }

    const result = wasmModule.ccall(
      "_aes_gcm_encrypt",
      "string",
      ["array", "number", "array", "number", "array", "number", "array", "array", "number"],
      [
        plaintextBuffer, 
        plaintextBuffer.length, 
        keyBuffer, 
        keyBuffer.length, 
        ivBuffer, 
        ivBuffer.length, 
        aadBuffers, 
        aadBuffers.map(buf => buf.length), 
        aadBuffers.length
      ]
    );

    if (!result) {
      throw new Error("Encryption failed");
    }

    const ciphertext = Buffer.from(result, 'base64');

    return {
      ciphertext,
      iv: ivBuffer,
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

  const aadBuffers = aad?.map(item => 
    typeof item === "string" ? Buffer.from(item) : item
  ) || [];

  try {
    const wasmModule = await initWasmModule(module);

    if (!wasmModule?.ccall) {
      throw new Error("WASM module not properly initialized");
    }

    const result = wasmModule.ccall(
      "_aes_gcm_decrypt",
      "string",
      ["array", "number", "array", "number", "array", "number", "array", "array", "number"],
      [
        inputBuffer, 
        inputBuffer.length, 
        keyBuffer, 
        keyBuffer.length, 
        iv, 
        iv.length, 
        aadBuffers, 
        aadBuffers.map(buf => buf.length), 
        aadBuffers.length
      ]
    );

    if (!result) {
      throw new Error("Decryption failed - authentication failed");
    }

    const text = Buffer.from(result, 'base64');
    return text.toString("utf8");
  } catch (err) {
    const error = err as Error;
    console.error("Decryption error:", error.message || error);
    throw new Error("Failed to decrypt data");
  }
};




