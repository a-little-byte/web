import { createRequire } from 'node:module';

const require = createRequire(import.meta.url)
const hash = require('./build/Release/hash.node');

const generateSalt = (length = 16) => {
    const array = new Uint8Array(length);
    crypto.getRandomValues(array);
    return Buffer.from(array).toString('base64');
}

export const Hash = (password:string, pepper:string, iterations:Number = 10000, keylen:Number = 32) => {
    const salt = generateSalt()
        
    if (!password) {
        throw new Error('Password and salt are required');
    }
        
    return {hash: hash.hash(password, salt, pepper || '', iterations, keylen), salt};
  }
export const Verify = (storedHash: string, password:string, salt:string, pepper:string, iterations:Number = 10000, keylen:Number = 32) => {
    if (!storedHash || !password || !salt) {
        throw new Error('Stored hash, password, and salt are required');
    }
    return hash.verify(storedHash, password, salt, pepper || '', iterations, keylen);
}

