#ifndef MAIN_H
#define MAIN_H

#include <node_api.h>

napi_value Hash(napi_env env, napi_callback_info info);
napi_value Verify(napi_env env, napi_callback_info info);

#endif
