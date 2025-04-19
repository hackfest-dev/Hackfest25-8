
import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { fetchRecentTransactions, fetchSecurityMetrics } from "../services/supabaseData";
import { ArrowUpRight, BarChart3, Shield, Network, TrendingUp } from "lucide-react";
import StatsCard from "../components/StatsCard";
import TransactionVolume from "../components/TransactionVolume";
import NetworkSecurityGraph from "../components/NetworkSecurityGraph";
import SecurityRiskPie from "../components/SecurityRiskPie";
import TransactionsList from "../components/TransactionsList";

const Analytics = () => {
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
        console.error("Error loading analytics data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold quantum-text-gradient">Analytics</h1>
        <p className="text-slate-400">
          Detailed metrics and trends for your quantum-safe blockchain
        </p>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Total Blocks"
            value={metrics.totalBlocks}
            icon={BarChart3}
            trend={{ value: 12, positive: true }}
          />
          <StatsCard
            title="Total Transactions"
            value={metrics.totalTransactions}
            icon={TrendingUp}
            trend={{ value: 8, positive: true }}
          />
          <StatsCard
            title="Quantum-Safe Blocks"
            value={`${metrics.quantumSafePercentage}%`}
            icon={Shield}
            description="Percentage of blocks secured against quantum attacks"
            trend={{ value: 5, positive: true }}
          />
          <StatsCard
            title="Vulnerabilities Detected"
            value={metrics.vulnerabilitiesDetected}
            icon={Network}
            className={metrics.activeAttacks > 0 ? "border border-red-500/50" : ""}
            trend={
              metrics.activeAttacks > 0
                ? { value: metrics.activeAttacks, positive: false }
                : undefined
            }
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <TransactionVolume />
          <NetworkSecurityGraph />
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <TransactionsList transactions={transactions} loading={loading} />
          </div>
          <SecurityRiskPie
            quantumSafe={metrics.quantumSafePercentage}
            vulnerable={100 - metrics.quantumSafePercentage}
          />
        </div>
      </div>
    </Layout>
  );
};

export default Analytics;
