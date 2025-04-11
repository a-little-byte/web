#include "../inc/aes.h"
#include "../inc/macros.h"
#include <stdint.h>
#include <string.h>

static int tables_init = 0;

// Forward substatution box
static unsigned char Fsb[256];
static uint32_t Ft0[256];
static uint32_t Ft1[256];
static uint32_t Ft2[256];
static uint32_t Ft3[256];

// Reverse substatution box
static unsigned char Rsb[256];
static uint32_t Rt0[256]; 
static uint32_t Rt1[256];
static uint32_t Rt2[256];
static uint32_t Rt3[256];

// AES round constants
static uint32_t Rcon[10];

static int aes_set_round_key_constants(aes_t *ctx, 
                                  const unsigned char *key,
                                  unsigned int key_size){
  unsigned int i;
  uint32_t *Rk = ctx->rk;
 
  for(i = 0;i<(key_size >> 2); i++)
    GET_UINT32_LE(Rk[i], key, i<<2);
  
  switch (ctx->rounds) {
    case 10:
      for( i = 0; i < 10; i++, Rk += 4 ) {
          Rk[4]  = Rk[0] ^ Rcon[i] ^
          ( (uint32_t) Fsb[ ( Rk[3] >>  8 ) & 0xFF ]       ) ^
          ( (uint32_t) Fsb[ ( Rk[3] >> 16 ) & 0xFF ] <<  8 ) ^
          ( (uint32_t) Fsb[ ( Rk[3] >> 24 ) & 0xFF ] << 16 ) ^
          ( (uint32_t) Fsb[ ( Rk[3]       ) & 0xFF ] << 24 );

          Rk[5]  = Rk[1] ^ Rk[4];
          Rk[6]  = Rk[2] ^ Rk[5];
          Rk[7]  = Rk[3] ^ Rk[6];
      }
      break;
    case 12:
      for( i = 0; i < 8; i++, Rk += 6 ) {
          Rk[6]  = Rk[0] ^ Rcon[i] ^
          ( (uint32_t) Fsb[ ( Rk[5] >>  8 ) & 0xFF ]       ) ^
          ( (uint32_t) Fsb[ ( Rk[5] >> 16 ) & 0xFF ] <<  8 ) ^
          ( (uint32_t) Fsb[ ( Rk[5] >> 24 ) & 0xFF ] << 16 ) ^
          ( (uint32_t) Fsb[ ( Rk[5]       ) & 0xFF ] << 24 );

          Rk[7]  = Rk[1] ^ Rk[6];
          Rk[8]  = Rk[2] ^ Rk[7];
          Rk[9]  = Rk[3] ^ Rk[8];
          Rk[10] = Rk[4] ^ Rk[9];
          Rk[11] = Rk[5] ^ Rk[10];
      }
      break;
    case 14:
      for( i = 0; i < 7; i++, Rk += 8 ) {
        Rk[8]  = Rk[0] ^ Rcon[i] ^
        ( (uint32_t) Fsb[ ( Rk[7] >>  8 ) & 0xFF ]       ) ^
        ( (uint32_t) Fsb[ ( Rk[7] >> 16 ) & 0xFF ] <<  8 ) ^
        ( (uint32_t) Fsb[ ( Rk[7] >> 24 ) & 0xFF ] << 16 ) ^
        ( (uint32_t) Fsb[ ( Rk[7]       ) & 0xFF ] << 24 );

        Rk[9]  = Rk[1] ^ Rk[8];
        Rk[10] = Rk[2] ^ Rk[9];
        Rk[11] = Rk[3] ^ Rk[10];

        Rk[12] = Rk[4] ^
        ( (uint32_t) Fsb[ ( Rk[11]       ) & 0xFF ]       ) ^
        ( (uint32_t) Fsb[ ( Rk[11] >>  8 ) & 0xFF ] <<  8 ) ^
        ( (uint32_t) Fsb[ ( Rk[11] >> 16 ) & 0xFF ] << 16 ) ^
        ( (uint32_t) Fsb[ ( Rk[11] >> 24 ) & 0xFF ] << 24 );

        Rk[13] = Rk[5] ^ Rk[12];
        Rk[14] = Rk[6] ^ Rk[13];
        Rk[15] = Rk[7] ^ Rk[14];
      }
      break;
    default:
      return -1; 
  }

  return 0;
}

