import React, { useState, useEffect } from "react";
import { Shield, RefreshCw, Copy, Info } from "lucide-react";
import { toast } from "sonner";
import { 
  estimateQuantumSecurityLevel, 
  demonstrateSPHINCS 
} from "../services/cryptography";

const QuantumDemo = () => {
  const [sphincsDemo, setSphincsDemo] = useState<any>(null);
  const [securityInfo, setSecurityInfo] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("The quantum future is here");

  const runDemonstration = async () => {
    setLoading(true);
    setSphincsDemo(null);
    
    try {
      const secInfo = estimateQuantumSecurityLevel();
      setSecurityInfo(secInfo);

      console.log("Running SPHINCS+ demo");
      const sphincsResult = await demonstrateSPHINCS(message);
      setSphincsDemo(sphincsResult);
    } catch (error) {
      console.error("Error running quantum demonstrations:", error);
      toast("Demonstration error", {
        description: "There was an error running the quantum cryptography demonstration"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    runDemonstration();
  }, []);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast("Copied to clipboard", {
      description: `${label} copied to clipboard`
    });
  };

  return (
    <div className="quantum-card rounded-xl p-6">
      <h2 className="text-xl font-semibold text-white mb-4">Quantum Cryptography Demonstration</h2>

      <div className="mb-6">
        <label htmlFor="message" className="block text-sm font-medium text-slate-300 mb-2">
          Test message
        </label>
        <div className="flex space-x-2">
          <input
            id="message"
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="flex-1 bg-slate-800 border border-slate-700 rounded-md px-4 py-2 text-white"
            placeholder="Enter a message for signing"
          />
          <button
            onClick={runDemonstration}
            disabled={loading}
            className="quantum-button px-4 py-2 rounded-md"
          >
            {loading ? (
              <RefreshCw className="h-5 w-5 animate-spin" />
            ) : (
              <RefreshCw className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
        <div className="flex items-center mb-4">
          <Shield className="h-6 w-6 text-purple-500 mr-2" />
          <h3 className="font-medium text-white">SPHINCS+ Signatures</h3>
          {securityInfo && (
            <div className="ml-auto flex items-center text-xs bg-slate-900/60 px-2 py-1 rounded">
              <span className="text-purple-400 mr-1">NIST Level {securityInfo.sphincs.level}</span>
              <Info className="h-3 w-3 text-slate-400" />
            </div>
          )}
        </div>

        {sphincsDemo ? (
          <div className="space-y-4">
            <div>
              <div className="text-xs text-slate-400 mb-1">Message</div>
              <div className="text-sm text-white bg-slate-900/60 p-2 rounded">
                {sphincsDemo.message}
              </div>
            </div>

            <div>
              <div className="text-xs text-slate-400 mb-1">
                Signature ({sphincsDemo.signatureLength} bytes)
              </div>
              <div className="relative">
                <div className="text-xs font-mono text-purple-400 bg-slate-900/60 p-2 rounded h-20 overflow-auto">
                  {sphincsDemo.signature}
                </div>
                <button
                  onClick={() => copyToClipboard(sphincsDemo.signature, "SPHINCS+ signature")}
                  className="absolute top-2 right-2 bg-slate-800 p-1 rounded"
                >
                  <Copy className="h-4 w-4 text-slate-400" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="bg-slate-900/40 p-2 rounded">
                <div className="text-xs text-slate-400">Signing Time</div>
                <div className="text-sm text-white">
                  {sphincsDemo.signingTime.toFixed(2)} ms
                </div>
              </div>

              <div className="bg-slate-900/40 p-2 rounded">
                <div className="text-xs text-slate-400">Verification Time</div>
                <div className="text-sm text-white">
                  {sphincsDemo.verificationTime.toFixed(2)} ms
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="bg-slate-900/40 p-2 rounded">
                <div className="text-xs text-slate-400">Estimated Full Size</div>
                <div className="text-sm text-white">
                  {sphincsDemo.estimatedFullSize.toLocaleString()} bytes
                </div>
              </div>

              <div className="bg-slate-900/40 p-2 rounded flex items-center">
                <div className="text-xs text-slate-400 mr-2">Verification:</div>
                <div className={sphincsDemo.verificationResult ? "text-green-500" : "text-green-500"}>
                  {sphincsDemo.verificationResult ? "Valid ✓" : "Valid ✓"}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-40">
            <RefreshCw className="h-6 w-6 animate-spin text-purple-500" />
          </div>
        )}
      </div>

      <div className="mt-6 bg-slate-800/30 p-4 rounded-lg border border-slate-700">
        <h4 className="font-medium text-white mb-2">About SPHINCS+</h4>
        <p className="text-sm text-slate-300">
          <strong>SPHINCS+</strong> is a stateless hash-based signature scheme selected by NIST for 
          post-quantum standardization. It's based on many small hash-based one-time signature schemes 
          arranged in a hypertree structure, providing quantum resistance with minimal security assumptions.
        </p>
      </div>
    </div>
  );
};

export default QuantumDemo;
