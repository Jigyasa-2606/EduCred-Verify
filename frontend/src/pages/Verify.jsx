import React from "react";
import { Upload, AlertCircle, CheckCircle, XCircle, Eye, FileText, Shield, Brain } from "lucide-react";

const DocumentVerification = () => {
  const [uploadStatus, setUploadStatus] = React.useState("idle"); // idle, processing, uploaded, error
  const [verificationData, setVerificationData] = React.useState(null);
  const [error, setError] = React.useState(null);
  const [rawText, setRawText] = React.useState("");
  const [processingStage, setProcessingStage] = React.useState("");
  const fileInputRef = React.useRef(null);

  // Connect to your Flask backend
  const processWithBackend = async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    // Set processing stages
    setProcessingStage("Uploading certificate...");
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setProcessingStage("Performing OCR analysis...");
    const response = await fetch('http://localhost:5000/api/verify-certificate', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Verification failed');
    }

    setProcessingStage("Validating against database...");
    const result = await response.json();
    
    return result;
  };

  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/tiff'];
    if (!allowedTypes.includes(file.type)) {
      setError("Please upload a valid image file (JPG, PNG, TIFF)");
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError("File size must be less than 10MB");
      return;
    }

    setError(null);
    setUploadStatus("processing");
    setProcessingStage("Initializing...");

    try {
      // Use the real backend processing
      const result = await processWithBackend(file);

      if (result.success) {
        setVerificationData(result);
        setRawText(result.extracted_info?.raw_text || "");
        setUploadStatus("uploaded");

        // Auto-scroll to results after processing
        setTimeout(() => {
          const resultsSection = document.getElementById('results-section');
          if (resultsSection) {
            resultsSection.scrollIntoView({ behavior: 'smooth' });
          }
        }, 500);
      } else {
        throw new Error(result.error || 'Verification failed');
      }

    } catch (err) {
      console.error('Verification error:', err);
      setError(err.message);
      setUploadStatus("error");
    }
  };

  const handleReset = () => {
    setUploadStatus("idle");
    setVerificationData(null);
    setError(null);
    setRawText("");
    setProcessingStage("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleChooseFiles = () => {
    fileInputRef.current?.click();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'VERIFIED': return 'text-green-400';
      case 'INVALID': return 'text-red-400';
      default: return 'text-yellow-400';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'VERIFIED':
        return <CheckCircle className="w-6 h-6 text-green-400" />;
      case 'INVALID':
        return <XCircle className="w-6 h-6 text-red-400" />;
      default:
        return <AlertCircle className="w-6 h-6 text-yellow-400" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 overflow-hidden">
      {/* Main Upload Section */}
      <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12 relative">
        {/* Background Blobs */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full opacity-10 blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full opacity-10 blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-blue-500 to-purple-500 rounded-full opacity-5 blur-3xl animate-pulse delay-500"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-3xl text-center">
          <h1 className="text-3xl font-bold text-white mb-4">
            AI-Powered Certificate Verification
          </h1>
          <p className="text-gray-400 mb-10">
            Upload academic certificates to verify their authenticity using advanced OCR and forgery detection algorithms.
            Our system combines AI analysis with database verification for comprehensive results.
          </p>
        </div>

        {/* Upload Card */}
        <div className="relative z-10 w-full max-w-3xl bg-gray-900/70 backdrop-blur-md rounded-xl shadow-lg p-8 border border-gray-800">
          <h2 className="text-lg font-semibold text-white mb-2">
            Upload Certificate for Verification
          </h2>
          <p className="text-sm text-gray-400 mb-6">
            Supports JPG, PNG, TIFF files up to 10MB. Our AI will extract text, detect forgery, and verify authenticity.
          </p>

          {/* Hidden file input */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            accept=".jpg,.jpeg,.png,.tiff"
            className="hidden"
          />

          {/* Upload Box - Idle State */}
          {uploadStatus === "idle" && (
            <div className="border-2 border-dashed border-gray-700 rounded-lg p-10 text-center hover:border-blue-500 transition">
              <Upload className="mx-auto h-12 w-12 text-gray-400 mb-3" />
              <p className="text-gray-300 font-medium">Upload Certificate</p>
              <p className="text-sm text-gray-500 mt-1">
                JPG, PNG, TIFF files up to 10MB
              </p>
              <div className="mt-6">
                <button
                  onClick={handleChooseFiles}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-6 py-3 rounded-lg text-white font-medium cursor-pointer transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  Choose Certificate File
                </button>
              </div>
            </div>
          )}

          {/* Processing State */}
          {uploadStatus === "processing" && (
            <div className="border-2 border-blue-500 rounded-lg p-10 text-center bg-blue-500/5">
              <div className="w-12 h-12 mx-auto mb-4 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-blue-400 font-medium mb-2">Processing Certificate...</p>
              <p className="text-sm text-gray-400 mb-4">{processingStage}</p>
              
              <div className="mt-4 bg-gray-800/50 rounded-lg p-4">
                <div className="flex items-center justify-between text-xs text-gray-400 mb-3">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    <span>OCR Analysis</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Brain className="w-4 h-4" />
                    <span>AI Detection</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    <span>Database Validation</span>
                  </div>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full animate-pulse" style={{width: '70%'}}></div>
                </div>
              </div>
            </div>
          )}

          {/* Success State */}
          {uploadStatus === "uploaded" && (
            <div className="border-2 border-green-500 rounded-lg p-10 text-center bg-green-500/5">
              <CheckCircle className="w-12 h-12 mx-auto mb-3 text-green-400" />
              <p className="text-green-400 font-medium">Certificate Processed Successfully!</p>
              <p className="text-sm text-gray-400 mt-1">
                OCR analysis, forgery detection, and database verification complete
              </p>
              <button
                onClick={handleReset}
                className="mt-4 px-4 py-2 text-blue-300 hover:text-blue-200 hover:bg-blue-500/10 rounded-lg transition-all duration-200"
              >
                Verify Another Certificate
              </button>
            </div>
          )}

          {/* Error State */}
          {uploadStatus === "error" && (
            <div className="border-2 border-red-500 rounded-lg p-10 text-center bg-red-500/5">
              <XCircle className="w-12 h-12 mx-auto mb-3 text-red-400" />
              <p className="text-red-400 font-medium">Verification Failed</p>
              <p className="text-sm text-gray-400 mt-2">{error}</p>
              <button
                onClick={handleReset}
                className="mt-4 px-4 py-2 text-blue-300 hover:text-blue-200 hover:bg-blue-500/10 rounded-lg transition-all duration-200"
              >
                Try Again
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Results Section */}
      <div id="results-section" className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-800 via-slate-700 to-blue-800 p-8">
        {uploadStatus === "uploaded" && verificationData && (
          <div className="w-full max-w-6xl mx-auto space-y-6">

            {/* Main Verification Result */}
            <div className="bg-slate-900/90 backdrop-blur-sm rounded-xl shadow-xl border border-slate-700/50 overflow-hidden">
              {/* Header */}
              <div className={`bg-gradient-to-r ${
                verificationData.validation.is_valid
                  ? 'from-green-600/20 to-blue-600/20'
                  : 'from-red-600/20 to-orange-600/20'
              } border-b border-slate-700/50 p-6`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      verificationData.validation.is_valid ? 'bg-green-500/20' : 'bg-red-500/20'
                    }`}>
                      {getStatusIcon(verificationData.validation.status)}
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white">Verification Results</h2>
                      <p className="text-slate-300">Complete AI-Powered Analysis</p>
                    </div>
                  </div>
                  <div className={`px-4 py-2 rounded-lg font-semibold ${
                    verificationData.validation.is_valid
                      ? 'bg-green-500/20 text-green-400'
                      : 'bg-red-500/20 text-red-400'
                  }`}>
                    {verificationData.validation.status}
                    {verificationData.validation.overall_confidence && (
                      <span className="ml-2 text-sm opacity-75">
                        ({verificationData.validation.overall_confidence}% confidence)
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Extracted Information */}
              <div className="p-6">
                <h3 className="text-lg font-semibold text-slate-200 border-b border-slate-700 pb-2 mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  OCR Extracted Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Certificate ID:</span>
                      <span className="text-slate-200 font-mono text-sm">
                        {verificationData.extracted_info.certificate_no || 'Not found'}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-slate-400">Name:</span>
                      <span className="text-slate-200 font-medium">
                        {verificationData.extracted_info.name || 'Not found'}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-slate-400">Institution:</span>
                      <span className="text-slate-200">
                        {verificationData.extracted_info.institution || 'Not found'}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Course:</span>
                      <span className="text-slate-200">
                        {verificationData.extracted_info.course || 'Not found'}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-slate-400">Year:</span>
                      <span className="text-slate-200">
                        {verificationData.extracted_info.year || 'Not found'}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-slate-400">Processing Time:</span>
                      <span className="text-slate-200 text-sm">
                        {new Date(verificationData.extracted_info.processing_timestamp).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Forgery Detection Results */}
            {verificationData.forgery_detection && (
              <div className="bg-slate-900/90 backdrop-blur-sm rounded-xl shadow-xl border border-slate-700/50 p-6">
                <h3 className="text-lg font-semibold text-slate-200 border-b border-slate-700 pb-2 mb-4 flex items-center gap-2">
                  <Brain className="w-5 h-5" />
                  AI Forgery Detection Results
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Seal Authenticity:</span>
                      <span className={`font-medium ${
                        verificationData.forgery_detection.seal_authentic ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {verificationData.forgery_detection.seal_authentic ? '✓ Authentic' : '✗ Suspicious'}
                      </span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-slate-400">Seal Match Score:</span>
                      <span className="text-slate-200">
                        {Math.round(verificationData.forgery_detection.seal_match_score * 100)}%
                      </span>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Signature Authenticity:</span>
                      <span className={`font-medium ${
                        verificationData.forgery_detection.signature_authentic ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {verificationData.forgery_detection.signature_authentic ? '✓ Authentic' : '✗ Suspicious'}
                      </span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-slate-400">Signature Match Score:</span>
                      <span className="text-slate-200">
                        {Math.round(verificationData.forgery_detection.signature_match_score * 100)}%
                      </span>
                    </div>
                  </div>
                </div>

                <div className={`mt-4 p-4 rounded-lg ${
                  verificationData.forgery_detection.overall_authentic 
                    ? 'bg-green-500/10 border border-green-500/20' 
                    : 'bg-red-500/10 border border-red-500/20'
                }`}>
                  <div className="flex items-center gap-2">
                    {verificationData.forgery_detection.overall_authentic ? (
                      <CheckCircle className="w-5 h-5 text-green-400" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-400" />
                    )}
                    <span className={`font-medium ${
                      verificationData.forgery_detection.overall_authentic ? 'text-green-400' : 'text-red-400'
                    }`}>
                      Overall Authenticity: {verificationData.forgery_detection.overall_authentic ? 'AUTHENTIC' : 'SUSPICIOUS'}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Confidence Scores */}
            {verificationData.validation.confidence_scores && (
              <div className="bg-slate-900/90 backdrop-blur-sm rounded-xl shadow-xl border border-slate-700/50 p-6">
                <h3 className="text-lg font-semibold text-slate-200 border-b border-slate-700 pb-2 mb-4">
                  Detailed Confidence Scores
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Object.entries(verificationData.validation.confidence_scores).map(([key, score]) => {
                    const percentage = typeof score === 'boolean' ? (score ? 100 : 0) : score;
                    return (
                      <div key={key} className="bg-slate-800/50 rounded-lg p-3">
                        <div className="text-xs text-slate-400 uppercase tracking-wider mb-1">
                          {key.replace('_', ' ')}
                        </div>
                        <div className="text-lg font-semibold text-slate-200">
                          {typeof score === 'boolean' ? (score ? '✓' : '✗') : `${Math.round(percentage)}%`}
                        </div>
                        {typeof score === 'number' && (
                          <div className="w-full bg-slate-700 rounded-full h-1 mt-2">
                            <div
                              className={`h-1 rounded-full ${percentage > 80 ? 'bg-green-400' : percentage > 60 ? 'bg-yellow-400' : 'bg-red-400'}`}
                              style={{ width: `${Math.min(percentage, 100)}%` }}
                            ></div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Database Match Information */}
            {verificationData.validation.matched_record && (
              <div className="bg-slate-900/90 backdrop-blur-sm rounded-xl shadow-xl border border-slate-700/50 p-6">
                <h3 className="text-lg font-semibold text-slate-200 border-b border-slate-700 pb-2 mb-4 flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Database Verification
                </h3>
                <div className="bg-slate-800/30 rounded-lg p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-slate-400">Database ID:</span>
                      <span className="text-slate-200 ml-2 font-mono">
                        {verificationData.validation.matched_record.certificate_no}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400">Registered Name:</span>
                      <span className="text-slate-200 ml-2">
                        {verificationData.validation.matched_record.name}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400">Institution:</span>
                      <span className="text-slate-200 ml-2">
                        {verificationData.validation.matched_record.institution}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400">Course:</span>
                      <span className="text-slate-200 ml-2">
                        {verificationData.validation.matched_record.course || 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Raw OCR Text (Expandable) */}
            {rawText && (
              <div className="bg-slate-900/90 backdrop-blur-sm rounded-xl shadow-xl border border-slate-700/50 p-6">
                <details>
                  <summary className="text-slate-300 cursor-pointer flex items-center gap-2 hover:text-slate-200 font-medium">
                    <Eye className="w-4 h-4" />
                    View Raw OCR Text
                  </summary>
                  <div className="mt-3 p-4 bg-slate-800/50 rounded-lg">
                    <pre className="text-xs text-slate-400 whitespace-pre-wrap font-mono">
                      {rawText}
                    </pre>
                  </div>
                </details>
              </div>
            )}

            {/* Processing Summary */}
            <div className="bg-slate-900/90 backdrop-blur-sm rounded-xl shadow-xl border border-slate-700/50 p-6">
              <h3 className="text-lg font-semibold text-slate-200 mb-4">Verification Process Summary</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="flex items-center space-x-3 p-3 bg-slate-800/50 rounded-lg">
                  <FileText className="w-5 h-5 text-green-400" />
                  <div>
                    <div className="text-xs text-slate-400">OCR Analysis</div>
                    <div className="text-sm text-slate-200 font-medium">Completed</div>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 bg-slate-800/50 rounded-lg">
                  <Brain className="w-5 h-5 text-green-400" />
                  <div>
                    <div className="text-xs text-slate-400">AI Detection</div>
                    <div className="text-sm text-slate-200 font-medium">Completed</div>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 bg-slate-800/50 rounded-lg">
                  <Shield className="w-5 h-5 text-green-400" />
                  <div>
                    <div className="text-xs text-slate-400">Database Match</div>
                    <div className="text-sm text-slate-200 font-medium">Verified</div>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 bg-slate-800/50 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <div>
                    <div className="text-xs text-slate-400">Final Result</div>
                    <div className="text-sm text-slate-200 font-medium">
                      {verificationData.validation.status}
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

export default DocumentVerification;