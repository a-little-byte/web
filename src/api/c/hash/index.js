const hash = require('./build/Release/hash.node');

const generateSalt = (length = 16) => {
    const array = new Uint8Array(length);
    crypto.getRandomValues(array);
    return Buffer.from(array).toString('base64');
}

module.exports = {
    hash: (password, salt, pepper, iterations = 10000, keylen = 32) => {
        if (!password || !salt) {
            throw new Error('Password and salt are required');
        }
        return hash.hash(password, salt, pepper || '', iterations, keylen);
    },
    verify: (storedHash, password, salt, pepper, iterations = 10000, keylen = 32) => {
        if (!storedHash || !password || !salt) {
            throw new Error('Stored hash, password, and salt are required');
        }
        return hash.verify(storedHash, password, salt, pepper || '', iterations, keylen);
    },
    generateSalt
}; 
