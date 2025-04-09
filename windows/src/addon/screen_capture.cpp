#include <napi.h>
#include <windows.h>
#include <vector>

// Capture screen into raw BGRA buffer
Napi::Value CaptureScreen(const Napi::CallbackInfo& info) {
    Napi::Env env = info.Env();

    // Get screen dimensions
    int screenWidth = GetSystemMetrics(SM_CXSCREEN);
    int screenHeight = GetSystemMetrics(SM_CYSCREEN);

    // Create a device context for the screen and a compatible memory DC
    HDC hScreenDC = GetDC(NULL);
    HDC hMemoryDC = CreateCompatibleDC(hScreenDC);

    // Create a compatible bitmap
    HBITMAP hBitmap = CreateCompatibleBitmap(hScreenDC, screenWidth, screenHeight);
    HGDIOBJ hOldBitmap = SelectObject(hMemoryDC, hBitmap);

    // Copy screen into bitmap
    BitBlt(hMemoryDC, 0, 0, screenWidth, screenHeight, hScreenDC, 0, 0, SRCCOPY | CAPTUREBLT);

    // Prepare bitmap info header
    BITMAPINFOHEADER bi = { 0 };
    bi.biSize = sizeof(BITMAPINFOHEADER);
    bi.biWidth = screenWidth;
    bi.biHeight = -screenHeight; // top-down
    bi.biPlanes = 1;
    bi.biBitCount = 32;
    bi.biCompression = BI_RGB;

    size_t bufferSize = screenWidth * screenHeight * 4;
    std::vector<uint8_t> buffer(bufferSize);

    // Get the bitmap data
    GetDIBits(hMemoryDC, hBitmap, 0, screenHeight, buffer.data(), (BITMAPINFO*)&bi, DIB_RGB_COLORS);

    // Cleanup
    SelectObject(hMemoryDC, hOldBitmap);
    DeleteObject(hBitmap);
    DeleteDC(hMemoryDC);
    ReleaseDC(NULL, hScreenDC);

    // Return JS object
    Napi::Object result = Napi::Object::New(env);
    result.Set("width", screenWidth);
    result.Set("height", screenHeight);
    result.Set("data", Napi::Buffer<uint8_t>::Copy(env, buffer.data(), bufferSize));
    return result;
}

Napi::Object Init(Napi::Env env, Napi::Object exports) {
    exports.Set("captureScreen", Napi::Function::New(env, CaptureScreen));
    return exports;
}

NODE_API_MODULE(screen_capture, Init)