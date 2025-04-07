#include <windows.h>
#include <d3d11.h>
#include <dxgi1_2.h>
#include <wrl/client.h>
#include <iostream>

#pragma comment(lib, "d3d11.lib")
#pragma comment(lib, "dxgi.lib")

using Microsoft::WRL::ComPtr;

int main() {
    // Create DXGI Factory
    ComPtr<IDXGIFactory1> dxgiFactory;
    if (FAILED(CreateDXGIFactory1(__uuidof(IDXGIFactory1), (void**)&dxgiFactory))) {
        std::cerr << "Failed to create DXGI Factory." << std::endl;
        return -1;
    }

    // Enumerate adapters
    ComPtr<IDXGIAdapter1> adapter;
    for (UINT adapterIndex = 0;; ++adapterIndex) {
        if (dxgiFactory->EnumAdapters1(adapterIndex, &adapter) == DXGI_ERROR_NOT_FOUND)
            break;

        DXGI_ADAPTER_DESC1 desc;
        adapter->GetDesc1(&desc);

        // Skip software adapter
        if (desc.Flags & DXGI_ADAPTER_FLAG_SOFTWARE)
            continue;

        // Enumerate outputs (monitors)
        ComPtr<IDXGIOutput> output;
        if (adapter->EnumOutputs(0, &output) == DXGI_ERROR_NOT_FOUND)
            continue;

        // Query output for duplication interface
        ComPtr<IDXGIOutput1> output1;
        if (FAILED(output.As(&output1)))
            continue;

        // Create device using this adapter
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

        // Duplicate the output
        ComPtr<IDXGIOutputDuplication> duplication;
        if (FAILED(output1->DuplicateOutput(d3dDevice.Get(), &duplication))) {
            std::cerr << "Failed to duplicate output." << std::endl;
            continue;
        }

        // Acquire frame
        DXGI_OUTDUPL_FRAME_INFO frameInfo;
        ComPtr<IDXGIResource> desktopResource;
        if (FAILED(duplication->AcquireNextFrame(500, &frameInfo, &desktopResource))) {
            std::cerr << "Failed to acquire next frame." << std::endl;
            continue;
        }

        // Convert to texture
        ComPtr<ID3D11Texture2D> desktopImage;
        if (FAILED(desktopResource.As(&desktopImage))) {
            std::cerr << "Failed to cast to ID3D11Texture2D." << std::endl;
            duplication->ReleaseFrame();
            continue;
        }

        // Get texture description
        D3D11_TEXTURE2D_DESC descTex;
        desktopImage->GetDesc(&descTex);

        // Create staging texture (CPU-readable)
        descTex.CPUAccessFlags = D3D11_CPU_ACCESS_READ;
        descTex.Usage = D3D11_USAGE_STAGING;
        descTex.BindFlags = 0;
        descTex.MiscFlags = 0;

        ComPtr<ID3D11Texture2D> cpuTexture;
        if (FAILED(d3dDevice->CreateTexture2D(&descTex, nullptr, &cpuTexture))) {
            std::cerr << "Failed to create staging texture." << std::endl;
            duplication->ReleaseFrame();
            continue;
        }

        // Copy GPU texture to CPU-readable texture
        d3dContext->CopyResource(cpuTexture.Get(), desktopImage.Get());

        // Map to access pixels (TEST HERE)
        D3D11_MAPPED_SUBRESOURCE mapped;
        if (SUCCEEDED(d3dContext->Map(cpuTexture.Get(), 0, D3D11_MAP_READ, 0, &mapped))) {
            std::cout << "[TEST PASS] Screen captured successfully. Resolution: "
                      << descTex.Width << "x" << descTex.Height << std::endl;

            if (mapped.pData != nullptr) {
                std::cout << "[TEST] Frame data is accessible." << std::endl;
            } else {
                std::cerr << "[TEST FAIL] Frame data pointer is null." << std::endl;
                duplication->ReleaseFrame();
                return -1;
            }

            d3dContext->Unmap(cpuTexture.Get(), 0);
            duplication->ReleaseFrame();
            return 0; // Success
        } else {
            std::cerr << "[TEST FAIL] Failed to map texture." << std::endl;
            duplication->ReleaseFrame();
            return -1;
        }

        break; // Just capture one frame
    }

    std::cerr << "[TEST FAIL] No frame captured." << std::endl;
    return -1; // Failure
}