
import React, { useState } from "react";
import Layout from "../components/Layout";
import { Copy, CheckCircle, XCircle, Code, Shield, Send, RefreshCw, Lock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { toast as sonnerToast } from "sonner";
import { sphincsPlus, kyberCrypto, signTransaction, verifyTransaction } from "../services/quantumCrypto";

const SmartContracts = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const [contractOperation, setContractOperation] = useState<string | null>(null);
  const [deployedContract, setDeployedContract] = useState<{
    name: string;
    address: string;
    type: string;
    sphincsSignature?: string;
  } | null>(null);
  const [transactionData, setTransactionData] = useState({
    from: "0x7cF...",
    to: "",
    amount: "0.01",
    data: "0x",
  });
  const [transactionResult, setTransactionResult] = useState<{
    hash: string;
    signature: string;
    verified: boolean;
    encrypted?: string;
    decrypted?: string;
  } | null>(null);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    sonnerToast("Address copied", {
      description: "Contract address copied to clipboard"
    });
  };

  const deployContract = async () => {
    setLoading(true);
    setContractOperation("deploy");
    sonnerToast("Deploying contract", {
      description: "Your quantum-safe contract is being deployed"
    });
    
    try {
      // Generate a new SPHINCS+ keypair for the contract
      const { publicKey, privateKey } = await sphincsPlus.generateKeypair();
      
      // Create a simplified contract bytecode
      const contractData = {
        name: "Quantum Token",
        type: "ERC-20",
        totalSupply: "1000000",
        owner: publicKey.substring(0, 40),
        created: new Date().toISOString()
      };
      
      // Sign the contract with SPHINCS+
      const signature = await sphincsPlus.sign(JSON.stringify(contractData), privateKey);
      
      // Generate a contract address from the public key
      const contractAddress = "0x" + publicKey.substring(0, 40);
      
      // Simulate contract deployment with a timer
      setTimeout(() => {
        setLoading(false);
        setContractOperation(null);
        
        // Set the newly deployed contract with signature
        setDeployedContract({
          name: "Quantum Token",
          address: contractAddress,
          type: "ERC-20",
          sphincsSignature: signature.substring(0, 64) + "..." // Show only the beginning of the signature
        });
        
        sonnerToast("Contract deployed", {
          description: "Your quantum-safe contract has been deployed successfully"
        });
      }, 2000);
    } catch (error) {
      console.error("Error deploying contract:", error);
      sonnerToast("Deployment failed", {
        description: "There was an error deploying your contract"
      });
      setLoading(false);
      setContractOperation(null);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTransactionData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const processTransaction = async () => {
    setLoading(true);
    setContractOperation("transaction");
    sonnerToast("Processing transaction", {
      description: "Your quantum-safe transaction is being processed"
    });
    
    try {
      // Generate temporary keypairs for the transaction demo
      const sphincsKeys = await sphincsPlus.generateKeypair();
      const kyberKeys = await kyberCrypto.generateKeypair();
      
      // Create transaction object
      const tx = {
        from: transactionData.from,
        to: transactionData.to || "0x8eFd...",
        amount: transactionData.amount,
        data: transactionData.data,
        nonce: Math.floor(Math.random() * 10000),
        timestamp: new Date().toISOString()
      };
      
      // Sign transaction with SPHINCS+
      const signature = await signTransaction(tx, sphincsKeys.privateKey);
      
      // Verify the signature
      const verified = await verifyTransaction(tx, signature, sphincsKeys.publicKey);
      
      // Encrypt some sensitive transaction data with Kyber
      const sensitiveData = JSON.stringify({
        privateNote: "Confidential transaction details",
        gasLimit: "21000",
        maxFeePerGas: "30"
      });
      
      const encrypted = await kyberCrypto.encrypt(sensitiveData, kyberKeys.publicKey);
      
      // Decrypt the data
      const decrypted = await kyberCrypto.decrypt(encrypted, kyberKeys.privateKey);
      
      // Generate a transaction hash
      const txHash = "0x" + (await sphincsPlus.hash(JSON.stringify(tx))).substring(0, 64);
      
      // Set the transaction result
      setTimeout(() => {
        setLoading(false);
        setContractOperation(null);
        
        setTransactionResult({
          hash: txHash,
          signature: signature.substring(0, 64) + "...",
          verified,
          encrypted: encrypted.substring(0, 64) + "...",
          decrypted
        });
        
        sonnerToast("Transaction processed", {
          description: "Your quantum-safe transaction has been successfully processed"
        });
      }, 2000);
    } catch (error) {
      console.error("Error processing transaction:", error);
      sonnerToast("Transaction failed", {
        description: "There was an error processing your transaction"
      });
      setLoading(false);
      setContractOperation(null);
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold quantum-text-gradient">Smart Contracts</h1>
        <p className="text-slate-400">
          View and interact with quantum-safe smart contracts
        </p>
        
        <div className="quantum-card rounded-xl p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Quantum-Resistant Smart Contracts</h2>
          <p className="text-slate-300 mb-4">
            QuantumSafeLedger uses post-quantum cryptographic algorithms to secure smart contracts
            against potential attacks from quantum computers. These contracts implement SPHINCS+ 
            signatures and lattice-based encryption to ensure long-term security.
          </p>
          
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
              <h3 className="font-medium text-white mb-2">Token Contract</h3>
              <p className="text-sm text-slate-400 mb-2">A quantum-resistant ERC-20 token implementation</p>
              <div className="font-mono text-xs text-purple-400 bg-slate-900/60 p-2 rounded flex justify-between items-center">
                <span>0x7Fc4b...8A29</span>
                <button 
                  onClick={() => copyToClipboard("0x7Fc4b1230934dFef1b8A29")}
                  className="text-slate-400 hover:text-white"
                >
                  <Copy size={14} />
                </button>
              </div>
              <div className="mt-2 flex items-center text-xs">
                <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-green-400">Quantum-safe</span>
              </div>
            </div>
            
            <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
              <h3 className="font-medium text-white mb-2">Exchange Contract</h3>
              <p className="text-sm text-slate-400 mb-2">Secure token exchange with post-quantum security</p>
              <div className="font-mono text-xs text-purple-400 bg-slate-900/60 p-2 rounded flex justify-between items-center">
                <span>0x93fD1...42bC</span>
                <button 
                  onClick={() => copyToClipboard("0x93fD1584fe93124ac742bC")}
                  className="text-slate-400 hover:text-white"
                >
                  <Copy size={14} />
                </button>
              </div>
              <div className="mt-2 flex items-center text-xs">
                <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-green-400">Quantum-safe</span>
              </div>
            </div>

            <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
              <h3 className="font-medium text-white mb-2">Governance Contract</h3>
              <p className="text-sm text-slate-400 mb-2">Decentralized governance with quantum resistance</p>
              <div className="font-mono text-xs text-purple-400 bg-slate-900/60 p-2 rounded flex justify-between items-center">
                <span>0x5aB87...9Fe2</span>
                <button 
                  onClick={() => copyToClipboard("0x5aB875d34Bcf78a129Fe2")}
                  className="text-slate-400 hover:text-white"
                >
                  <Copy size={14} />
                </button>
              </div>
              <div className="mt-2 flex items-center text-xs">
                <XCircle className="h-4 w-4 text-yellow-500 mr-1" />
                <span className="text-yellow-400">Upgrading to quantum-safe</span>
              </div>
            </div>

            <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
              <h3 className="font-medium text-white mb-2">NFT Contract</h3>
              <p className="text-sm text-slate-400 mb-2">Non-fungible tokens with lattice-based signatures</p>
              <div className="font-mono text-xs text-purple-400 bg-slate-900/60 p-2 rounded flex justify-between items-center">
                <span>0x2Fc7e...3D51</span>
                <button 
                  onClick={() => copyToClipboard("0x2Fc7e45b67a89cdf3D51")}
                  className="text-slate-400 hover:text-white"
                >
                  <Copy size={14} />
                </button>
              </div>
              <div className="mt-2 flex items-center text-xs">
                <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-green-400">Quantum-safe</span>
              </div>
            </div>
          </div>
          
          {/* New Transaction Form */}
          <div className="mt-8 bg-slate-800/30 p-6 rounded-lg border border-slate-700">
            <h3 className="font-medium text-white mb-4 flex items-center">
              <Send className="h-5 w-5 mr-2 text-purple-400" />
              SPHINCS+/Lattice Transaction
            </h3>
            
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label htmlFor="to" className="block text-sm font-medium text-slate-400 mb-1">
                  Recipient Address
                </label>
                <input
                  type="text"
                  id="to"
                  name="to"
                  value={transactionData.to}
                  onChange={handleInputChange}
                  placeholder="0x..."
                  className="w-full bg-slate-900/60 border border-slate-700 rounded px-3 py-2 text-white text-sm"
                />
              </div>
              
              <div>
                <label htmlFor="amount" className="block text-sm font-medium text-slate-400 mb-1">
                  Amount
                </label>
                <input
                  type="text"
                  id="amount"
                  name="amount"
                  value={transactionData.amount}
                  onChange={handleInputChange}
                  placeholder="0.0"
                  className="w-full bg-slate-900/60 border border-slate-700 rounded px-3 py-2 text-white text-sm"
                />
              </div>
              
              <div className="md:col-span-2">
                <label htmlFor="data" className="block text-sm font-medium text-slate-400 mb-1">
                  Contract Data (hex)
                </label>
                <input
                  type="text"
                  id="data"
                  name="data"
                  value={transactionData.data}
                  onChange={handleInputChange}
                  placeholder="0x"
                  className="w-full bg-slate-900/60 border border-slate-700 rounded px-3 py-2 text-white text-sm font-mono"
                />
              </div>
            </div>
            
            <div className="mt-4 flex flex-col md:flex-row gap-4 justify-between">
              <div className="text-sm text-slate-400">
                <strong>From:</strong> {transactionData.from}
                <div className="flex mt-1 items-center">
                  <Shield className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-xs text-green-400">Protected with SPHINCS+</span>
                </div>
              </div>
              
              <button
                onClick={processTransaction}
                disabled={loading}
                className={`quantum-button px-4 py-2 rounded-md flex items-center ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {loading && contractOperation === "transaction" ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Send Transaction
                  </>
                )}
              </button>
            </div>
          </div>
          
          {/* Transaction Result */}
          {transactionResult && (
            <div className="mt-6 p-4 bg-green-900/20 border border-green-700 rounded-lg">
              <h3 className="font-medium text-white mb-3">Transaction Complete</h3>
              
              <div className="space-y-3">
                <div>
                  <div className="text-xs text-slate-400 mb-1">Transaction Hash</div>
                  <div className="font-mono text-xs text-green-400 bg-slate-900/60 p-2 rounded flex justify-between items-center">
                    <span>{transactionResult.hash}</span>
                    <button 
                      onClick={() => copyToClipboard(transactionResult.hash)}
                      className="text-slate-400 hover:text-white"
                    >
                      <Copy size={14} />
                    </button>
                  </div>
                </div>
                
                <div>
                  <div className="flex items-center text-xs mb-1">
                    <Shield className="h-3 w-3 text-purple-400 mr-1" />
                    <span className="text-purple-400">SPHINCS+ Transaction Signature</span>
                  </div>
                  <div className="font-mono text-xs text-slate-400 bg-slate-900/60 p-2 rounded overflow-hidden text-ellipsis">
                    {transactionResult.signature}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <div className="flex items-center text-xs mb-1">
                      <Lock className="h-3 w-3 text-teal-400 mr-1" />
                      <span className="text-teal-400">Kyber Encrypted Data</span>
                    </div>
                    <div className="font-mono text-xs text-slate-400 bg-slate-900/60 p-2 rounded h-20 overflow-auto">
                      {transactionResult.encrypted}
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-center text-xs mb-1">
                      <Code className="h-3 w-3 text-blue-400 mr-1" />
                      <span className="text-blue-400">Decrypted Data</span>
                    </div>
                    <div className="font-mono text-xs text-slate-400 bg-slate-900/60 p-2 rounded h-20 overflow-auto">
                      {transactionResult.decrypted}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-2 bg-slate-800/50 rounded">
                  <span className="text-sm text-slate-300">Signature Verification:</span>
                  {transactionResult.verified ? (
                    <span className="text-green-500 flex items-center">
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Valid
                    </span>
                  ) : (
                    <span className="text-red-500 flex items-center">
                      <XCircle className="h-4 w-4 mr-1" />
                      Invalid
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}
          
          {/* Deployed Contract Info */}
          {deployedContract && (
            <div className="mt-6 p-4 bg-green-900/20 border border-green-700 rounded-lg">
              <h3 className="font-medium text-white mb-2">
                New Contract Deployed: {deployedContract.name} ({deployedContract.type})
              </h3>
              <div className="font-mono text-xs text-green-400 bg-slate-900/60 p-2 rounded flex justify-between items-center">
                <span>{deployedContract.address}</span>
                <button 
                  onClick={() => copyToClipboard(deployedContract.address)}
                  className="text-slate-400 hover:text-white"
                >
                  <Copy size={14} />
                </button>
              </div>
              
              {deployedContract.sphincsSignature && (
                <div className="mt-2">
                  <div className="flex items-center text-xs mb-1">
                    <Shield className="h-3 w-3 text-purple-400 mr-1" />
                    <span className="text-purple-400">SPHINCS+ Contract Signature</span>
                  </div>
                  <div className="font-mono text-xs text-slate-400 bg-slate-900/60 p-2 rounded overflow-hidden text-ellipsis">
                    {deployedContract.sphincsSignature}
                  </div>
                </div>
              )}
            </div>
          )}
          
          <div className="mt-6 text-center">
            <button 
              className={`quantum-button px-4 py-2 rounded-md relative ${loading ? 'opacity-80 cursor-not-allowed' : ''}`}
              onClick={deployContract}
              disabled={loading}
            >
              {loading && contractOperation === "deploy" && (
                <span className="absolute inset-0 flex items-center justify-center">
                  <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></span>
                </span>
              )}
              <span className={loading && contractOperation === "deploy" ? 'opacity-0' : ''}>
                Deploy New Contract
              </span>
            </button>
          </div>
          
          <div className="mt-6 bg-slate-800/30 p-4 rounded-lg border border-slate-700">
            <h4 className="font-medium text-white mb-2 flex items-center">
              <Code className="h-4 w-4 mr-2 text-blue-400" />
              Quantum-Safe Transaction Features
            </h4>
            <ul className="text-sm text-slate-300 space-y-1 list-disc list-inside">
              <li>SPHINCS+ digital signatures for transaction integrity verification</li>
              <li>Kyber lattice-based encryption for sensitive transaction data</li>
              <li>Post-quantum resistant key derivation</li>
              <li>Stateless hash-based signatures for reduced attack surface</li>
              <li>Structure-preserving hash functions for efficient verification</li>
            </ul>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SmartContracts;
