import React from "react";
import Layout from "../components/Layout";

const Education: React.FC = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold quantum-text-gradient">Education Center</h1>
        <p className="text-slate-400">
          Learn about quantum computing threats and post-quantum cryptography
        </p>

        {/* Post-Quantum Cryptography Section */}
        <div className="quantum-card rounded-xl p-6">
          <h2 className="text-xl font-semibold text-white mb-4">What is Post-Quantum Cryptography?</h2>
          <p className="text-slate-300 mb-4">
            Post-Quantum Cryptography (PQC) refers to cryptographic algorithms that are thought to be secure against an attack by a quantum computer. 
            As quantum computers advance, they pose a significant threat to many current cryptographic systems.
          </p>
          <p className="text-slate-300 mb-4">
            This blockchain implementation uses two main types of PQC:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-slate-300 mb-4">
            <li><strong className="text-purple-400">SPHINCS+</strong> - A stateless hash-based signature scheme that provides quantum resistance through careful use of hash functions.</li>
            <li><strong className="text-purple-400">Lattice-based cryptography</strong> - Security based on the hardness of solving certain mathematical problems in lattices, which remains difficult even for quantum computers.</li>
          </ul>
          <p className="text-slate-300">
            More educational content about quantum threats and protections will be added in future updates.
          </p>
        </div>

        {/* Beginner Level */}
        <div className="quantum-card rounded-xl p-6">
          <h2 className="text-xl font-semibold text-white mb-4">What is a Blockchain?</h2>
          <p className="text-slate-300 mb-2">
            Imagine a notebook that everyone can see and write in, but no one can erase. That’s a blockchain! It's a special way to store information safely and fairly.
          </p>
          <p className="text-slate-300 mb-2">
            Blockchains help keep records safe like who owns what, who sent money, and more without needing a teacher or manager.
          </p>
          <p className="text-slate-300">
            <strong className="text-purple-400">Why is it cool?</strong> Because it's very hard to cheat or change anything once it's written!
          </p>
        </div>

        {/* Intermediate Level */}
        <div className="quantum-card rounded-xl p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Why Worry About Quantum Computers?</h2>
          <p className="text-slate-300 mb-2">
            Today’s blockchains use encryption like digital locks to keep data safe. But in the future, powerful quantum computers could break these locks easily.
          </p>
          <p className="text-slate-300 mb-2">
            That’s why we need <span className="text-purple-400 font-semibold">post quantum cryptography</span> new locks that even quantum computers can’t break.
          </p>
          <p className="text-slate-300">
            These include tools like <strong className="text-purple-400">SPHINCS+</strong> and <strong className="text-purple-400">lattice-based cryptography</strong>.
          </p>
        </div>

        {/* Advanced Level */}
        <div className="quantum-card rounded-xl p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Quantum-Resistant Blockchain with SPHINCS+ and Lattice-Based Cryptography</h2>
          <p className="text-slate-300 mb-4">
            As quantum computing advances, traditional cryptographic methods face potential vulnerabilities. Quantum-resistant blockchains integrate post-quantum cryptographic algorithms such as SPHINCS+ and lattice-based cryptography to secure transactions and digital signatures.
          </p>
          <p className="text-slate-300 mb-4">
            <strong className="text-purple-400">SPHINCS+</strong> is a stateless hash-based signature scheme that offers strong security guarantees without relying on number-theoretic assumptions. It uses carefully designed hash functions to provide resistance against quantum attacks, making it suitable for blockchain signature schemes.
          </p>
          <p className="text-slate-300 mb-4">
            <strong className="text-purple-400">Lattice-based cryptography</strong> relies on the hardness of mathematical problems in high-dimensional lattices, which remain difficult for both classical and quantum computers to solve. This enables efficient encryption and digital signature schemes that can be integrated into blockchain protocols.
          </p>
          <p className="text-slate-300">
            Together, these technologies aim to future-proof blockchain systems against quantum threats.
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default Education;
