#ifndef UTILS_H
#define UTILS_H

#include <stddef.h>

void base64_encode(const unsigned char *input, size_t input_len, char *output, size_t output_len);
size_t base64_decode(const char *input, unsigned char *output, size_t output_len);

#endif
