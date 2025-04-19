<div align="center">
  <img src="[https://via.placeholder.com/150x150?text=Q](https://github.com/user-attachments/assets/be7b757b-9b78-483d-b777-6c6b3b296c20)" style="border-radius: 50%; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);" />
  
  <h1>
    <span style="background: linear-gradient(45deg, #6e48aa, #9d50bb); -webkit-background-clip: text; -webkit-text-fill-color: transparent; font-size: 3.5rem; font-weight: 800; letter-spacing: -1px;">
      QUANTUM-CHAIN
    </span>
  </h1>
  
  
  
  ![image](https://github.com/user-attachments/assets/be7b757b-9b78-483d-b777-6c6b3b296c20)


  
  # Quantum-Resistant Blockchain Implementation

  <p>A breakthrough blockchain architecture that maintains security integrity in the face of emerging quantum computing threats. Our implementation protects digital assets through innovative cryptographic approaches that can withstand attacks from both classical and quantum adversaries.</p>

  [![Node.js](https://img.shields.io/badge/Node.js-v18.x-green.svg)](https://nodejs.org/)

</div>

## 📋 Overview

<p>Quantum-Chain represents a paradigm shift in blockchain security, implementing a hybrid approach that combines traditional cryptography with advanced quantum-resistant algorithms. Unlike conventional blockchains that remain vulnerable to quantum computing advancements, our system preemptively addresses these security challenges while maintaining performance and compatibility with existing infrastructure.</p>
<p>The core innovation lies in our dual-signature system, allowing transactions to leverage either classical ECDSA for speed and compatibility or transition to SPHINCS+ and lattice-based algorithms for robust protection against quantum threats. This creates a future-proof blockchain that safeguards digital assets against both present and emerging computational attacks.</p>

## 🚀 Key Features

- **Hybrid Cryptography System**
  - Classical (ECDSA) for backward compatibility
  - Quantum-resistant algorithms (SPHINCS+, Kyber) for future security

- **Quantum Security Framework**
  - Simulated quantum attack models using Shor's and Grover's algorithms
  - Security metrics and vulnerability assessments
  - Real-time risk analysis based on quantum-vulnerable assets

- **Migration Utilities**
  - Tools for transitioning from classical to quantum-resistant addresses
  - Key management across multiple cryptographic schemes

- **Educational Components**
  - Visualization of quantum attack vectors
  - Comparative security analysis between cryptographic methods

## 🔧 Technical Stack

<div align="center">
<table>
  <tr>
    <th colspan="2">Backend Technologies</th>
    <th colspan="2">Cryptographic Implementations</th>
  </tr>
  <tr>
    <td><img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" width="20"/> Node.js</td>
    <td></td>
    <td>🔒 SPHINCS+</td>
    <td>🧩 Kyber Lattice</td>
  </tr>
  <tr>
    <td><img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" width="20"/> Commander.js</td>
    <td><img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/npm/npm-original-wordmark.svg" width="20"/> npm</td>
    <td>🔐 ECDSA</td>
    <td>🔑 SHA-256/512</td>
  </tr>
  <tr>
    <th colspan="2">Storage & Data</th>
    <th colspan="2">Development Tools</th>
  </tr>
  <tr>
    <td>📁 LevelDB</td>
    <td></td>
    <td></td>
    <td><img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg" width="20"/> Git</td>
  </tr>
</table>
</div>

## 🔍 Cryptographic Comparison

<div align="center">
<table>
  <tr>
    <th>Algorithm</th>
    <th>Classical Security</th>
    <th>Quantum Security</th>
    <th>Signature Size</th>
<!--     <th>Verification Speed</th>-->
  </tr> 
  <tr>
    <td>ECDSA (Classical)</td>
    <td>128 bits</td>
    <td>❌ 0 bits</td>
    <td>~72 bytes</td>
<!--     <td>✅✅✅ Very Fast</td>
  -->
    </tr> 
  <tr>
    <td>SPHINCS+</td>
    <td>256 bits</td>
    <td>✅ 128 bits</td>
    <td>~7 KB</td>
<!--     <td>✅ Slow</td>
     -->
  </tr>
  <tr>
    <td>Lattice (Kyber)</td>
    <td>256 bits</td>
    <td>✅ 128 bits</td>
    <td>~2.5 KB</td>
<!--     <td>✅✅ Moderate</td>
  -->
     </tr>
</table>
</div>

## ⚙️ Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/quantum-chain.git

# Change to project directory
cd quantum-chain

# Install dependencies
npm install

# Make the CLI executable
chmod +x bin/quantum-chain.js

# Optional global installation
npm install -g .
```

##  Command Reference

### Wallet Management

| Command | Description | Example |
|---------|-------------|---------|
| `wallet create` | Creates a new wallet with three key types | `quantum-chain wallet create --name "MyWallet" --password "securepassword"` |
| `wallet list` | Lists all wallets in the system | `quantum-chain wallet list` |
| `wallet info` | Displays detailed wallet information | `quantum-chain wallet info --id "<WALLET_UUID>"` |
| `wallet balance` | Shows balance for wallet or specific address | `quantum-chain wallet balance --id "<WALLET_UUID>"` |
| `wallet migrate` | Migrates funds from classical to quantum-resistant address | `quantum-chain wallet migrate --id "<WALLET_UUID>" --to-quantum sphincs` |

### Transaction Operations

| Command | Description | Example |
|---------|-------------|---------|
| `tx create` | Creates a transaction with specified signature type | `quantum-chain tx create --from "<WALLET_UUID>" --to "<ADDRESS>" --amount <VALUE> --type <SIGNATURE_TYPE>` |
| `tx info` | Retrieves transaction details and security assessment | `quantum-chain tx info --hash "<TX_HASH>"` |

### Blockchain Operations

| Command | Description | Example |
|---------|-------------|---------|
| `chain status` | Shows blockchain status with security metrics | `quantum-chain chain status` |
| `block info` | Provides detailed information about a specific block | `quantum-chain block info --index <BLOCK_NUMBER>` |
| `mine` | Mines a new block and processes pending transactions | `quantum-chain mine --reward-address "<ADDRESS>"` |
| `security metrics` | Generates comprehensive security assessment | `quantum-chain security metrics` |

### Attack Simulation

| Command | Description | Example |
|---------|-------------|---------|
| `attack analyze` | Analyzes blockchain for quantum vulnerabilities | `quantum-chain attack analyze` |
| `attack simulate` | Simulates quantum attack on specific address | `quantum-chain attack simulate --qubits <NUMBER> --target "<ADDRESS>"` |
| `attack report` | Generates comprehensive attack impact report | `quantum-chain attack report` |

## 🔐 Address Format

<div align="center">
<table>
  <tr>
    <th>Type</th>
    <th>Prefix</th>
    <th>Based On</th>
    <th>Security</th>
  </tr>
  <tr>
    <td>Classical</td>
    <td><code>0x...</code></td>
    <td>ECDSA on secp256k1 (Ethereum-compatible)</td>
    <td>Vulnerable to quantum attacks</td>
  </tr>
  <tr>
    <td>SPHINCS+</td>
    <td><code>qx...</code></td>
    <td>Stateless hash-based signatures</td>
    <td>Quantum-resistant</td>
  </tr>
  <tr>
    <td>Lattice-based</td>
    <td><code>lx...</code></td>
    <td>Learning With Errors (LWE)</td>
    <td>Quantum-resistant</td>
  </tr>
</table>
</div>

##  Quantum Attack Vectors

### 1. Against Classical Cryptography (ECDSA)
- Implementation of Shor's algorithm for the discrete logarithm problem
- Complexity reduction from O(2^n) to O(n^3)
- Successfully derives private key with sufficient qubits (≥512)

### 2. Against Quantum-Resistant Cryptography
- **SPHINCS+**: Resistance due to security reduction to hash functions
- Grover's algorithm only provides quadratic speedup (256-bit → 128-bit security)
- Still requires 2^128 operations, computationally infeasible

### 3. Lattice-Based Resistance
- Security based on shortest vector problem (SVP) and learning with errors (LWE)
- No known quantum algorithm provides exponential speedup
- Retains exponential hardness even under quantum computing

##  Security Metrics

The system tracks:
- Transaction distribution by signature type
- Address distribution (classical vs. quantum-resistant)
- Token security categorization (vulnerable vs. secure funds)
- Real-time risk assessment based on quantum-vulnerable assets

##  Common Workflows

### Setting Up a New Secure Wallet

```bash
# Create wallet
quantum-chain wallet create --name "SecureWallet" --password "your-password"

# Mine to get initial funds (using quantum-resistant address)
quantum-chain mine --reward-address "qx..."

# Check balance
quantum-chain wallet balance --id "<WALLET_UUID>"
```

### Creating and Tracking Quantum-Resistant Transactions

```bash
# Create quantum-resistant transaction
quantum-chain tx create --from "<WALLET_UUID>" --to "<RECIPIENT_ADDRESS>" --amount 10 --type sphincs

# Mine to process transaction
quantum-chain mine --reward-address "<YOUR_ADDRESS>"

# Verify transaction and security status
quantum-chain tx info --hash "<TX_HASH>"
```

### Analyzing Blockchain Quantum Security

```bash
# Check overall security metrics
quantum-chain security metrics

# Run vulnerability analysis
quantum-chain attack analyze

# Generate comprehensive attack report
quantum-chain attack report
```

### Testing Quantum Attack Resistance

```bash
# Simulate attack on classical address
quantum-chain attack simulate --qubits 4000 --target "0x..."

# Simulate attack on quantum-resistant address
quantum-chain attack simulate --qubits 4000 --target "qx..."

# Migrate vulnerable funds if necessary
quantum-chain wallet migrate --id "<WALLET_UUID>" --to-quantum sphincs
```





<div align="center">
  <sub>Built with ❤️ by the Team Mysterious Pickles </sub>
</div>
