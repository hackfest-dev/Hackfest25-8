
import React from "react";
import { Check, X } from "lucide-react";
import SecurityStatus from "./SecurityStatus";

const SecurityComparison: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="quantum-card rounded-xl overflow-hidden">
        <div className="bg-slate-800 p-4 border-b border-slate-700">
          <h3 className="text-lg font-medium text-white">
            Classical Cryptography
          </h3>
          <p className="text-sm text-slate-400">
            Traditional blockchain security
          </p>
        </div>
        <div className="p-6 space-y-6">
          <SecurityStatus status="vulnerable" cryptoType="classical" />
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-300">
                RSA/ECC Encryption
              </span>
              <Check className="h-5 w-5 text-green-500" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-300">
                Protection Against Classical Attacks
              </span>
              <Check className="h-5 w-5 text-green-500" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-300">
                Protection Against Quantum Attacks
              </span>
              <X className="h-5 w-5 text-red-500" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-300">
                Future-proof Security
              </span>
              <X className="h-5 w-5 text-red-500" />
            </div>
          </div>
        </div>
      </div>

      <div className="quantum-card rounded-xl overflow-hidden border-purple-500/30">
        <div className="bg-quantum-gradient p-4">
          <h3 className="text-lg font-medium text-white">
            Quantum-Safe Cryptography
          </h3>
          <p className="text-sm text-slate-200">
            SPHINCS+ and lattice-based protection
          </p>
        </div>
        <div className="p-6 space-y-6">
          <SecurityStatus status="secure" cryptoType="quantum" />
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-300">
                SPHINCS+ Signatures
              </span>
              <Check className="h-5 w-5 text-green-500" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-300">
                Lattice-based Encryption
              </span>
              <Check className="h-5 w-5 text-green-500" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-300">
                Protection Against Classical Attacks
              </span>
              <Check className="h-5 w-5 text-green-500" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-300">
                Protection Against Quantum Attacks
              </span>
              <Check className="h-5 w-5 text-green-500" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-300">
                Future-proof Security
              </span>
              <Check className="h-5 w-5 text-green-500" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecurityComparison;
