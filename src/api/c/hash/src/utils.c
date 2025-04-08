#include "../inc/utils.h"
#include <string.h>
#include <stdint.h> // for uint32_t

#ifdef _WIN32
#define strdup _strdup
#endif

static const char base64_chars[] =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

void base64_encode(const unsigned char *input, size_t input_len,
                   char *output, size_t output_len)
{
    size_t i, j;
    uint32_t a, b, c;

    if (output_len < ((input_len + 2) / 3) * 4 + 1)
        return;

    j = 0;
    for (i = 0; i < input_len; i += 3)
    {
        a = input[i];
        b = i + 1 < input_len ? input[i + 1] : 0;
        c = i + 2 < input_len ? input[i + 2] : 0;

        output[j++] = base64_chars[a >> 2];
        output[j++] = base64_chars[((a & 3) << 4) | (b >> 4)];
        output[j++] = i + 1 < input_len ? base64_chars[((b & 15) << 2) | (c >> 6)] : '=';
        output[j++] = i + 2 < input_len ? base64_chars[c & 63] : '=';
    }
    output[j] = '\0';
}

size_t base64_decode(const char *input, unsigned char *output, size_t output_len)
{
    size_t i, j = 0;
    uint32_t sextet[4];

    size_t input_len = strlen(input);
    if (output_len < ((input_len + 3) / 4) * 3)
        return 0;

    for (i = 0; i < input_len; i += 4)
    {
        for (size_t k = 0; k < 4; k++)
        {
            char c = input[i + k];
            if (c >= 'A' && c <= 'Z')
                sextet[k] = c - 'A';
            else if (c >= 'a' && c <= 'z')
                sextet[k] = c - 'a' + 26;
            else if (c >= '0' && c <= '9')
                sextet[k] = c - '0' + 52;
            else if (c == '+')
                sextet[k] = 62;
            else if (c == '/')
                sextet[k] = 63;
            else if (c == '=')
                sextet[k] = 0;
            else
                return 0;
        }

        output[j++] = (sextet[0] << 2) | (sextet[1] >> 4);
        if (input[i + 2] != '=')
            output[j++] = ((sextet[1] & 15) << 4) | (sextet[2] >> 2);
        if (input[i + 3] != '=')
            output[j++] = ((sextet[2] & 3) << 6) | sextet[3];
    }

    return j;
}
