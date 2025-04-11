#ifndef AES_GCM_H
#define AES_GCM_H

#include "gcm.h"  

#define TAG_LENGTH 16

int aes_gcm_encrypt(unsigned char* output, 
      const unsigned char* input, 
      int input_length, 
      const unsigned char* key, 
      const size_t key_len, 
      const unsigned char * iv,
      const size_t iv_len,
      const unsigned char* aad, 
      const size_t aad_len);

int aes_gcm_decrypt(unsigned char* output, 
    const unsigned char* input, 
    int input_length, 
    const unsigned char* key, 
    const size_t key_len, 
    const unsigned char * iv, 
    const size_t iv_len,
    const unsigned char* aad, 
    const size_t aad_len);


#endif
