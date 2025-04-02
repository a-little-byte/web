{
  "targets": [{
    "target_name": "hash",
    "sources": [
      "src/main.c",
      "src/pbkdf2.c",
      "src/sha256.c",
      "src/utils.c"
    ],
    "include_dirs": [
      "inc",
    ],
    "cflags": ["-fPIC", "-O3"],
    "cflags!": ["-fno-exceptions"],
    "cflags_cc!": ["-fno-exceptions"],
    "conditions": [
      ['OS=="win"', {
        "defines": [
          "_HAS_EXCEPTIONS=1"
        ],
        "msvs_settings": {
          "VCCLCompilerTool": {
            "ExceptionHandling": 1
          }
        }
      }]
    ]
  }]
} 
