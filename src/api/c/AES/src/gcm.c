#include "../inc/gcm.h"
#include "../inc/aes.h"
#include "../inc/macros.h"
#include <stddef.h>
#include <stdint.h>
#include <string.h>

static const uint64_t last4[16] = {
  0x0000, 0x1c20, 0x3840, 0x2460, 0x7000, 0x6ca0, 0x48c0, 0x54e0,
  0xe100, 0xfd20, 0xd940, 0xc560, 0x9180, 0x8da0, 0xa9c0, 0xb5e0
};


static void gcm_mult( gcm_t *ctx,
                      const unsigned char x[16],
                      unsigned char output[16] )
{
    int i;
    unsigned char lo, hi, rem;
    uint64_t zh, zl;

    lo = (unsigned char)( x[15] & 0x0f );
    hi = (unsigned char)( x[15] >> 4 );
    zh = ctx->HH[lo];
    zl = ctx->HL[lo];

    for( i = 15; i >= 0; i-- ) {
        lo = (unsigned char) ( x[i] & 0x0f );
        hi = (unsigned char) ( x[i] >> 4 );

        if( i != 15 ) {
            rem = (unsigned char) ( zl & 0x0f );
            zl = ( zh << 60 ) | ( zl >> 4 );
            zh = ( zh >> 4 );
            zh ^= (uint64_t) last4[rem] << 48;
            zh ^= ctx->HH[lo];
            zl ^= ctx->HL[lo];
        }
        rem = (unsigned) ( zl & 0x0f );
        zl = ( zh << 60 ) | ( zl >> 4 );
        zh = ( zh >> 4 );
        zh ^= (uint64_t) last4[rem] << 48;
        zh ^= ctx->HH[hi];
        zl ^= ctx->HL[hi];
    }
    PUT_UINT32_BE( zh >> 32, output, 0 );
    PUT_UINT32_BE( zh, output, 4 );
    PUT_UINT32_BE( zl >> 32, output, 8 );
    PUT_UINT32_BE( zl, output, 12 );
}

static int gcm_run_methodes(gcm_t *ctx, 
                        int encryption_mode, 
                        const unsigned char *iv, 
                        size_t iv_len, 
                        const unsigned char *add, 
                        size_t add_len, 
                        const unsigned char *input, 
                        unsigned char *output, 
                        size_t length, 
                        unsigned char *tag, 
                        size_t tag_len){
  gcm_start  ( ctx, encryption_mode, iv, iv_len, add, add_len );
  gcm_update ( ctx, length, input, output );
  gcm_finish ( ctx, tag, tag_len );
  return 0;
}


int gcm_set_key(gcm_t *ctx, 
                const unsigned char *key, 
                const unsigned int key_size){
  int ret, i ,j;
  uint64_t hi, lo;
  uint64_t vl, vh;
  unsigned char h[16];
  
  memset(ctx, 0, sizeof(gcm_t));
  memset(h, 0, 16);

  if(( ret = aes_set_key( &ctx->ctx, ENCRYPTION, key, key_size )) != 0 )
    return ret ;
  if(( ret = aes_cipher( &ctx->ctx, h, h )) != 0 )
      return ret;

  GET_UINT32_BE(hi, h, 0);
  GET_UINT32_BE(lo, h, 4);
  vh = (uint64_t) hi << 32 | lo;

  GET_UINT32_BE(hi, h, 8);
  GET_UINT32_BE(lo, h, 12);
  vl = (uint64_t) hi  << 32 | lo;

  ctx->HL[8] = vl;
  ctx->HH[8] = vh;
  ctx->HH[0] = 0;
  ctx->HL[0] = 0;

   for( i = 4; i > 0; i >>= 1 ) {
        uint32_t T = (uint32_t) ( vl & 1 ) * 0xe1000000U;
        vl  = ( vh << 63 ) | ( vl >> 1 );
        vh  = ( vh >> 1 ) ^ ( (uint64_t) T << 32);
        ctx->HL[i] = vl;
        ctx->HH[i] = vh;
    }
    for (i = 2; i < 16; i <<= 1 ) {
        uint64_t *HiL = ctx->HL + i, *HiH = ctx->HH + i;
        vh = *HiH;
        vl = *HiL;
        for( j = 1; j < i; j++ ) {
            HiH[j] = vh ^ ctx->HH[j];
            HiL[j] = vl ^ ctx->HL[j];
        }
    }

   return 0;
}

