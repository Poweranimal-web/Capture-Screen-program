{
  "targets": [
    {
      "target_name": "screen_capture",
      "sources": [ "screen_capture.cpp" ],
      "libraries": [ "d3d11.lib", "dxgi.lib", "uuid.lib" ],
      "include_dirs": [
        "<!(node -p \"require('node-addon-api').include\")"
      ],
      "dependencies": [
        "<!(node -p \"require('node-addon-api').gyp\")"
      ],
      "defines": [ "NAPI_CPP_EXCEPTIONS" ],
      "cflags_cc": [ "-fno-exceptions" ]
    }
  ]
}