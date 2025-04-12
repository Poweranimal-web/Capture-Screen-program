#include <napi.h>
#include <windows.h>
#include <vector>
#include <algorithm> // for std::swap

Napi::Value CaptureScreen(const Napi::CallbackInfo& info) {
    Napi::Env env = info.Env();

    int screenWidth = GetSystemMetrics(SM_CXSCREEN);
    int screenHeight = GetSystemMetrics(SM_CYSCREEN);

    HDC hScreenDC = GetDC(NULL);
    HDC hMemoryDC = CreateCompatibleDC(hScreenDC);
    HBITMAP hBitmap = CreateCompatibleBitmap(hScreenDC, screenWidth, screenHeight);
    HGDIOBJ hOldBitmap = SelectObject(hMemoryDC, hBitmap);

    BitBlt(hMemoryDC, 0, 0, screenWidth, screenHeight, hScreenDC, 0, 0, SRCCOPY | CAPTUREBLT);

    BITMAPINFOHEADER bi = { 0 };
    bi.biSize = sizeof(BITMAPINFOHEADER);
    bi.biWidth = screenWidth;
    bi.biHeight = -screenHeight;
    bi.biPlanes = 1;
    bi.biBitCount = 32;
    bi.biCompression = BI_RGB;

    size_t bufferSize = screenWidth * screenHeight * 4;
    std::vector<uint8_t> buffer(bufferSize);

    GetDIBits(hMemoryDC, hBitmap, 0, screenHeight, buffer.data(), (BITMAPINFO*)&bi, DIB_RGB_COLORS);

    // ✅ Convert BGRA to RGBA
    for (size_t i = 0; i < bufferSize; i += 4) {
        std::swap(buffer[i], buffer[i + 2]); // Swap B and R
    }

    SelectObject(hMemoryDC, hOldBitmap);
    DeleteObject(hBitmap);
    DeleteDC(hMemoryDC);
    ReleaseDC(NULL, hScreenDC);

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
