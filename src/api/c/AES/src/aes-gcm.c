#include "../inc/aes-gcm.h"
#include <string.h>
#include <stdio.h>

int aes_gcm_encrypt(unsigned char* output, 
                    const unsigned char* input, 
                    int input_length,
                    const unsigned char* key,
                    const size_t key_len,
                    const unsigned char * iv,
                    const size_t iv_len,
                    const unsigned char* aad,
                    const size_t aad_len){
    
    int ret = 0;
    gcm_t ctx;
    
    unsigned char tag_buf[TAG_LENGTH];
    
    gcm_set_key( &ctx, key, (const unsigned int)key_len );
    
    ret = gcm_encrypt_and_tag( &ctx, iv, iv_len, aad, aad_len,
                            input, output, input_length, tag_buf, TAG_LENGTH);
   
    
    memcpy(output + input_length, tag_buf, TAG_LENGTH);

    gcm_zero_ctx( &ctx );
    
    return ret;
}

int aes_gcm_decrypt(unsigned char* output,
                    const unsigned char* input,
                    int input_length,
                    const unsigned char* key,
                    const size_t key_len,
                    const unsigned char * iv,
                    const size_t iv_len,
                    const unsigned char* aad, 
                    const size_t aad_len){   
    int ret = 0;
    gcm_t ctx;
    
    size_t ciphertext_len = (input_length - TAG_LENGTH);
    const unsigned char *tag_buf = input + ciphertext_len;
    
    gcm_set_key(&ctx, key, (const unsigned int)key_len);
    ret = gcm_auth_decrypt(&ctx, iv, iv_len, aad, aad_len,
                            input, output, ciphertext_len, tag_buf, TAG_LENGTH);

    gcm_zero_ctx(&ctx);
    
    return ret;
}
