
import React, { useState, useEffect } from "react";
import { Shield, AlertTriangle, ServerCrash, Network, CircleAlert } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { 
  simulateQuantumAttack, 
  mitigateQuantumAttack, 
  fetchRecentTransactions 
} from "../services/blockchainIpfsData";
import { sphincsPlus, kyberCrypto } from "../services/quantumCrypto";

type Node = {
  id: string;
  name: string;
  status: "secure" | "vulnerable" | "under-attack";
  type: "classical" | "quantum";
};

const QuantumAttack = () => {
  const [attackInProgress, setAttackInProgress] = useState(false);
  const [mitigationInProgress, setMitigationInProgress] = useState(false);
  const [nodes, setNodes] = useState<Node[]>([]);
  const [attackTimer, setAttackTimer] = useState(0);
  const [compromisedCount, setCompromisedCount] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    // Generate some initial nodes
    const initialNodes: Node[] = [
      { id: "node-1", name: "Gateway Node", status: "secure", type: "quantum" },
      { id: "node-2", name: "Validator Node 1", status: "secure", type: "quantum" },
      { id: "node-3", name: "Validator Node 2", status: "secure", type: "quantum" },
      { id: "node-4", name: "Storage Node 1", status: "secure", type: "quantum" },
      { id: "node-5", name: "Storage Node 2", status: "secure", type: "classical" },
      { id: "node-6", name: "Processing Node 1", status: "secure", type: "classical" },
      { id: "node-7", name: "Processing Node 2", status: "secure", type: "classical" },
      { id: "node-8", name: "API Node", status: "secure", type: "quantum" },
    ];
    setNodes(initialNodes);
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (attackInProgress) {
      interval = setInterval(() => {
        setAttackTimer(prev => {
          const newTime = prev + 1;
          // After 3 seconds, start affecting classical nodes
          if (newTime === 3) {
            affectClassicalNodes();
          }
          return newTime;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [attackInProgress]);

  // Update compromised count whenever nodes change
  useEffect(() => {
    const compromised = nodes.filter(node => node.status === "under-attack").length;
    setCompromisedCount(compromised);
  }, [nodes]);

  const affectClassicalNodes = () => {
    setNodes(prevNodes => 
      prevNodes.map(node => {
        if (node.type === "classical") {
          return { ...node, status: "under-attack" };
        }
        return node;
      })
    );
    
    toast({
      title: "Classical nodes under attack!",
      description: "Quantum attack detected on non-quantum-safe nodes",
      variant: "destructive"
    });
  };

  const startAttack = async () => {
    setAttackInProgress(true);
    setAttackTimer(0);
    
    try {
      await simulateQuantumAttack();
      
      toast({
        title: "Quantum attack simulation started",
        description: "Monitoring network for vulnerabilities..."
      });
      
      // Set classical nodes to vulnerable after 1 second
      setTimeout(() => {
        setNodes(prevNodes => 
          prevNodes.map(node => {
            if (node.type === "classical") {
              return { ...node, status: "vulnerable" };
            }
            return node;
          })
        );
        
        toast({
          title: "Vulnerabilities detected",
          description: "Classical nodes are vulnerable to quantum attack",
          variant: "destructive"
        });
      }, 1000);
      
    } catch (error) {
      console.error("Error starting quantum attack:", error);
      toast({
        title: "Error",
        description: "Failed to start quantum attack simulation",
        variant: "destructive"
      });
      setAttackInProgress(false);
    }
  };

  const startMitigation = async () => {
    setMitigationInProgress(true);
    
    try {
      await mitigateQuantumAttack();
      
      toast({
        title: "Quantum attack mitigation started",
        description: "Applying SPHINCS+ protection to affected nodes"
      });
      
      // Demonstrate generating keys for the affected nodes
      setTimeout(async () => {
        // Generate a key for demonstration purposes
        await sphincsPlus.generateKeypair();
      }, 500);
      
      // Gradually restore nodes
      setTimeout(() => {
        setNodes(prevNodes => 
          prevNodes.map(node => {
            if (node.type === "classical" && node.status === "under-attack") {
              return { ...node, status: "vulnerable" };
            }
            return node;
          })
        );
      }, 1000);
      
      setTimeout(async () => {
        setNodes(prevNodes => 
          prevNodes.map(node => {
            if (node.type === "classical") {
              return { ...node, type: "quantum", status: "secure" };
            }
            return node;
          })
        );
        
        setAttackInProgress(false);
        setMitigationInProgress(false);
        setAttackTimer(0);
        
        // Manually trigger a refresh of transaction data
        try {
          const refreshedTransactions = await fetchRecentTransactions();
          console.log("Transactions refreshed after mitigation:", refreshedTransactions.length);
        } catch (error) {
          console.error("Error refreshing transactions:", error);
        }
        
        toast({
          title: "Attack mitigated",
          description: "All nodes have been upgraded to quantum-safe status",
        });
      }, 3000);
      
    } catch (error) {
      console.error("Error mitigating quantum attack:", error);
      toast({
        title: "Error",
        description: "Failed to mitigate quantum attack",
        variant: "destructive"
      });
      setMitigationInProgress(false);
    }
  };

  // Calculate percentage of compromised nodes
  const compromisedPercentage = nodes.length > 0 
    ? Math.round((compromisedCount / nodes.length) * 100) 
    : 0;

  return (
    <div className="quantum-card rounded-xl p-6">
      <h2 className="text-xl font-semibold text-white mb-4">Quantum Attack Simulation</h2>
      
      <div className="grid gap-6 md:grid-cols-4 mb-6">
        <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
          <h3 className="font-medium text-white mb-2 flex items-center">
            <Shield className="h-5 w-5 mr-2 text-green-500" />
            Secure Nodes
          </h3>
          <p className="text-2xl font-bold text-white">
            {nodes.filter(node => node.status === "secure").length}
          </p>
        </div>
        
        <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
          <h3 className="font-medium text-white mb-2 flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2 text-yellow-500" />
            Vulnerable Nodes
          </h3>
          <p className="text-2xl font-bold text-white">
            {nodes.filter(node => node.status === "vulnerable").length}
          </p>
        </div>
        
        <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
          <h3 className="font-medium text-white mb-2 flex items-center">
            <ServerCrash className="h-5 w-5 mr-2 text-red-500" />
            Nodes Under Attack
          </h3>
          <p className="text-2xl font-bold text-white">
            {nodes.filter(node => node.status === "under-attack").length}
          </p>
        </div>
        
        <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
          <h3 className="font-medium text-white mb-2 flex items-center">
            <Network className="h-5 w-5 mr-2 text-purple-500" />
            Network Impact
          </h3>
          <div className="flex items-baseline gap-2">
            <p className="text-2xl font-bold text-white">{compromisedPercentage}%</p>
            <span className="text-xs text-slate-400">compromised</span>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-medium text-white">Network Status</h3>
          {attackInProgress && compromisedCount > 0 && (
            <span className="text-sm bg-red-900/50 text-red-400 px-3 py-1 rounded-full animate-pulse">
              {compromisedCount} node{compromisedCount !== 1 ? 's' : ''} compromised
            </span>
          )}
        </div>
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
          {nodes.map(node => (
            <div 
              key={node.id}
              className={`p-3 rounded-lg border flex flex-col items-center ${
                node.status === "secure"
                  ? "bg-green-900/20 border-green-700/30"
                  : node.status === "vulnerable"
                  ? "bg-yellow-900/20 border-yellow-700/30"
                  : "bg-red-900/20 border-red-700/30 animate-pulse"
              }`}
            >
              {node.status === "secure" ? (
                <Shield className="h-8 w-8 mb-2 text-green-500" />
              ) : node.status === "vulnerable" ? (
                <CircleAlert className="h-8 w-8 mb-2 text-yellow-500" />
              ) : (
                <ServerCrash className="h-8 w-8 mb-2 text-red-500" />
              )}
              
              <span className="text-sm font-medium text-white">{node.name}</span>
              <span className={`text-xs ${
                node.type === "quantum" ? "text-purple-400" : "text-blue-400"
              }`}>
                {node.type === "quantum" ? "Quantum-Safe" : "Classical"}
              </span>
              <span className={`text-xs mt-1 ${
                node.status === "secure"
                  ? "text-green-400"
                  : node.status === "vulnerable"
                  ? "text-yellow-400"
                  : "text-red-400"
              }`}>
                {node.status === "secure"
                  ? "Secure"
                  : node.status === "vulnerable"
                  ? "Vulnerable"
                  : "Under Attack"}
              </span>
            </div>
          ))}
        </div>
      </div>
      
      <div className="flex flex-wrap gap-4 justify-center">
        <button
          onClick={startAttack}
          disabled={attackInProgress || mitigationInProgress}
          className={`px-4 py-2 rounded-md bg-red-600 hover:bg-red-700 text-white ${
            (attackInProgress || mitigationInProgress) ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          Simulate Quantum Attack
        </button>
        
        <button
          onClick={startMitigation}
          disabled={!attackInProgress || mitigationInProgress}
          className={`quantum-button px-4 py-2 rounded-md ${
            (!attackInProgress || mitigationInProgress) ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          Apply Quantum-Safe Mitigation
        </button>
      </div>
      
      {attackInProgress && (
        <div className="mt-4 p-3 rounded-lg bg-red-900/20 border border-red-700/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
              <span className="text-red-400 font-medium">Quantum attack in progress</span>
            </div>
            <span className="text-red-400">{attackTimer}s</span>
          </div>
          {attackTimer >= 3 && !mitigationInProgress && (
            <div className="mt-2">
              <p className="text-sm text-red-400">
                <strong>{compromisedCount} nodes</strong> are being compromised! Apply quantum-safe mitigation immediately.
              </p>
              <div className="w-full bg-red-900/30 h-2 mt-2 rounded-full overflow-hidden">
                <div 
                  className="bg-red-500 h-full animate-pulse" 
                  style={{ width: `${compromisedPercentage}%` }}
                ></div>
              </div>
            </div>
          )}
          {mitigationInProgress && (
            <p className="mt-2 text-sm text-green-400">
              Quantum-safe protection being applied to affected nodes...
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default QuantumAttack;
