import { initWasmModule } from "../utils";
import crypto from "node:crypto";

const module = "hash";

const generateSalt = (length = 16) => {
  return crypto.randomBytes(length).toString("base64");
};

export const Hash = async (
  password: string,
  pepper: string = "",
  iterations: number = 10000,
  keylen: number = 32,
) => {
  if (!password) {
    throw new Error("Password is required");
  }

  const salt = generateSalt();

  try {
    const wasmModule = await initWasmModule(module);

    if (!wasmModule?.ccall) {
      throw new Error("WASM module not properly initialized");
    }

    const result = wasmModule.ccall(
      "_hash",
      "string",
      ["string", "string", "string", "number", "number"],
      [password, salt, pepper, iterations, keylen],
    );

    if (!result) {
      throw new Error("Hash generation failed");
    }

    return { hash: result, salt };
  } catch (err) {
    const error = err as Error;
    console.error("Hash generation error:", error.message || error);
    throw new Error("Failed to generate hash ");
  }
};

export const Verify = async (
  password: string,
  storedHash: string,
  salt: string,
  pepper: string = "",
  iterations: number = 10000,
  keylen: number = 32,
) => {
  if (!storedHash || !password || !salt) {
    throw new Error("Password, stored hash, and salt are required");
  }

  const wasmModule = await initWasmModule(module);

  if (!wasmModule?.ccall) {
    throw new Error("Hash: WASM module not properly initialized");
  }

  const result = wasmModule.ccall(
    "_verify",
    "number",
    ["string", "string", "string", "string", "number", "number"],
    [storedHash, password, salt, pepper, iterations, keylen],
  );

  return result === 1;
};
