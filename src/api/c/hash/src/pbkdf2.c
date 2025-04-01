#include "../inc/pbkdf2.h"
#include "../inc/sha256.h"
#include <string.h>

void pbkdf2(const char *password, size_t password_len,
            const unsigned char *salt, size_t salt_len,
            const char *pepper, size_t pepper_len,
            unsigned int iterations,
            unsigned char *output, size_t output_len) {
    unsigned char digest[SHA256_DIGEST_SIZE];
    unsigned char block[SHA256_DIGEST_SIZE];
    unsigned char saltbuf[128]; 
    unsigned char peppered_password[256];
    unsigned int i, j, k;
    unsigned int blocks_needed = (output_len + SHA256_DIGEST_SIZE - 1) / SHA256_DIGEST_SIZE;

    if (pepper != NULL && pepper_len > 0) {
        memcpy(peppered_password, pepper, pepper_len);
        memcpy(peppered_password + pepper_len, password, password_len);
        password = (const char *)peppered_password;
        password_len = pepper_len + password_len;
    }

    for (i = 1; i <= blocks_needed; i++) {
        memcpy(saltbuf, salt, salt_len);
        
        saltbuf[salt_len] = (i >> 24) & 0xFF;
        saltbuf[salt_len + 1] = (i >> 16) & 0xFF;
        saltbuf[salt_len + 2] = (i >> 8) & 0xFF;
        saltbuf[salt_len + 3] = i & 0xFF;

        hmac_sha256((const unsigned char *)password, password_len, 
                   saltbuf, salt_len + 4, digest);
        memcpy(block, digest, SHA256_DIGEST_SIZE);

        for (j = 1; j < iterations; j++) {
            hmac_sha256((const unsigned char *)password, password_len, 
                       digest, SHA256_DIGEST_SIZE, digest);
            
            for (k = 0; k < SHA256_DIGEST_SIZE; k++) {
                block[k] ^= digest[k];
            }
        }

        size_t copy_len = (i == blocks_needed && output_len % SHA256_DIGEST_SIZE != 0) 
                          ? output_len % SHA256_DIGEST_SIZE 
                          : SHA256_DIGEST_SIZE;
        memcpy(output + (i - 1) * SHA256_DIGEST_SIZE, block, copy_len);
    }
}
