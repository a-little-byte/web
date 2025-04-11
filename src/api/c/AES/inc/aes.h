#ifndef AES_H
#define AES_H

#include <inttypes.h>
#include <stdint.h>

#define ENCRYPTION 1
#define DECRYPTION 0

typedef struct{
  int encryption_mode;
  int rounds;
  uint32_t *rk;
  uint32_t buf[68];
} aes_t;

// void keygen_tables(int encryption_mode);
int aes_set_key(aes_t *ctx,
                int encryption_mode,
                const unsigned char *key,
                unsigned int key_size);
int aes_cipher(aes_t *ctx,
               const unsigned char input[16],
               unsigned char output[16]);

#endif
