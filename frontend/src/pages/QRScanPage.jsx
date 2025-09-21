import React, { useState } from "react";
import jsQR from "jsqr";

const QRScanPage = () => {
  const [scanStatus, setScanStatus] = useState("idle"); // idle, scanned, error
  const [dragOver, setDragOver] = useState(false);

  const handleDrop = (event) => {
    event.preventDefault();
    setDragOver(false);
    const file = event.dataTransfer.files[0];
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
        const code = jsQR(imageData.data, img.width, img.height);
        if (code) setScanStatus("scanned");
        else setScanStatus("error");
      };
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e) => { e.preventDefault(); setDragOver(true); };
  const handleDragLeave = () => setDragOver(false);
  const handleReset = () => setScanStatus("idle");

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-slate-1100 to-blue-1200 overflow-hidden">

      {/* Background Blobs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full opacity-10 blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full opacity-10 blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-blue-500 to-purple-500 rounded-full opacity-5 blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Instruction Text */}
      {scanStatus === "idle" && (
        <p className="text-slate-200 text-lg mb-4">
          Drag and drop a QR image over the square below
        </p>
      )}

      {/* Square Card */}
      <div
        className="relative w-96 h-96 bg-slate-900/90 rounded-xl shadow-xl flex items-center justify-center"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        {/* Drag overlay */}
        {dragOver && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-white text-lg font-semibold rounded-xl">
            Drop QR Image Here
          </div>
        )}

        {/* Status messages */}
        <div className="text-center px-4">
          {scanStatus === "scanned" && (
            <>
              <p className="text-green-400 text-xl font-semibold">QR Code Scanned Successfully!</p>
              <button onClick={handleReset} className="mt-4 text-blue-300 hover:underline">
                Scan Again
              </button>
            </>
          )}
          {scanStatus === "error" && (
            <>
              <p className="text-red-500 text-xl font-semibold">Scan Failed. Try Again.</p>
              <button onClick={handleReset} className="mt-4 text-blue-300 hover:underline">
                Try Again
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default QRScanPage;