int gcm_start(gcm_t *ctx, 
              int encryption_mode, 
              const unsigned char *iv, 
              size_t iv_len, 
              const unsigned char *add, 
              size_t add_len){
  int ret;
  unsigned char tBuf[16];
  const unsigned char *p;
  size_t tLen;
  size_t i;

  memset(ctx->y, 0x00, sizeof(ctx->y));
  memset(ctx->buf, 0x00, sizeof(ctx->buf));
  ctx->len = 0;
  ctx->add_len = 0;

  ctx->encryption_mode = encryption_mode;
  ctx->ctx.encryption_mode = ENCRYPTION;

  if(iv_len == 12){
    memcpy(ctx->y, iv, iv_len);
    ctx->y[15] = 1;
  }
  else{
    memset(tBuf, 0x00, 16);
    PUT_UINT32_BE(iv_len * 8, tBuf, 12);

    p = iv;
     while( iv_len > 0 ) {
            tLen = ( iv_len < 16 ) ? iv_len : 16;
            for( i = 0; i < tLen; i++ ) ctx->y[i] ^= p[i];
            gcm_mult( ctx, ctx->y, ctx->y );
            iv_len -= tLen;
            p += tLen;
        }
    for( i = 0; i < 16; i++ ) ctx->y[i] ^= tBuf[i];
    gcm_mult( ctx, ctx->y, ctx->y );
  }

  if( ( ret = aes_cipher( &ctx->ctx, ctx->y, ctx->base_ectr ) ) != 0 )
        return ret;

    ctx->add_len = add_len;
    p = add;
    while( add_len > 0 ) {
        tLen = ( add_len < 16 ) ? add_len : 16;
        for( i = 0; i < tLen; i++ ) ctx->buf[i] ^= p[i];
        gcm_mult( ctx, ctx->buf, ctx->buf );
        add_len -= tLen;
        p += tLen;
    }

    return 0;
}

int gcm_update(gcm_t *ctx, 
               size_t length, 
               const unsigned char *input, 
               unsigned char *output){
  int ret;
  unsigned char ectr[16];
  size_t tLen;
  size_t i;

  ctx->len += length;

  while(length > 0){
    tLen = (length < 16) ? length : 16;
    
    for( i = 16; i > 12; i-- ) if( ++ctx->y[i - 1] != 0 ) break;

    if( ( ret = aes_cipher( &ctx->ctx, ctx->y, ectr ) ) != 0 )
            return ret;

    if( ctx->encryption_mode == ENCRYPTION ){
      for( i = 0; i < tLen; i++ ) {
        output[i] = (unsigned char) ( ectr[i] ^ input[i] );
        ctx->buf[i] ^= output[i];
      }
    }else{
      for( i = 0; i < tLen; i++ ) {
          ctx->buf[i] ^= input[i];
          output[i] = (unsigned char) ( ectr[i] ^ input[i] );
      }
    }
    gcm_mult(ctx, ctx->buf, ctx->buf);

    length -= tLen;
    input +=  tLen;
    output += tLen;
  }
  return 0;
}

int gcm_finish(gcm_t *ctx,
               unsigned char *tag,
               size_t tag_len){
  unsigned char tBuf[16];
  uint64_t origin_len     = ctx->len * 8;
  uint64_t origin_add_len = ctx->add_len * 8;
  size_t i;

  if( tag_len != 0 ) memcpy( tag, ctx->base_ectr, tag_len );

  if( origin_len || origin_add_len ) {
      memset( tBuf, 0x00, 16 );

      PUT_UINT32_BE( ( origin_add_len >> 32 ), tBuf, 0  );
      PUT_UINT32_BE( ( origin_add_len       ), tBuf, 4  );
      PUT_UINT32_BE( ( origin_len     >> 32 ), tBuf, 8  );
      PUT_UINT32_BE( ( origin_len           ), tBuf, 12 );

      for( i = 0; i < 16; i++ ) ctx->buf[i] ^= tBuf[i];
      gcm_mult( ctx, ctx->buf, ctx->buf );
      for( i = 0; i < tag_len; i++ ) tag[i] ^= ctx->buf[i];
  }
  return 0 ;
}

int gcm_encrypt_and_tag(gcm_t *ctx, 
                        const unsigned char *iv, 
                        size_t iv_len, 
                        const unsigned char *add, 
                        size_t add_len, 
                        const unsigned char *input, 
                        unsigned char *output, 
                        size_t length, 
                        unsigned char *tag, 
                        size_t tag_len){
  gcm_run_methodes(ctx, ENCRYPTION, iv, iv_len, add, add_len, input, output, length, tag, tag_len);
  return 0;
}

int gcm_auth_decrypt(gcm_t *ctx, 
                     const unsigned char *iv, 
                     size_t iv_len, 
                     const unsigned char *add, 
                     size_t add_len, 
                     const unsigned char *input, 
                     unsigned char *output, 
                     size_t length, 
                     const unsigned char *tag,
                     size_t tag_len){
  unsigned char check_tag[16];
  int diff;
  size_t i;

  gcm_run_methodes(ctx, DECRYPTION, iv, iv_len, add, add_len, input, output, length, check_tag, tag_len);
  
  for( diff = 0, i = 0; i < tag_len; i++ )
        diff |= tag[i] ^ check_tag[i];

  if(diff != 0){
    memset(output, 0, length);
    return -1;
  }
  return 0;
}

void gcm_zero_ctx( gcm_t *ctx )
{
    memset( ctx, 0, sizeof( gcm_t ) );
}
