
import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import SecurityComparison from "../components/SecurityComparison";
import SecurityMetrics from "../components/SecurityMetrics";
import QuantumAttack from "../components/QuantumAttack";
import QuantumDemo from "../components/QuantumDemo";
import { Shield, AlertTriangle, CheckCircle2 } from "lucide-react";
import { fetchSecurityMetrics } from "../services/blockchainIpfsData";

const Security = () => {
  const [networkStatus, setNetworkStatus] = useState({
    isSecure: true,
    activeAttacks: 0,
    lastCheckTime: new Date().toLocaleString()
  });

  useEffect(() => {
    const fetchNetworkStatus = async () => {
      try {
        const metrics = await fetchSecurityMetrics();
        setNetworkStatus({
          isSecure: metrics.activeAttacks === 0,
          activeAttacks: metrics.activeAttacks,
          lastCheckTime: new Date().toLocaleString()
        });
      } catch (error) {
        console.error("Error fetching network status:", error);
      }
    };

    fetchNetworkStatus();
    // Set up periodic checks
    const interval = setInterval(fetchNetworkStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold quantum-text-gradient">Security</h1>
        <p className="text-slate-400">
          Learn about the quantum security features of this blockchain
        </p>
        
        {/* Network Status Card - New Component */}
        <div className="quantum-card rounded-xl p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Network Status</h2>
          <div className="flex items-center gap-3 mb-4">
            {networkStatus.isSecure ? (
              <>
                <div className="p-2 rounded-full bg-green-900/20 text-green-500">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-medium text-green-500">Network Secure</h3>
                  <p className="text-sm text-slate-300">All quantum protection mechanisms active</p>
                </div>
              </>
            ) : (
              <>
                <div className="p-2 rounded-full bg-red-900/20 text-red-500">
                  <AlertTriangle className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-medium text-red-500">Security Alert</h3>
                  <p className="text-sm text-slate-300">
                    {networkStatus.activeAttacks} active quantum {networkStatus.activeAttacks === 1 ? 'attack' : 'attacks'} detected
                  </p>
                </div>
              </>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-slate-800/50 rounded-lg">
              <div className="text-slate-400 text-sm mb-1">Protection Level</div>
              <div className="text-white font-medium flex items-center gap-2">
                <Shield className="h-4 w-4 text-purple-500" />
                Post-Quantum
              </div>
            </div>
            <div className="p-4 bg-slate-800/50 rounded-lg">
              <div className="text-slate-400 text-sm mb-1">Last Check</div>
              <div className="text-white font-medium">{networkStatus.lastCheckTime}</div>
            </div>
            <div className="p-4 bg-slate-800/50 rounded-lg">
              <div className="text-slate-400 text-sm mb-1">Encryption Status</div>
              <div className="text-white font-medium flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-green-500"></span>
                Active & Secure
              </div>
            </div>
          </div>
        </div>
        
        <QuantumAttack />
        
        <QuantumDemo />
        
        <SecurityComparison />
        
        <SecurityMetrics />
        
        <div className="quantum-card rounded-xl p-6">
          <h2 className="text-xl font-semibold text-white mb-4">About Quantum-Safe Cryptography</h2>
          <p className="text-slate-300 mb-4">
            This blockchain uses SPHINCS+ and lattice-based cryptography to provide quantum-resistant security.
            These advanced cryptographic techniques are designed to withstand attacks from both classical and
            quantum computers.
          </p>
          <p className="text-slate-300 mb-4">
            <strong>SPHINCS+</strong> is a stateless hash-based signature scheme that is believed to be secure 
            against quantum computer attacks. Unlike other post-quantum signature schemes, SPHINCS+ relies on 
            few security assumptions and has a well-understood security model.
          </p>
          <p className="text-slate-300">
            <strong>Lattice-based cryptography</strong> uses mathematical structures called lattices to create 
            cryptographic functions that are resistant to attacks from both classical and quantum computers. 
            The security of these systems is based on the hardness of certain lattice problems that are 
            believed to be difficult even for quantum computers to solve.
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default Security;
