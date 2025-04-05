#include <emscripten.h>
#include <string.h>
#include <stdlib.h>
#include "../inc/pbkdf2.h"
#include "../inc/utils.h"

EMSCRIPTEN_KEEPALIVE
char* _hash(const char* password, const char* salt_str, const char* pepper, int iterations, int keylen) {
    if (!password || !salt_str || !pepper) return NULL;
    
    size_t password_len = strlen(password);
    size_t salt_len = strlen(salt_str);
    size_t pepper_len = strlen(pepper);

    unsigned char* salt = (unsigned char*)malloc(salt_len);
    if (!salt) return NULL;
    
    size_t decoded_salt_len = base64_decode(salt_str, salt, salt_len);
    if (decoded_salt_len == 0) {
        free(salt);
        return NULL;
    }

    unsigned char* output = (unsigned char*)malloc(keylen);
    if (!output) {
        free(salt);
        return NULL;
    }

    pbkdf2(password, password_len, salt, decoded_salt_len,
           pepper, pepper_len, iterations, output, keylen);

    size_t base64_len = ((keylen + 2) / 3) * 4 + 1;
    char* base64_output = (char*)malloc(base64_len);
    if (!base64_output) {
        free(salt);
        free(output);
        return NULL;
    }

    base64_encode(output, keylen, base64_output, base64_len);
    
    free(salt);
    free(output);

    return base64_output;
}

EMSCRIPTEN_KEEPALIVE
int _verify(const char* stored_hash, const char* password, const char* salt_str, const char* pepper, int iterations, int keylen) {
    if (!stored_hash || !password || !salt_str || !pepper) return 0;
    
    char* computed_hash = _hash(password, salt_str, pepper, iterations, keylen);
    if (!computed_hash) return 0;
    
    int result = strcmp(stored_hash, computed_hash) == 0;
    free(computed_hash);
    return result;
}
