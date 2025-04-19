
import React, { useCallback, useMemo, useState } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  Node,
  Edge
} from 'reactflow';
import 'reactflow/dist/style.css';
import { User, Shield, CircleDollarSign, AlertTriangle, Cpu, Wallet, Landmark, Sparkles } from 'lucide-react';

const TransactionFlow = ({ transactions }) => {
  const [selectedNode, setSelectedNode] = useState(null);
  
  // Create unique nodes based on from/to addresses
  const { initialNodes, initialEdges } = useMemo(() => {
    const nodesMap = new Map();
    const edges = [];
    let nodeIndex = 0;
    
    // Get unique addresses and create nodes
    transactions.forEach(tx => {
      if (!nodesMap.has(tx.from)) {
        const nodeId = `node_${tx.from.substring(0, 6)}`;
        // Position nodes in a circle pattern with more diversity
        const angle = (nodeIndex * (2 * Math.PI)) / (transactions.length * 0.7);
        const radius = 250;
        const x = 400 + radius * Math.cos(angle);
        const y = 300 + radius * Math.sin(angle);
        
        // Randomly assign node types for more variety
        const nodeTypes = ['user', 'exchange', 'contract', 'validator'];
        const nodeType = nodeTypes[Math.floor(Math.random() * nodeTypes.length)];
        
        nodesMap.set(tx.from, {
          id: nodeId,
          data: { 
            label: `${tx.from.substring(0, 8)}...`,
            address: tx.from,
            type: nodeType,
            isCompromised: Math.random() < 0.15,
            isQuantumSecure: Math.random() > 0.3,
            transactions: 1
          },
          position: { x, y },
          className: `transaction-node ${nodeType}-node`
        });
        nodeIndex++;
      } else {
        // Increment transaction count for existing nodes
        const node = nodesMap.get(tx.from);
        node.data.transactions += 1;
        nodesMap.set(tx.from, node);
      }
      
      if (!nodesMap.has(tx.to)) {
        const nodeId = `node_${tx.to.substring(0, 6)}`;
        // Position nodes in a circle pattern
        const angle = (nodeIndex * (2 * Math.PI)) / (transactions.length * 0.7);
        const radius = 250;
        const x = 400 + radius * Math.cos(angle);
        const y = 300 + radius * Math.sin(angle);
        
        // Randomly assign node types for more variety
        const nodeTypes = ['user', 'exchange', 'contract', 'validator'];
        const nodeType = nodeTypes[Math.floor(Math.random() * nodeTypes.length)];
        
        nodesMap.set(tx.to, {
          id: nodeId,
          data: { 
            label: `${tx.to.substring(0, 8)}...`, 
            address: tx.to,
            type: nodeType,
            isCompromised: Math.random() < 0.15,
            isQuantumSecure: Math.random() > 0.3,
            transactions: 1
          },
          position: { x, y },
          className: `transaction-node ${nodeType}-node`
        });
        nodeIndex++;
      } else {
        // Increment transaction count for existing nodes
        const node = nodesMap.get(tx.to);
        node.data.transactions += 1;
        nodesMap.set(tx.to, node);
      }
      
      // Create edges (transactions)
      const sourceId = `node_${tx.from.substring(0, 6)}`;
      const targetId = `node_${tx.to.substring(0, 6)}`;
      
      // Calculate edge width based on amount (for visual representation)
      const amount = parseFloat(tx.amount);
      const edgeWidth = Math.max(1, Math.min(5, 1 + Math.log10(amount)));
      
      edges.push({
        id: tx.id,
        source: sourceId,
        target: targetId,
        animated: true,
        data: {
          amount: tx.amount,
          quantumSafe: tx.quantumSafe,
          timestamp: tx.timestamp,
          id: tx.id
        },
        style: { 
          stroke: tx.quantumSafe ? 
            `rgba(16, 185, 129, ${0.6 + edgeWidth / 10})` : 
            `rgba(234, 179, 8, ${0.6 + edgeWidth / 10})`,
          strokeWidth: edgeWidth
        },
        markerEnd: {
          type: 'arrowclosed',
          color: tx.quantumSafe ? '#10b981' : '#eab308'
        },
        className: 'transaction-edge'
      });
    });
    
    return {
      initialNodes: Array.from(nodesMap.values()),
      initialEdges: edges
    };
  }, [transactions]);
  
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  
  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );
  
  // Custom node rendering
  const nodeTypes = useMemo(() => ({
    default: ({ data }) => {
      // Set node icon based on type
      let NodeIcon = User;
      switch (data.type) {
        case 'exchange':
          NodeIcon = Landmark;
          break;
        case 'contract':
          NodeIcon = Cpu;
          break;
        case 'validator':
          NodeIcon = Shield;
          break;
        default:
          NodeIcon = Wallet;
      }
      
      // Set node colors based on security status
      const bgColor = data.isCompromised 
        ? 'bg-red-800/60' 
        : (data.isQuantumSecure ? 'bg-green-800/60' : 'bg-purple-800/60');
        
      const borderColor = data.isCompromised 
        ? 'border-red-500' 
        : (data.isQuantumSecure ? 'border-green-500' : 'border-purple-500');
      
      // Scale node size based on transaction count
      const size = 50 + (data.transactions * 5);
      const fontSize = 11 + (data.transactions * 0.5);
      
      return (
        <div 
          className={`flex flex-col items-center justify-center p-3 rounded-full backdrop-blur-sm ${bgColor} ${borderColor} border-2`}
          style={{ 
            width: `${size}px`, 
            height: `${size}px`,
            transition: 'all 0.3s ease'
          }}
        >
          <div className={`rounded-full bg-black/30 p-2 mb-1 ${
            data.isCompromised ? 'text-red-400' :
            data.isQuantumSecure ? 'text-green-400' : 'text-purple-300'
          }`}>
            <NodeIcon size={Math.min(24, 16 + data.transactions)} className="animate-pulse" />
            {data.isQuantumSecure && (
              <Sparkles size={12} className="absolute top-1 right-1 text-yellow-300" />
            )}
          </div>
          <div 
            className="font-mono text-center text-white font-medium"
            style={{ fontSize: `${fontSize}px` }}
          >
            {data.label}
          </div>
        </div>
      );
    }
  }), []);
  
  // Handle node click to show details
  const onNodeClick = useCallback((_, node) => {
    setSelectedNode(node);
  }, []);
  
  // Handle edge click
  const onEdgeClick = useCallback((_, edge) => {
    const clickedEdge = edges.find(e => e.id === edge.id);
    if (clickedEdge) {
      setSelectedNode({
        type: 'edge',
        data: clickedEdge.data
      });
    }
  }, [edges]);
  
  return (
    <div className="relative w-full h-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        onNodeClick={onNodeClick}
        onEdgeClick={onEdgeClick}
        fitView
        minZoom={0.5}
        maxZoom={1.5}
        defaultViewport={{ zoom: 0.8, x: 0, y: 0 }}
      >
        <Controls className="bg-slate-900/80 border border-purple-800/30 rounded-md" />
        <MiniMap 
          nodeStrokeColor={(n) => {
            if (n.data?.isCompromised) return '#ef4444';
            if (n.data?.isQuantumSecure) return '#10b981';
            return '#9333ea';
          }}
          nodeColor={(n) => {
            if (n.data?.isCompromised) return '#fee2e2';
            if (n.data?.isQuantumSecure) return '#d1fae5';
            return '#f3e8ff';
          }}
          nodeBorderRadius={50}
          maskColor="#0f172a99"
          className="bg-slate-900/80 border border-purple-800/30 rounded-md"
        />
        <Background gap={20} color="#6366F150" size={1} className="bg-slate-900" />
      </ReactFlow>
      
      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-slate-900/90 border border-purple-800/30 backdrop-blur-sm rounded-md p-3 text-xs text-slate-300">
        <div className="flex items-center mb-2">
          <div className="w-3 h-3 rounded-full bg-purple-500 mr-2"></div>
          <span>Regular Node</span>
        </div>
        <div className="flex items-center mb-2">
          <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
          <span>Compromised Node</span>
        </div>
        <div className="flex items-center mb-2">
          <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
          <span>Quantum Secure</span>
        </div>
        <div className="flex items-center mb-2">
          <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
          <span>Quantum-Safe Transactions</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
          <span>Classical Transactions</span>
        </div>
        <div className="border-t border-slate-700 mt-2 pt-2 text-[10px] text-slate-400">
          Note: Node size indicates transaction volume
        </div>
      </div>
      
      {/* Node Details Sidebar */}
      {selectedNode && (
        <div className="absolute top-4 right-4 w-64 bg-slate-900/90 border border-purple-800/30 backdrop-blur-sm rounded-md p-4 text-sm text-slate-300">
          {selectedNode.type === 'edge' ? (
            <>
              <h3 className="text-lg font-bold mb-3 text-white">Transaction Details</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Amount:</span>
                  <span className="font-medium">{selectedNode.data.amount} ETH</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Time:</span>
                  <span className="text-xs">{selectedNode.data.timestamp}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Security:</span>
                  {selectedNode.data.quantumSafe ? (
                    <div className="flex items-center">
                      <Shield size={14} className="text-green-500 mr-1" />
                      <span className="text-green-500">Quantum-Safe</span>
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <AlertTriangle size={14} className="text-yellow-500 mr-1" />
                      <span className="text-yellow-500">Classical</span>
                    </div>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">ID:</span>
                  <span className="font-mono text-xs">{selectedNode.data.id.substring(0, 8)}...</span>
                </div>
              </div>
            </>
          ) : (
            <>
              <h3 className="text-lg font-bold mb-3 text-white">Node Details</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Type:</span>
                  <span className="font-medium capitalize">{selectedNode.data.type}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Status:</span>
                  {selectedNode.data.isCompromised ? (
                    <span className="text-red-500">compromised</span>
                  ) : (
                    <span className="text-green-500">active</span>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Address:</span>
                  <span className="font-mono text-xs">{selectedNode.data.address.substring(0, 10)}...</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Transactions:</span>
                  <span>{selectedNode.data.transactions}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Balance:</span>
                  <span>{Math.floor(Math.random() * 100 * selectedNode.data.transactions)} ETH</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Security:</span>
                  {selectedNode.data.isQuantumSecure ? (
                    <span className="text-green-500">Quantum-Safe</span>
                  ) : (
                    <span className="text-yellow-500">Classical</span>
                  )}
                </div>
              </div>
              
              <div className="mt-4 pt-3 border-t border-slate-700">
                <h4 className="text-sm font-medium mb-2">Activity Status</h4>
                <div className="bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${selectedNode.data.isQuantumSecure ? 'bg-green-500' : 'bg-purple-500'}`}
                    style={{ width: `${Math.min(100, selectedNode.data.transactions * 15)}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs mt-1">
                  <span>Low</span>
                  <span>Medium</span>
                  <span>High</span>
                </div>
              </div>
            </>
          )}
          
          <button 
            className="mt-4 w-full px-3 py-2 bg-purple-700 hover:bg-purple-600 rounded text-xs text-white transition-colors"
            onClick={() => setSelectedNode(null)}
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
};

export default TransactionFlow;
