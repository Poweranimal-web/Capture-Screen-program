{
  "targets": [
    {
      "target_name": "screen_capture",
      "sources": [ "screen_capture.cpp" ],
      "libraries": [ "d3d11.lib", "dxgi.lib", "uuid.lib" ],
      "include_dirs": [
  	"../../node_modules/node-addon-api"
       ],
      "defines": [ "NAPI_CPP_EXCEPTIONS" ],
      "cflags_cc": [ "-fno-exceptions" ]
    }
  ]
}