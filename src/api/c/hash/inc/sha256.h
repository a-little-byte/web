#ifndef SHA256_H
#define SHA256_H

#include <stdint.h>
#include <stdlib.h>

#define SHA256_BLOCK_SIZE 64
#define SHA256_DIGEST_SIZE 32

#define ROTRIGHT(a,b) (((a) >> (b)) | ((a) << (32-(b))))
#define CH(x,y,z) (((x) & (y)) ^ (~(x) & (z)))
#define MAJ(x,y,z) (((x) & (y)) ^ ((x) & (z)) ^ ((y) & (z)))
#define EP0(x) (ROTRIGHT(x,2) ^ ROTRIGHT(x,13) ^ ROTRIGHT(x,22))
#define EP1(x) (ROTRIGHT(x,6) ^ ROTRIGHT(x,11) ^ ROTRIGHT(x,25))
#define SIG0(x) (ROTRIGHT(x,7) ^ ROTRIGHT(x,18) ^ ((x) >> 3))
#define SIG1(x) (ROTRIGHT(x,17) ^ ROTRIGHT(x,19) ^ ((x) >> 10))


typedef struct SHA256_CTX {
    uint32_t state[8];
    uint64_t bitlen;
    uint8_t data[SHA256_BLOCK_SIZE];
    uint16_t len;
} sha256_t;



void sha256_init(sha256_t *ctx);
void sha256_update(sha256_t *ctx, const uint8_t data[], size_t len);
void sha256_final(sha256_t *ctx, uint8_t hash[SHA256_DIGEST_SIZE]);
void hmac_sha256(const unsigned char *key, size_t keylen, 
                 const unsigned char *data, size_t datalen,
                 unsigned char *result);


#endif