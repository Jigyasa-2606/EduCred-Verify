import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Shield, Brain, Lock, Zap, CheckCircle, Star, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

const Home = () => {
  const [currentFile, setCurrentFile] = useState("validator.js");
  const [currentCode, setCurrentCode] = useState("");

  const files = {
    "validator.js": `const validateCertificate = async (document) => {
  const ocrData = await extractText(document);
  const metadata = analyzeMetadata(ocrData);

  if (metadata.institution === "unknown") {
    return { status: "invalid", reason: "Institution not found" };
  }

  const blockchainVerify = await verifyHash(metadata.hash);
  const aiAnalysis = await detectForgery(document);

  return {
    status: aiAnalysis.confidence > 0.95 ? "verified" : "suspicious",
    confidence: aiAnalysis.confidence,
    details: metadata
  };
};`,
    "blockchain.js": `import { createHash } from "crypto";

export class CertificateChain {
  constructor() {
    this.chain = [];
  }

  addCertificate(certData) {
    const hash = this.generateHash(certData);
    const block = {
      timestamp: Date.now(),
      data: certData,
      hash,
      previousHash: this.getLatestBlock()?.hash || "0"
    };
    this.chain.push(block);
    return hash;
  }

  verifyCertificate(hash) {
    return this.chain.find(block => block.hash === hash);
  }
}`,
    "ai-detector.js": `import * as tf from "@tensorflow/tfjs";

class ForgeryDetector {
  constructor() {
    this.model = null;
    this.loadModel();
  }

  async loadModel() {
    this.model = await tf.loadLayersModel("/models/forgery-detection.json");
  }

  async analyzeDocument(imageData) {
    const tensor = tf.browser.fromPixels(imageData);
    const prediction = this.model.predict(tensor.expandDims(0));
    const confidence = await prediction.data();
    return {
      isForgery: confidence[0] > 0.5,
      confidence: confidence[0],
      anomalies: this.detectAnomalies(imageData)
    };
  }
}`
  };

  useEffect(() => {
    let index = 0;
    const code = files[currentFile];
    const timer = setInterval(() => {
      if (index <= code.length) {
        setCurrentCode(code.slice(0, index));
        index++;
      } else {
        clearInterval(timer);
      }
    }, 50);
    return () => clearInterval(timer);
  }, [currentFile]);

  return (
    <div className="min-h-screen gradient-hero relative overflow-hidden">
      {/* Enhanced Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Original blobs */}
        <div className="absolute top-20 left-10 w-72 h-72 gradient-primary rounded-full opacity-10 blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 gradient-primary rounded-full opacity-10 blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] gradient-primary rounded-full opacity-5 blur-3xl animate-pulse delay-500"></div>
        
        {/* Floating particles */}
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-blue-400 rounded-full opacity-20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${3 + Math.random() * 4}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 2}s`
            }}
          />
        ))}
        
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              linear-gradient(rgba(59, 130, 246, 0.5) 1px, transparent 1px),
              linear-gradient(90deg, rgba(59, 130, 246, 0.5) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px'
          }} />
        </div>
        
        {/* Animated lines */}
        <svg className="absolute inset-0 w-full h-full opacity-10">
          <defs>
            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgb(59, 130, 246)" stopOpacity="0" />
              <stop offset="50%" stopColor="rgb(59, 130, 246)" stopOpacity="1" />
              <stop offset="100%" stopColor="rgb(59, 130, 246)" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path 
            d="M0,100 Q250,50 500,100 T1000,100" 
            stroke="url(#lineGradient)" 
            strokeWidth="2" 
            fill="none"
            className="animate-pulse"
          />
          <path 
            d="M0,200 Q300,150 600,200 T1200,200" 
            stroke="url(#lineGradient)" 
            strokeWidth="2" 
            fill="none"
            className="animate-pulse"
            style={{ animationDelay: '1s' }}
          />
        </svg>
      </div>

      {/* Floating icons */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 animate-bounce opacity-20" style={{ animationDelay: '2s', animationDuration: '3s' }}>
          <Shield className="w-8 h-8 text-blue-400" />
        </div>
        <div className="absolute top-3/4 right-1/4 animate-bounce opacity-20" style={{ animationDelay: '1s', animationDuration: '4s' }}>
          <Lock className="w-6 h-6 text-purple-400" />
        </div>
        <div className="absolute top-1/2 right-1/3 animate-bounce opacity-20" style={{ animationDelay: '3s', animationDuration: '3.5s' }}>
          <Brain className="w-7 h-7 text-cyan-400" />
        </div>
        <div className="absolute bottom-1/4 left-1/3 animate-bounce opacity-20" style={{ animationDelay: '0.5s', animationDuration: '4.5s' }}>
          <Zap className="w-5 h-5 text-indigo-400" />
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative py-20 px-4 text-center">
        <div className="container mx-auto max-w-7xl">
          <div className="mb-12">
            {/* Enhanced badge with sparkle animation */}
            <div className="inline-flex items-center gap-4 bg-card-100/20 backdrop-blur-sm border border-border-300/30 rounded-full px-4 py-2 mb-8 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer"></div>
              <Shield className="h-10 w-10 text-primary-500 relative z-10" />
              <span className="text-lg md:text-xl text-white-900 font-semibold relative z-10">
                Authenticity Validator
              </span>
              <Sparkles className="h-5 w-5 text-yellow-400 animate-pulse relative z-10" />
            </div>

            <h1 className="text-5xl md:text-7xl font-bold leading-tight font-space-grotesk mb-16 relative">
              <span className="font-dancing-script bg-gradient-to-r from-blue-200 to-indigo-300 bg-clip-text text-transparent">
                The Best Place To {" "}
              </span>
              <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                 Verify, Validate,
              </span>
              <span className="font-dancing-script bg-gradient-to-r from-blue-200 to-indigo-300 bg-clip-text text-transparent"> And Discover </span>
              <span className="bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">
                  Credentials
                </span>
              
              {/* Floating stars around title */}
              <Star className="absolute -top-4 -right-4 w-6 h-6 text-yellow-400 animate-pulse opacity-60" />
              <Star className="absolute top-8 -left-8 w-4 h-4 text-blue-400 animate-pulse opacity-40" style={{ animationDelay: '1s' }} />
              <Star className="absolute bottom-4 right-12 w-5 h-5 text-purple-400 animate-pulse opacity-50" style={{ animationDelay: '2s' }} />
            </h1>

            <p className="text-xl md:text-2xl font-bold leading-tight font-space-grotesk">
              <span className="bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">
              AI-powered verification system to detect fake degrees and
              certificates. Protecting academic integrity with blockchain
              security and advanced machine learning.
              </span>
            </p>
          </div>

          {/* Enhanced buttons with glow effects */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button
              asChild
              size="lg"
              className="gradient-primary glow-primary text-lg px-8 py-3 rounded-full border-0 relative overflow-hidden group"
            >
              <Link to="/verify">
                <span className="relative z-10">Get Started</span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="text-lg px-8 py-3 rounded-full border-border/50 bg-card/20 backdrop-blur-sm hover:bg-card/40 relative group overflow-hidden"
            >
              <Link to="/login">
                <span className="relative z-10">Learn More</span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Code + Sidebar Section with enhanced visuals */}
      <section className="relative py-16 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="grid lg:grid-cols-12 gap-8 items-start">
            {/* Sidebar */}
            <div className="lg:col-span-3">
              <Card className="bg-card/50 backdrop-blur-sm border-border/50 p-4 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-blue-500/10 to-transparent rounded-bl-full"></div>
                <div className="mb-4 relative z-10">
                  <h3 className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
                    PROJECT ROOT
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  </h3>
                  <div className="text-xs text-muted-foreground">
                    /validator-system
                  </div>
                </div>
                <div className="space-y-1 relative z-10">
                  {Object.keys(files).map((file) => (
                    <button
                      key={file}
                      onClick={() => setCurrentFile(file)}
                      className={`w-full text-left px-3 py-2 rounded text-sm transition-all duration-200 relative overflow-hidden ${
                        currentFile === file
                          ? "bg-primary/20 text-primary"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                      }`}
                    >
                      {currentFile === file && (
                        <div className="absolute left-0 top-0 w-1 h-full bg-primary"></div>
                      )}
                      {file}
                    </button>
                  ))}
                </div>

                <div className="mt-6 space-y-2 text-xs text-muted-foreground relative z-10">
                  <div>📑components</div>
                  <div className="ml-4">📄UploadDocument.tsx</div>
                  <div className="ml-4">📄VerificationResult.tsx</div>
                  <div>📑models</div>
                  <div className="ml-4">📄forgery-detection.json</div>
                  <div>📑blockchain</div>
                  <div className="ml-4">📄certificate-chain.js</div>
                </div>
              </Card>
            </div>

            {/* Code Panel */}
            <div className="lg:col-span-9">
              <div className="bg-card/30 backdrop-blur-sm border border-border/50 rounded-lg overflow-hidden relative">
                {/* Terminal-style header */}
                <div className="flex items-center justify-between border-b border-border/50 bg-card/50 px-4 py-2">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                  <div className="text-xs text-muted-foreground">validator-system</div>
                </div>
                
                <div className="flex border-b border-border/50 bg-card/50">
                  {Object.keys(files).map((file) => (
                    <button
                      key={file}
                      onClick={() => setCurrentFile(file)}
                      className={`px-4 py-3 text-sm font-medium transition-all duration-200 relative ${
                        currentFile === file
                          ? "bg-background/50 text-foreground border-b-2 border-primary"
                          : "text-muted-foreground hover:text-foreground hover:bg-background/25"
                      }`}
                    >
                      {file}
                      {currentFile === file && (
                        <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-blue-400 to-purple-500"></div>
                      )}
                    </button>
                  ))}
                </div>

                <div className="p-6 gradient-code min-h-[400px] font-mono text-sm relative overflow-hidden">
                  <div className="absolute top-2 right-2 flex gap-1">
                    <div className="w-1 h-1 bg-green-400 rounded-full animate-pulse"></div>
                    <div className="w-1 h-1 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                    <div className="w-1 h-1 bg-purple-400 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
                  </div>
                  <div className="text-green-400 mb-2 flex items-center gap-2">
                    // {currentFile} - Academic Authenticity Validator
                    <CheckCircle className="w-4 h-4 opacity-60" />
                  </div>
                  <pre className="text-foreground/90 whitespace-pre-wrap">
                    <code>{currentCode}</code>
                    <span className="animate-pulse bg-primary w-2 h-5 inline-block ml-1"></span>
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Features Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 relative">
              Advanced Verification Technology
              <div className="absolute -top-2 -right-2 w-4 h-4 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full animate-ping"></div>
            </h2>
            <p className="text-muted-foreground">
              Powered by AI, secured by blockchain
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <Card className="bg-card/50 backdrop-blur-sm border-border/50 p-6 text-center hover:bg-card/70 transition-all duration-300 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="relative inline-block mb-4">
                  <Brain className="h-12 w-12 mx-auto text-primary" />
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
                </div>
                <h3 className="text-lg font-semibold mb-2">AI Detection</h3>
                <p className="text-sm text-muted-foreground">
                  Advanced machine learning algorithms detect document tampering
                  and forgery
                </p>
              </div>
            </Card>

            <Card className="bg-card/50 backdrop-blur-sm border-border/50 p-6 text-center hover:bg-card/70 transition-all duration-300 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="relative inline-block mb-4">
                  <Lock className="h-12 w-12 mx-auto text-primary" />
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-purple-400 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                </div>
                <h3 className="text-lg font-semibold mb-2">Blockchain Security</h3>
                <p className="text-sm text-muted-foreground">
                  Immutable verification records secured by blockchain technology
                </p>
              </div>
            </Card>

            <Card className="bg-card/50 backdrop-blur-sm border-border/50 p-6 text-center hover:bg-card/70 transition-all duration-300 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="relative inline-block mb-4">
                  <Zap className="h-12 w-12 mx-auto text-primary" />
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-cyan-400 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
                </div>
                <h3 className="text-lg font-semibold mb-2">Instant Results</h3>
                <p className="text-sm text-muted-foreground">
                  Real-time verification with 99.9% accuracy in seconds
                </p>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `}</style>
    </div>
  );
};

export default Home;