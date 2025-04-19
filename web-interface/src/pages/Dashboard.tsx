
import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import StatsCard from "../components/StatsCard";
import SecurityComparison from "../components/SecurityComparison";
import TransactionsList from "../components/TransactionsList";
import SecurityMetrics from "../components/SecurityMetrics";
import { fetchRecentTransactions, fetchSecurityMetrics, simulateNewBlock } from "../services/supabaseData";
import { AlertTriangle, Database, Shield, Zap, Lock, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Dashboard: React.FC = () => {
  const [transactions, setTransactions] = useState([]);
  const [metrics, setMetrics] = useState({
    totalBlocks: 0,
    totalTransactions: 0,
    quantumSafePercentage: 0,
    activeAttacks: 0,
    vulnerabilitiesDetected: 0,
    mitigationSuccessRate: 100,
  });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [txData, metricsData] = await Promise.all([
          fetchRecentTransactions(),
          fetchSecurityMetrics(),
        ]);
        
        setTransactions(txData);
        setMetrics(metricsData);
      } catch (error) {
        console.error("Error loading dashboard data:", error);
        toast({
          title: "Error loading data",
          description: "Could not fetch blockchain data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [toast]);

  const handleAddBlock = async (quantumSafe: boolean) => {
    try {
      await simulateNewBlock(quantumSafe);
      toast({
        title: `${quantumSafe ? "Quantum-safe" : "Classical"} block added`,
        description: "Blockchain updated successfully",
      });
      
      // Refresh data
      const [txData, metricsData] = await Promise.all([
        fetchRecentTransactions(),
        fetchSecurityMetrics(),
      ]);
      
      setTransactions(txData);
      setMetrics(metricsData);
    } catch (error) {
      console.error("Error adding block:", error);
      toast({
        title: "Error adding block",
        description: "Could not add new block to blockchain",
        variant: "destructive",
      });
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold quantum-text-gradient">Dashboard</h1>
          <p className="mt-2 text-slate-400">
            Quantum-safe blockchain explorer with SPHINCS+ and lattice-based cryptography
          </p>
        </div>

        <div className="flex flex-wrap gap-4 mb-6">
          <button
            onClick={() => handleAddBlock(true)}
            className="quantum-button px-4 py-2 rounded-md bg-purple-600 hover:bg-purple-700 text-white"
          >
            Add Quantum-Safe Block
          </button>
          <button
            onClick={() => handleAddBlock(false)}
            className="px-4 py-2 rounded-md bg-red-600 hover:bg-red-700 text-white"
          >
            Add Classical Block
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatsCard
            title="Total Blocks"
            value={metrics.totalBlocks.toLocaleString()}
            icon={Database}
            trend={{ value: 12, positive: true }}
          />
          <StatsCard
            title="Total Transactions"
            value={metrics.totalTransactions.toLocaleString()}
            icon={Zap}
            trend={{ value: 8, positive: true }}
          />
          <StatsCard
            title="Quantum-Safe Transactions"
            value={`${metrics.quantumSafePercentage}%`}
            icon={Shield}
            trend={{ value: 23, positive: true }}
          />
          <StatsCard
            title="Active Attacks"
            value={metrics.activeAttacks}
            icon={AlertTriangle}
            description="No quantum attacks detected"
          />
          <StatsCard
            title="Vulnerabilities"
            value={metrics.vulnerabilitiesDetected}
            icon={Lock}
            description="All vulnerabilities mitigated"
          />
          <StatsCard
            title="Mitigation Success Rate"
            value={`${metrics.mitigationSuccessRate}%`}
            icon={FileText}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SecurityMetrics />
          <TransactionsList transactions={transactions} loading={loading} />
        </div>

        <SecurityComparison />
      </div>
    </Layout>
  );
};

export default Dashboard;
