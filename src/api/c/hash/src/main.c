#include <node_api.h>
#include <string.h>
#include "../inc/main.h"
#include "../inc/pbkdf2.h"
#include "../inc/utils.h"

#define NAPI_CALL(env, call)                                     \
    do                                                           \
    {                                                            \
        napi_status status = (call);                             \
        if (status != napi_ok)                                   \
        {                                                        \
            const napi_extended_error_info *error_info = NULL;   \
            napi_get_last_error_info((env), &error_info);        \
            const char *err_message = error_info->error_message; \
            napi_throw_error((env), NULL, err_message);          \
            return NULL;                                         \
        }                                                        \
    } while (0)

napi_value Hash(napi_env env, napi_callback_info info)
{
    napi_status status;
    size_t argc = 5;
    napi_value args[5];
    NAPI_CALL(env, napi_get_cb_info(env, info, &argc, args, NULL, NULL));

    if (argc < 5)
    {
        napi_throw_error(env, NULL, "Wrong number of arguments");
        return NULL;
    }

    // Extract password
    size_t password_len;
    char *password;
    NAPI_CALL(env, napi_get_value_string_utf8(env, args[0], NULL, 0, &password_len));
    password = malloc(password_len + 1);
    NAPI_CALL(env, napi_get_value_string_utf8(env, args[0], password, password_len + 1, &password_len));

    // Extract salt
    size_t salt_len;
    char *salt_str;
    NAPI_CALL(env, napi_get_value_string_utf8(env, args[1], NULL, 0, &salt_len));
    salt_str = malloc(salt_len + 1);
    NAPI_CALL(env, napi_get_value_string_utf8(env, args[1], salt_str, salt_len + 1, &salt_len));

    unsigned char *salt = malloc(salt_len);
    size_t decoded_salt_len = base64_decode(salt_str, salt, salt_len);

    // Extract pepper
    size_t pepper_len;
    char *pepper;
    NAPI_CALL(env, napi_get_value_string_utf8(env, args[2], NULL, 0, &pepper_len));
    pepper = malloc(pepper_len + 1);
    NAPI_CALL(env, napi_get_value_string_utf8(env, args[2], pepper, pepper_len + 1, &pepper_len));

    // Extract iterations
    uint32_t iterations;
    NAPI_CALL(env, napi_get_value_uint32(env, args[3], &iterations));

    // Extract keylen
    uint32_t keylen;
    NAPI_CALL(env, napi_get_value_uint32(env, args[4], &keylen));

    // Generate hash
    unsigned char *output = malloc(keylen);
    pbkdf2(password, password_len, salt, decoded_salt_len,
           pepper, pepper_len, iterations, output, keylen);

    // Convert to base64
    size_t base64_len = ((keylen + 2) / 3) * 4 + 1;
    char *base64_output = malloc(base64_len);
    base64_encode(output, keylen, base64_output, base64_len);

    // Create return value
    napi_value result;
    NAPI_CALL(env, napi_create_string_utf8(env, base64_output, strlen(base64_output), &result));

    // Clean up
    free(password);
    free(salt_str);
    free(salt);
    free(pepper);
    free(output);
    free(base64_output);

    return result;
}

napi_value Verify(napi_env env, napi_callback_info info)
{
    napi_status status;
    size_t argc = 6;
    napi_value args[6];
    NAPI_CALL(env, napi_get_cb_info(env, info, &argc, args, NULL, NULL));

    if (argc < 6)
    {
        napi_throw_error(env, NULL, "Wrong number of arguments");
        return NULL;
    }

    // Extract stored hash
    size_t stored_hash_len;
    char *stored_hash_str;
    NAPI_CALL(env, napi_get_value_string_utf8(env, args[0], NULL, 0, &stored_hash_len));
    stored_hash_str = malloc(stored_hash_len + 1);
    NAPI_CALL(env, napi_get_value_string_utf8(env, args[0], stored_hash_str, stored_hash_len + 1, &stored_hash_len));

    // Extract password
    size_t password_len;
    char *password;
    NAPI_CALL(env, napi_get_value_string_utf8(env, args[1], NULL, 0, &password_len));
    password = malloc(password_len + 1);
    NAPI_CALL(env, napi_get_value_string_utf8(env, args[1], password, password_len + 1, &password_len));

    // Extract salt
    size_t salt_len;
    char *salt_str;
    NAPI_CALL(env, napi_get_value_string_utf8(env, args[2], NULL, 0, &salt_len));
    salt_str = malloc(salt_len + 1);
    NAPI_CALL(env, napi_get_value_string_utf8(env, args[2], salt_str, salt_len + 1, &salt_len));

    unsigned char *salt = malloc(salt_len);
    size_t decoded_salt_len = base64_decode(salt_str, salt, salt_len);

    // Extract pepper
    size_t pepper_len;
    char *pepper;
    NAPI_CALL(env, napi_get_value_string_utf8(env, args[3], NULL, 0, &pepper_len));
    pepper = malloc(pepper_len + 1);
    NAPI_CALL(env, napi_get_value_string_utf8(env, args[3], pepper, pepper_len + 1, &pepper_len));

    // Extract iterations
    uint32_t iterations;
    NAPI_CALL(env, napi_get_value_uint32(env, args[4], &iterations));

    // Extract keylen
    uint32_t keylen;
    NAPI_CALL(env, napi_get_value_uint32(env, args[5], &keylen));

    // Generate hash
    unsigned char *output = malloc(keylen);
    pbkdf2(password, password_len, salt, decoded_salt_len,
           pepper, pepper_len, iterations, output, keylen);

    // Convert to base64
    size_t base64_len = ((keylen + 2) / 3) * 4 + 1;
    char *base64_output = malloc(base64_len);
    base64_encode(output, keylen, base64_output, base64_len);

    // Compare hashes
    napi_value result;
    NAPI_CALL(env, napi_get_boolean(env, strcmp(stored_hash_str, base64_output) == 0, &result));

    // Clean up
    free(stored_hash_str);
    free(password);
    free(salt_str);
    free(salt);
    free(pepper);
    free(output);
    free(base64_output);

    return result;
}

napi_value Init(napi_env env, napi_value exports)
{
    napi_status status;
    napi_value fn;

    status = napi_create_function(env, NULL, 0, Hash, NULL, &fn);
    if (status != napi_ok)
        return NULL;
    status = napi_set_named_property(env, exports, "hash", fn);
    if (status != napi_ok)
        return NULL;

    status = napi_create_function(env, NULL, 0, Verify, NULL, &fn);
    if (status != napi_ok)
        return NULL;
    status = napi_set_named_property(env, exports, "verify", fn);
    if (status != napi_ok)
        return NULL;

    return exports;
}

NAPI_MODULE(NODE_GYP_MODULE_NAME, Init)