import type { EmscriptenModule } from '../types';
import crypto from 'node:crypto';

type HashModule = {
  _hash: (password: string, salt: string, pepper: string, iterations: number, keylen: number) => string;
  _verify: (storedHash: string, password: string, salt: string, pepper: string, iterations: number, keylen: number) => boolean;
  ccall: (name: string, returnType: string, argTypes: string[], args: any[]) => any;
}

let wasmModule: EmscriptenModule | null = null;
let initPromise: Promise<void> | null = null;

const initWasmModule = async () => {
  if (!initPromise) {
    initPromise = (async () => {
      try {
        if (typeof window === 'undefined') {
          // Server-side
          const { default: moduleFactory } = await import('./build/hash.js');
          wasmModule = await moduleFactory();
        } else {
          // Client-side
          const moduleFactory = (await import('./build/hash.js')).default;
          wasmModule = await moduleFactory();
        }
      } catch (err) {
        console.error('Failed to initialize WASM hash module:', err);
        initPromise = null;
        throw new Error('Hash module failed to initialize');
      }
    })();
  }
  return initPromise;
};

const generateSalt = (length = 16) => {
  return crypto.randomBytes(length).toString('base64');
};

export const Hash = async (password: string, pepper: string = '', iterations: number = 10000, keylen: number = 32) => {
  if (!password) {
    throw new Error('Password is required');
  }
  
  const salt = generateSalt();
  
  try {
    await initWasmModule();
    
    if (!wasmModule?.ccall) {
      throw new Error('WASM module not properly initialized');
    }
    
    const result = wasmModule.ccall(
      '_hash',
      'string',
      ['string', 'string', 'string', 'number', 'number'],
      [password, salt, pepper, iterations, keylen]
    );
    
    if (!result) {
      throw new Error('Hash generation failed');
    }
    
    return { hash: result, salt };
  } catch (err) {
    const error = err as Error;
    console.error('Hash generation error:', error.message || error);
    throw new Error('Failed to generate hash');
  }
};

export const Verify = async (password: string, storedHash: string, salt: string, pepper: string = '', iterations: number = 10000, keylen: number = 32) => {
  if (!storedHash || !password || !salt) {
    throw new Error('Password, stored hash, and salt are required');
  }
  
  try {
    await initWasmModule();
    
    if (!wasmModule?.ccall) {
      throw new Error('WASM module not properly initialized');
    }
    
    const result = wasmModule.ccall(
      '_verify',
      'number',
      ['string', 'string', 'string', 'string', 'number', 'number'],
      [storedHash, password, salt, pepper, iterations, keylen]
    );
    
    return result === 1;
  } catch (err) {
    const error = err as Error;
    console.error('Hash verification error:', error.message || error);
    throw new Error('Failed to verify hash');
  }
};
