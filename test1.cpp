#include <windows.h>
int main(){
    bool testScreenCaptureSuccess = false;

    if (SUCCEEDED(d3dContext->Map(cpuTexture.Get(), 0, D3D11_MAP_READ, 0, &mapped))) {
        std::cout << "[TEST PASS] Screen captured successfully. Resolution: "
                << descTex.Width << "x" << descTex.Height << std::endl;
        testScreenCaptureSuccess = true;
        d3dContext->Unmap(cpuTexture.Get(), 0);
    } else {
        std::cerr << "[TEST FAIL] Failed to map texture." << std::endl;
    }

    duplication->ReleaseFrame();

    if (!testScreenCaptureSuccess) {
        return -2;
    }

}