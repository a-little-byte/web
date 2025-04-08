#ifndef PBKDF2_H
#define PBKDF2_H

#include <stdlib.h>

void pbkdf2(const char *password, size_t password_len,
            const unsigned char *salt, size_t salt_len,
            const char *pepper, size_t pepper_len,
            unsigned int iterations,
            unsigned char *output, size_t output_len);
#endif

