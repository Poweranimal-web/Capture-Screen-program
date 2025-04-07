#include <napi.h>
#include <windows.h>
#include <d3d11.h>
#include <dxgi1_2.h>
#include <wrl/client.h>
#include <vector>
#include <iostream>

#pragma comment(lib, "d3d11.lib")
#pragma comment(lib, "dxgi.lib")

using Microsoft::WRL::ComPtr;

Napi::Value CaptureScreen(const Napi::CallbackInfo& info) {
    Napi::Env env = info.Env();

    ComPtr<IDXGIFactory1> dxgiFactory;
    if (FAILED(CreateDXGIFactory1(__uuidof(IDXGIFactory1), (void**)&dxgiFactory))) {
        Napi::TypeError::New(env, "Failed to create DXGI Factory").ThrowAsJavaScriptException();
        return env.Null();
    }

    ComPtr<IDXGIAdapter1> adapter;
    for (UINT adapterIndex = 0; ; ++adapterIndex) {
        if (dxgiFactory->EnumAdapters1(adapterIndex, &adapter) == DXGI_ERROR_NOT_FOUND)
            break;

        DXGI_ADAPTER_DESC1 desc;
        adapter->GetDesc1(&desc);

        if (desc.Flags & DXGI_ADAPTER_FLAG_SOFTWARE)
            continue;

        ComPtr<IDXGIOutput> output;
        if (adapter->EnumOutputs(0, &output) == DXGI_ERROR_NOT_FOUND)
            continue;

        ComPtr<IDXGIOutput1> output1;
        if (FAILED(output.As(&output1)))
            continue;

        ComPtr<ID3D11Device> d3dDevice;
        ComPtr<ID3D11DeviceContext> d3dContext;
        if (FAILED(D3D11CreateDevice(
            adapter.Get(),
            D3D_DRIVER_TYPE_UNKNOWN,
            nullptr,
            0,
            nullptr,
            0,
            D3D11_SDK_VERSION,
            &d3dDevice,
            nullptr,
            &d3dContext))) {
            continue;
        }

        ComPtr<IDXGIOutputDuplication> duplication;
        if (FAILED(output1->DuplicateOutput(d3dDevice.Get(), &duplication))) {
            continue;
        }

        DXGI_OUTDUPL_FRAME_INFO frameInfo;
        ComPtr<IDXGIResource> desktopResource;
        if (FAILED(duplication->AcquireNextFrame(500, &frameInfo, &desktopResource))) {
            continue;
        }

        ComPtr<ID3D11Texture2D> desktopImage;
        if (FAILED(desktopResource.As(&desktopImage))) {
            duplication->ReleaseFrame();
            continue;
        }

        D3D11_TEXTURE2D_DESC descTex;
        desktopImage->GetDesc(&descTex);

        descTex.CPUAccessFlags = D3D11_CPU_ACCESS_READ;
        descTex.Usage = D3D11_USAGE_STAGING;
        descTex.BindFlags = 0;
        descTex.MiscFlags = 0;

        ComPtr<ID3D11Texture2D> cpuTexture;
        if (FAILED(d3dDevice->CreateTexture2D(&descTex, nullptr, &cpuTexture))) {
            duplication->ReleaseFrame();
            continue;
        }

        d3dContext->CopyResource(cpuTexture.Get(), desktopImage.Get());

        D3D11_MAPPED_SUBRESOURCE mapped;
        if (FAILED(d3dContext->Map(cpuTexture.Get(), 0, D3D11_MAP_READ, 0, &mapped))) {
            duplication->ReleaseFrame();
            continue;
        }

        size_t imageSize = mapped.RowPitch * descTex.Height;
        std::vector<uint8_t> buffer(imageSize);
        memcpy(buffer.data(), mapped.pData, imageSize);

        d3dContext->Unmap(cpuTexture.Get(), 0);
        duplication->ReleaseFrame();

        // Return object with width, height, buffer
        Napi::Object result = Napi::Object::New(env);
        result.Set("width", descTex.Width);
        result.Set("height", descTex.Height);
        result.Set("data", Napi::Buffer<uint8_t>::Copy(env, buffer.data(), imageSize));

        return result;
    }

    Napi::TypeError::New(env, "Failed to capture screen").ThrowAsJavaScriptException();
    return env.Null();
}

Napi::Object Init(Napi::Env env, Napi::Object exports) {
    exports.Set("captureScreen", Napi::Function::New(env, CaptureScreen));
    return exports;
}

NODE_API_MODULE(screen_capture, Init)