static int aes_set_round_key_constants_decryption(aes_t *ctx,
                                           const unsigned char *key,
                                           unsigned int key_size){
  int i, j;
  aes_t cty;
  uint32_t *Rk = ctx->rk;
  uint32_t *Sk;
  int ret;

  cty.rounds = ctx->rounds;
  cty.rk = cty.buf;

  if(( ret = aes_set_round_key_constants(&cty, key, key_size)) == 0)
    return ret;

  Sk = cty.rk + cty.rounds * 4;

  CPY128

  for( i = ctx->rounds - 1, Sk -= 8; i > 0; i--, Sk -= 8 ) {
        for( j = 0; j < 4; j++, Sk++ ) {
            *Rk++ = Rt0[ Fsb[ ( *Sk       ) & 0xFF ] ] ^
                    Rt1[ Fsb[ ( *Sk >>  8 ) & 0xFF ] ] ^
                    Rt2[ Fsb[ ( *Sk >> 16 ) & 0xFF ] ] ^
                    Rt3[ Fsb[ ( *Sk >> 24 ) & 0xFF ] ];
        }
    }

  CPY128
  memset(&cty, 0, sizeof(aes_t));
  return 0;
}


static void aes_init_keygen_tables(int encryption_mode)
{
    int i, x, y, z;
    int pow[256];
    int log[256];

    if (tables_init) return;

    for (i = 0, x = 1; i < 256; i++) {
        pow[i] = x;
        log[x] = i;
        x = (x ^ XTIME(x)) & 0xFF;
    }

    for (i = 0, x = 1; i < 10; i++) {
        Rcon[i] = (uint32_t)x;
        x = XTIME(x) & 0xFF;
    }
    
    ENCRYPTION_MODE(Fsb[0x00] = 0x63, Rsb[0x63] = 0x00);

    for (i = 1; i < 256; i++) {
        x = y = pow[255 - log[i]];
        MIX(x, y);
        MIX(x, y);
        MIX(x, y);
        MIX(x, y);
        ENCRYPTION_MODE(Fsb[i] = (unsigned char)(x ^= 0x63), Rsb[x] = (unsigned char)i);
    }

    for (i = 0; i < 256; i++) {
        x = Fsb[i];
        y = XTIME(x) & 0xFF;
        z = (y ^ x) & 0xFF;
        
        if(encryption_mode == ENCRYPTION){
          Ft0[i] = ((uint32_t)y) ^ ((uint32_t)x << 8) ^
                  ((uint32_t)x << 16) ^ ((uint32_t)z << 24);

          Ft1[i] = ROTL8(Ft0[i]);
          Ft2[i] = ROTL8(Ft1[i]);
          Ft3[i] = ROTL8(Ft2[i]);
        }else if(encryption_mode == DECRYPTION){
          x = Rsb[i];

          Rt0[i] = ((uint32_t)MUL(0x0E, x)) ^
                  ((uint32_t)MUL(0x09, x) << 8) ^
                  ((uint32_t)MUL(0x0D, x) << 16) ^
                  ((uint32_t)MUL(0x0B, x) << 24);

          Rt1[i] = ROTL8(Rt0[i]);
          Rt2[i] = ROTL8(Rt1[i]);
          Rt3[i] = ROTL8(Rt2[i]);
        }
    }
    tables_init = 1;
}

int aes_set_key(aes_t *ctx,
                int encryption_mode,
                const unsigned char *key,
                unsigned int key_size){
  ctx->encryption_mode = encryption_mode;
  ctx->rk = ctx->buf;
  aes_init_keygen_tables(encryption_mode);  

  switch(key_size){
    case 16: ctx->rounds = 10; break;
    case 24: ctx->rounds = 12; break;
    case 32: ctx->rounds = 14; break;
  }

    if( encryption_mode == DECRYPTION )
        return aes_set_round_key_constants_decryption( ctx, key, key_size );
    else if (encryption_mode == ENCRYPTION)      
      return aes_set_round_key_constants( ctx, key, key_size );
  
  return 0;
}

