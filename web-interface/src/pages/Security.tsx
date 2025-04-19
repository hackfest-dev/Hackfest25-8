
import React from "react";
import Layout from "../components/Layout";
import SecurityComparison from "../components/SecurityComparison";
import SecurityMetrics from "../components/SecurityMetrics";
import QuantumAttack from "../components/QuantumAttack";
import QuantumDemo from "../components/QuantumDemo";

const Security = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold quantum-text-gradient">Security</h1>
        <p className="text-slate-400">
          Learn about the quantum security features of this blockchain
        </p>
        
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
