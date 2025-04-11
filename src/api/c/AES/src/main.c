#include <emscripten.h>
#include <string.h>
#include <stdlib.h>
#include "../inc/aes-gcm.h"

unsigned char* concat_aad_buffers(const unsigned char** aad_buffers, 
                                 const size_t* aad_lengths, 
                                 size_t num_aad, 
                                 size_t* total_aad_len) {
    *total_aad_len = 0;
    for (size_t i = 0; i < num_aad; i++) {
        *total_aad_len += aad_lengths[i];
    }
    
    unsigned char* combined_aad = (unsigned char*)malloc(*total_aad_len);
    if (!combined_aad) return NULL;
    
    size_t offset = 0;
    for (size_t i = 0; i < num_aad; i++) {
        memcpy(combined_aad + offset, aad_buffers[i], aad_lengths[i]);
        offset += aad_lengths[i];
    }
    
    return combined_aad;
}

EMSCRIPTEN_KEEPALIVE
int _aes_gcm_encrypt(unsigned char* output,
                     const unsigned char* input,
                     int input_length,
                     const unsigned char* key,
                     const size_t key_len,
                     const unsigned char* iv,
                     const size_t iv_len,
                     const unsigned char** aad_buffers,
                     const size_t* aad_lengths,
                     size_t num_aad) {
    size_t total_aad_len = 0;
    unsigned char* combined_aad = NULL;
    int result;
    
    if (num_aad > 0 && aad_buffers != NULL && aad_lengths != NULL) {
        combined_aad = concat_aad_buffers(aad_buffers, aad_lengths, num_aad, &total_aad_len);
        if (!combined_aad) return -1;
    }
    
    result = aes_gcm_encrypt(output, input, input_length, key, key_len, iv, iv_len, 
                           combined_aad, total_aad_len);
    
    if (combined_aad) {
        free(combined_aad);
    }
    
    return result;
}

EMSCRIPTEN_KEEPALIVE
int _aes_gcm_decrypt(unsigned char* output,
                     const unsigned char* input,
                     int input_length,
                     const unsigned char* key,
                     const size_t key_len,
                     const unsigned char* iv,
                     const size_t iv_len,
                     const unsigned char** aad_buffers,
                     const size_t* aad_lengths,
                     size_t num_aad) {
    
    size_t total_aad_len = 0;
    unsigned char* combined_aad = NULL;
    int result;
    
    if (num_aad > 0 && aad_buffers != NULL && aad_lengths != NULL) {
        combined_aad = concat_aad_buffers(aad_buffers, aad_lengths, num_aad, &total_aad_len);
        if (!combined_aad) return -1;
    }
    
    result = aes_gcm_decrypt(output, input, input_length, key, key_len, iv, iv_len, 
                           combined_aad, total_aad_len);
    
    if (combined_aad) {
        free(combined_aad);
    }
    
    return result;
}
