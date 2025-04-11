#ifndef MACROS_H
#define MACROS_H

#define GET_UINT32_LE(n,b,i) {                  \
    (n) = ( (uint32_t) (b)[(i)    ]       )     \
        | ( (uint32_t) (b)[(i) + 1] <<  8 )     \
        | ( (uint32_t) (b)[(i) + 2] << 16 )     \
        | ( (uint32_t) (b)[(i) + 3] << 24 ); }

#define PUT_UINT32_LE(n,b,i) {                  \
    (b)[(i)    ] = (unsigned char) ( (n)       );       \
    (b)[(i) + 1] = (unsigned char) ( (n) >>  8 );       \
    (b)[(i) + 2] = (unsigned char) ( (n) >> 16 );       \
    (b)[(i) + 3] = (unsigned char) ( (n) >> 24 ); }

#define AES_FROUND(X0,X1,X2,X3,Y0,Y1,Y2,Y3)     \
{                                               \
    X0 = *Rk++ ^ Ft0[ ( Y0       ) & 0xFF ] ^   \
                 Ft1[ ( Y1 >>  8 ) & 0xFF ] ^   \
                 Ft2[ ( Y2 >> 16 ) & 0xFF ] ^   \
                 Ft3[ ( Y3 >> 24 ) & 0xFF ];    \
                                                \
    X1 = *Rk++ ^ Ft0[ ( Y1       ) & 0xFF ] ^   \
                 Ft1[ ( Y2 >>  8 ) & 0xFF ] ^   \
                 Ft2[ ( Y3 >> 16 ) & 0xFF ] ^   \
                 Ft3[ ( Y0 >> 24 ) & 0xFF ];    \
                                                \
    X2 = *Rk++ ^ Ft0[ ( Y2       ) & 0xFF ] ^   \
                 Ft1[ ( Y3 >>  8 ) & 0xFF ] ^   \
                 Ft2[ ( Y0 >> 16 ) & 0xFF ] ^   \
                 Ft3[ ( Y1 >> 24 ) & 0xFF ];    \
                                                \
    X3 = *Rk++ ^ Ft0[ ( Y3       ) & 0xFF ] ^   \
                 Ft1[ ( Y0 >>  8 ) & 0xFF ] ^   \
                 Ft2[ ( Y1 >> 16 ) & 0xFF ] ^   \
                 Ft3[ ( Y2 >> 24 ) & 0xFF ];    \
}

#define AES_RROUND(X0,X1,X2,X3,Y0,Y1,Y2,Y3)     \
{                                               \
    X0 = *Rk++ ^ Rt0[ ( Y0       ) & 0xFF ] ^   \
                 Rt1[ ( Y3 >>  8 ) & 0xFF ] ^   \
                 Rt2[ ( Y2 >> 16 ) & 0xFF ] ^   \
                 Rt3[ ( Y1 >> 24 ) & 0xFF ];    \
                                                \
    X1 = *Rk++ ^ Rt0[ ( Y1       ) & 0xFF ] ^   \
                 Rt1[ ( Y0 >>  8 ) & 0xFF ] ^   \
                 Rt2[ ( Y3 >> 16 ) & 0xFF ] ^   \
                 Rt3[ ( Y2 >> 24 ) & 0xFF ];    \
                                                \
    X2 = *Rk++ ^ Rt0[ ( Y2       ) & 0xFF ] ^   \
                 Rt1[ ( Y1 >>  8 ) & 0xFF ] ^   \
                 Rt2[ ( Y0 >> 16 ) & 0xFF ] ^   \
                 Rt3[ ( Y3 >> 24 ) & 0xFF ];    \
                                                \
    X3 = *Rk++ ^ Rt0[ ( Y3       ) & 0xFF ] ^   \
                 Rt1[ ( Y2 >>  8 ) & 0xFF ] ^   \
                 Rt2[ ( Y1 >> 16 ) & 0xFF ] ^   \
                 Rt3[ ( Y0 >> 24 ) & 0xFF ];    \
}

#define ROTL8(x) ( ( x << 8 ) & 0xFFFFFFFF ) | ( x >> 24 )
#define XTIME(x) ( ( x << 1 ) ^ ( ( x & 0x80 ) ? 0x1B : 0x00 ) )
#define MUL(x,y) ( ( x && y ) ? pow[(log[x]+log[y]) % 255] : 0 )
#define MIX(x,y) { y = ( (y << 1) | (y >> 7) ) & 0xFF; x ^= y; }
#define CPY128 { *Rk++ = *Sk++; *Rk++ = *Sk++; \
                   *Rk++ = *Sk++; *Rk++ = *Sk++; }

#define GET_UINT32_BE(n,b,i) {                      \
    (n) = ( (uint32_t) (b)[(i)    ] << 24 )         \
        | ( (uint32_t) (b)[(i) + 1] << 16 )         \
        | ( (uint32_t) (b)[(i) + 2] <<  8 )         \
        | ( (uint32_t) (b)[(i) + 3]       ); }

#define PUT_UINT32_BE(n,b,i) {                      \
    (b)[(i)    ] = (unsigned char) ( (n) >> 24 );   \
    (b)[(i) + 1] = (unsigned char) ( (n) >> 16 );   \
    (b)[(i) + 2] = (unsigned char) ( (n) >>  8 );   \
    (b)[(i) + 3] = (unsigned char) ( (n)       ); }



#define ENCRYPTION_MODE(ifaction, elseaction) do { \
  if (encryption_mode == ENCRYPTION) { \
    ifaction; \
  } else { \
    elseaction; \
  } \
} while (0) 

#endif
