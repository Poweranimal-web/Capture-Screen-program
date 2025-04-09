{
  "targets": [
    {
      "target_name": "screen_capture",
      "sources": [ "screen_capture.cpp" ],
      "include_dirs": [
        "../../node_modules/node-addon-api"
      ],
      "defines": [ "NAPI_CPP_EXCEPTIONS" ],
      "cflags_cc": [ "/std:c++17" ],

      "msbuild_settings": {
        "ClCompile": {
          "AdditionalOptions": [
            "/std:c++17",
            "/Zc:__cplusplus",
            "/EHsc",
            "/permissive-"
          ]
        }
      }
    }
  ]
}