int aes_cipher(aes_t *ctx,
               const unsigned char input[16],
               unsigned char output[16]){
  int i;
  uint32_t *Rk, X0, X1, X2, X3, Y0, Y1, Y2, Y3;

  Rk = ctx->rk;

  GET_UINT32_LE(X0, input, 0); X0 ^= *Rk++;
  GET_UINT32_LE(X1, input, 4); X1 ^= *Rk++;
  GET_UINT32_LE(X2, input, 8); X2 ^= *Rk++;
  GET_UINT32_LE(X3, input, 12);X3 ^= *Rk++;

  if( ctx->encryption_mode == DECRYPTION )
  {
      for( i = (ctx->rounds >> 1) - 1; i > 0; i-- )
      {
          AES_RROUND( Y0, Y1, Y2, Y3, X0, X1, X2, X3 );
          AES_RROUND( X0, X1, X2, X3, Y0, Y1, Y2, Y3 );
      }

      AES_RROUND( Y0, Y1, Y2, Y3, X0, X1, X2, X3 );

      X0 = *Rk++ ^ \
              ( (uint32_t) Rsb[ ( Y0       ) & 0xFF ]       ) ^
              ( (uint32_t) Rsb[ ( Y3 >>  8 ) & 0xFF ] <<  8 ) ^
              ( (uint32_t) Rsb[ ( Y2 >> 16 ) & 0xFF ] << 16 ) ^
              ( (uint32_t) Rsb[ ( Y1 >> 24 ) & 0xFF ] << 24 );

      X1 = *Rk++ ^ \
              ( (uint32_t) Rsb[ ( Y1       ) & 0xFF ]       ) ^
              ( (uint32_t) Rsb[ ( Y0 >>  8 ) & 0xFF ] <<  8 ) ^
              ( (uint32_t) Rsb[ ( Y3 >> 16 ) & 0xFF ] << 16 ) ^
              ( (uint32_t) Rsb[ ( Y2 >> 24 ) & 0xFF ] << 24 );

      X2 = *Rk++ ^ \
              ( (uint32_t) Rsb[ ( Y2       ) & 0xFF ]       ) ^
              ( (uint32_t) Rsb[ ( Y1 >>  8 ) & 0xFF ] <<  8 ) ^
              ( (uint32_t) Rsb[ ( Y0 >> 16 ) & 0xFF ] << 16 ) ^
              ( (uint32_t) Rsb[ ( Y3 >> 24 ) & 0xFF ] << 24 );

      X3 = *Rk++ ^ \
              ( (uint32_t) Rsb[ ( Y3       ) & 0xFF ]       ) ^
              ( (uint32_t) Rsb[ ( Y2 >>  8 ) & 0xFF ] <<  8 ) ^
              ( (uint32_t) Rsb[ ( Y1 >> 16 ) & 0xFF ] << 16 ) ^
              ( (uint32_t) Rsb[ ( Y0 >> 24 ) & 0xFF ] << 24 );
  }else if(ctx->encryption_mode == ENCRYPTION){
     for( i = (ctx->rounds >> 1) - 1; i > 0; i-- )
        {
            AES_FROUND( Y0, Y1, Y2, Y3, X0, X1, X2, X3 );
            AES_FROUND( X0, X1, X2, X3, Y0, Y1, Y2, Y3 );
        }

        AES_FROUND( Y0, Y1, Y2, Y3, X0, X1, X2, X3 );

        X0 = *Rk++ ^ \
                ( (uint32_t) Fsb[ ( Y0       ) & 0xFF ]       ) ^
                ( (uint32_t) Fsb[ ( Y1 >>  8 ) & 0xFF ] <<  8 ) ^
                ( (uint32_t) Fsb[ ( Y2 >> 16 ) & 0xFF ] << 16 ) ^
                ( (uint32_t) Fsb[ ( Y3 >> 24 ) & 0xFF ] << 24 );

        X1 = *Rk++ ^ \
                ( (uint32_t) Fsb[ ( Y1       ) & 0xFF ]       ) ^
                ( (uint32_t) Fsb[ ( Y2 >>  8 ) & 0xFF ] <<  8 ) ^
                ( (uint32_t) Fsb[ ( Y3 >> 16 ) & 0xFF ] << 16 ) ^
                ( (uint32_t) Fsb[ ( Y0 >> 24 ) & 0xFF ] << 24 );

        X2 = *Rk++ ^ \
                ( (uint32_t) Fsb[ ( Y2       ) & 0xFF ]       ) ^
                ( (uint32_t) Fsb[ ( Y3 >>  8 ) & 0xFF ] <<  8 ) ^
                ( (uint32_t) Fsb[ ( Y0 >> 16 ) & 0xFF ] << 16 ) ^
                ( (uint32_t) Fsb[ ( Y1 >> 24 ) & 0xFF ] << 24 );

        X3 = *Rk++ ^ \
                ( (uint32_t) Fsb[ ( Y3       ) & 0xFF ]       ) ^
                ( (uint32_t) Fsb[ ( Y0 >>  8 ) & 0xFF ] <<  8 ) ^
                ( (uint32_t) Fsb[ ( Y1 >> 16 ) & 0xFF ] << 16 ) ^
                ( (uint32_t) Fsb[ ( Y2 >> 24 ) & 0xFF ] << 24 );


        PUT_UINT32_LE( X0, output,  0 );
        PUT_UINT32_LE( X1, output,  4 );
        PUT_UINT32_LE( X2, output,  8 );
        PUT_UINT32_LE( X3, output, 12 );
  }
  return 0;
}

