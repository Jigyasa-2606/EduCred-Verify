import React from "react";
import { Upload } from "lucide-react";

const DocumentVerification = () => {
  return (
    <div className="relative min-h-screen bg- flex flex-col items-center justify-center px-6 py-12 overflow-hidden">
      {/* Background Blobs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 gradient-primary rounded-full opacity-10 blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 gradient-primary rounded-full opacity-10 blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] gradient-primary rounded-full opacity-5 blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-3xl text-center">
        <h1 className="text-3xl font-bold text-white mb-4">
          Document Verification
        </h1>
        <p className="text-gray-400 mb-10">
          Upload academic certificates, degrees, or transcripts to verify their
          authenticity. Our AI-powered system will analyze the documents and
          cross-verify with institutional databases.
        </p>
      </div>

      {/* Upload Card */}
      <div className="relative z-10 w-full max-w-3xl bg-gray-900/70 backdrop-blur-md rounded-xl shadow-lg p-8 border border-gray-800">
        <h2 className="text-lg font-semibold text-white mb-2">
          Upload Academic Documents
        </h2>
        <p className="text-sm text-gray-400 mb-6">
          Drag and drop or click to upload certificates, degrees, or transcripts
          for verification
        </p>

        {/* Upload Box */}
        <div className="border-2 border-dashed border-gray-700 rounded-lg p-10 text-center hover:border-blue-500 transition">
          <Upload className="mx-auto h-12 w-12 text-gray-400 mb-3" />
          <p className="text-gray-300 font-medium">Upload Documents</p>
          <p className="text-sm text-gray-500 mt-1">
            Supports PDF, JPG, PNG files up to 10MB
          </p>

          <div className="mt-6">
            <label className="bg-black px-5 py-2 rounded-md text-white text-sm font-medium cursor-pointer hover:bg-gray-800 transition">
              Choose Files
              <input type="file" className="hidden" multiple />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentVerification;

