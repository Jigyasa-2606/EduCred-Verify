import React, { useState, useRef } from "react";

// Mock jsQR function since we can't import external libraries
const mockJsQR = (imageData, width, height) => {
  // Simulate QR detection - in real implementation, replace with actual jsQR
  const hasQRPattern = Math.random() > 0.3; // 70% success rate for demo
  return hasQRPattern ? { data: "mock-qr-data" } : null;
};

const QRScanPage = () => {
  const [scanStatus, setScanStatus] = useState("idle"); // idle, scanned, error
  const [documentData, setDocumentData] = useState(null);
  const fileInputRef = useRef(null);
  const validityRef = useRef(null);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (!file || !file.type.startsWith("image/")) {
      setScanStatus("error");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.src = e.target.result;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, img.width, img.height);
        const imageData = ctx.getImageData(0, 0, img.width, img.height);
        
        // Using mock function - replace with jsQR in real implementation
        const code = mockJsQR(imageData.data, img.width, img.height);
        
        if (code) {
          setScanStatus("scanned");
          // Mock document data - replace with actual QR data parsing
          setDocumentData({
            documentType: "Digital Certificate",
            name: "Akash Rana",
            certificateId: "JH-UNI-2018-201",
            status: "Valid"
          });
          
          // Scroll to validity section after a brief delay
          setTimeout(() => {
            window.scrollTo({
              top: window.innerHeight,
              behavior: 'smooth'
            });
          }, 1000);
        } else {
          setScanStatus("error");
        }
      };
    };
    reader.readAsDataURL(file);
  };

  const handleSelectClick = () => {
    fileInputRef.current?.click();
  };

  const handleReset = () => {
    setScanStatus("idle");
    setDocumentData(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    // Scroll back to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="relative min-h-[200vh] bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 overflow-hidden">
      {/* Main Scanner Section */}
      <div className="min-h-screen flex flex-col items-center justify-center">
      {/* Background Blobs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full opacity-10 blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full opacity-10 blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-blue-500 to-purple-500 rounded-full opacity-5 blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Instruction Text */}
      {scanStatus === "idle" && (
        <p className="text-slate-200 text-lg mb-4 text-center px-4">
          Select a QR code image to scan
        </p>
      )}

      {/* Square Card */}
      <div className="relative w-96 h-96 bg-slate-900/90 backdrop-blur-sm rounded-xl shadow-xl flex items-center justify-center border border-slate-700/50">
        {/* Hidden file input */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          accept="image/*"
          className="hidden"
        />

        {/* Status messages and buttons */}
        <div className="text-center px-4">
          {scanStatus === "idle" && (
            <div className="space-y-4">
              <div className="w-20 h-20 mx-auto border-2 border-dashed border-slate-400 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <button
                onClick={handleSelectClick}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Select QR Image
              </button>
            </div>
          )}

          {scanStatus === "scanned" && (
            <>
              <div className="w-16 h-16 mx-auto mb-4 bg-green-500/20 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-green-400 text-xl font-semibold mb-4">QR Code Scanned Successfully!</p>
              <button
                onClick={handleReset}
                className="px-4 py-2 text-blue-300 hover:text-blue-200 hover:bg-blue-500/10 rounded-lg transition-all duration-200"
              >
                Scan Again
              </button>
            </>
          )}

          {scanStatus === "error" && (
            <>
              <div className="w-16 h-16 mx-auto mb-4 bg-red-500/20 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <p className="text-red-500 text-xl font-semibold mb-4">Scan Failed. Try Again.</p>
              <button
                onClick={handleReset}
                className="px-4 py-2 text-blue-300 hover:text-blue-200 hover:bg-blue-500/10 rounded-lg transition-all duration-200"
              >
                Try Again
              </button>
            </>
          )}
        </div>
      </div>
      </div>

      {/* Results Section - Below the fold */}
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-800 via-slate-700 to-blue-800 p-8">
      {scanStatus === "scanned" && documentData && (
        <div ref={validityRef} className="w-full max-w-4xl mx-auto mt-20 p-8">
          <div className="bg-slate-900/90 backdrop-blur-sm rounded-xl shadow-xl border border-slate-700/50 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-green-600/20 to-blue-600/20 border-b border-slate-700/50 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">Document Validity</h2>
                    <p className="text-slate-300">Verification Results</p>
                  </div>
                </div>
                <div className="px-4 py-2 bg-green-500/20 text-green-400 rounded-lg font-semibold">
                  {documentData.status}
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Document Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-slate-200 border-b border-slate-700 pb-2">
                    Document Information
                  </h3>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Type:</span>
                      <span className="text-slate-200 font-medium">{documentData.documentType}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-slate-400">Certificate ID:</span>
                      <span className="text-slate-200 font-medium font-mono">{documentData.certificateId}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-slate-400">Name:</span>
                      <span className="text-slate-200 font-medium">{documentData.name}</span>
                    </div>
{/*                     
                    <div className="flex justify-between">
                      <span className="text-slate-400">Issuer:</span>
                      <span className="text-slate-200 font-medium">{documentData.issuer}</span>
                    </div> */}
                  </div>
                </div>

                {/* Validity Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-slate-200 border-b border-slate-700 pb-2">
                    Validity Information
                  </h3>
                  
                  <div className="space-y-3">
                    {/* <div className="flex justify-between">
                      <span className="text-slate-400">Issue Date:</span>
                      <span className="text-slate-200 font-medium">
                        {new Date(documentData.issueDate).toLocaleDateString()}
                      </span>
                    </div> */}
                    
                    {/* <div className="flex justify-between">
                      <span className="text-slate-400">Expiry Date:</span>
                      <span className="text-slate-200 font-medium">
                        {new Date(documentData.expiryDate).toLocaleDateString()}
                      </span>
                    </div> */}
                    
                    {/* <div className="flex justify-between">
                      <span className="text-slate-400">Days Remaining:</span>
                      <span className="text-green-400 font-medium">
                        {Math.ceil((new Date(documentData.expiryDate) - new Date()) / (1000 * 60 * 60 * 24))} days
                      </span>
                    </div> */}
                    
                    <div className="flex justify-between">
                      <span className="text-slate-400">Status:</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                        <span className="text-green-400 font-medium">Active & Valid</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Security Features */}
              <div className="mt-6 pt-6 border-t border-slate-700/50">
                <h3 className="text-lg font-semibold text-slate-200 mb-4">Security Verification</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center space-x-3 p-3 bg-slate-800/50 rounded-lg">
                    <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-slate-300">Digital Signature</span>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-3 bg-slate-800/50 rounded-lg">
                    <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-slate-300">Blockchain Verified</span>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-3 bg-slate-800/50 rounded-lg">
                    <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-slate-300">QR Code Verified</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

export default QRScanPage;