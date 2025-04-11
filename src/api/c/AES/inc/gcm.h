#ifndef GCM_H
#define GCM_H

#include "aes.h"
#include <stddef.h>
#include <stdint.h>
typedef struct {
  int encryption_mode;
  uint64_t len;
  uint64_t add_len;
  uint64_t HL[16];
  uint64_t HH[16];
  unsigned char base_ectr[16];
  unsigned char y[16];
  unsigned char buf[16];
  aes_t ctx;
} gcm_t;

int gcm_set_key(gcm_t *ctx,
                const unsigned char *key,
                const unsigned int key_size);
int gcm_auth_decrypt(
    gcm_t *ctx,
    const unsigned char *iv,
    size_t iv_len,
    const unsigned char *add,
    size_t add_len,
    const unsigned char *input,
    unsigned char *output,
    size_t length,
    const unsigned char *tag,
    size_t tag_len
    );
int gcm_encrypt_and_tag(
    gcm_t *ctx,
    const unsigned char *iv,
    size_t iv_len,
    const unsigned char *add,
    size_t add_len,
    const unsigned char *input,
    unsigned char *output,
    size_t length,
    unsigned char *tag,
    size_t tag_len
    );
int gcm_start(gcm_t *ctx,
              int encryption_mode,
              const unsigned char *iv,
              size_t iv_len,
              const unsigned char *add,
              size_t add_len);
int gcm_update(gcm_t *ctx,
               size_t length,
               const unsigned char *input,
               unsigned char *output);
int gcm_finish(gcm_t *ctx,
               unsigned char *tag,
               size_t tag_len);

void gcm_zero_ctx(gcm_t *ctx);

#endif
