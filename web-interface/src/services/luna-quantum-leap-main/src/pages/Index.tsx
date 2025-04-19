
import React from 'react';
import Header from '@/components/Header';
import Dashboard from '@/components/Dashboard';
import KeyManagement from '@/components/KeyManagement';
import CodeSigning from '@/components/CodeSigning';
import TlsSimulation from '@/components/TlsSimulation';
import QuantumSafeBlock from '@/components/QuantumSafeBlock';
import ClassicalBlock from '@/components/ClassicalBlock';
import TransactionView from '@/components/TransactionView';
import TransactionAnalytics from '@/components/TransactionAnalytics';
import QuantumAttackSimulator from '@/components/QuantumAttackSimulator';
import WalletConnector from '@/components/WalletConnector';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ShieldCheck } from 'lucide-react';

const Index = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1 container py-6 space-y-10">
        {/* Hero section */}
        <div className="py-12 text-center">
          <div className="flex justify-center mb-4">
            <div className="relative">
              <ShieldCheck className="h-16 w-16 text-quantum-400" />
              <div className="absolute inset-0 bg-quantum-400/20 blur-xl rounded-full animate-quantum-pulse"></div>
            </div>
          </div>
          <h1 className="text-4xl font-bold tracking-tight mb-3">
            Thales Luna Post-Quantum Crypto Module
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Secure your applications against quantum threats with NIST standardized 
            post-quantum cryptographic algorithms in a hardware-based security module.
          </p>
        </div>
        
        {/* Quantum and Classical Blocks */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <QuantumSafeBlock />
          <ClassicalBlock compromised={true} />
        </div>
        
        {/* Wallet Connector */}
        <WalletConnector />
        
        {/* Transaction View */}
        <TransactionView />
        
        {/* Analytics and Attack Simulation */}
        <Tabs defaultValue="analytics" className="space-y-6">
          <TabsList>
            <TabsTrigger value="analytics">Transaction Analytics</TabsTrigger>
            <TabsTrigger value="attacks">Quantum Attack Simulator</TabsTrigger>
          </TabsList>
          <TabsContent value="analytics">
            <TransactionAnalytics />
          </TabsContent>
          <TabsContent value="attacks">
            <QuantumAttackSimulator />
          </TabsContent>
        </Tabs>
        
        <Separator className="my-10" />
        <Dashboard />
        <Separator className="my-10" />
        <KeyManagement />
        <Separator className="my-10" />
        <CodeSigning />
        <Separator className="my-10" />
        <TlsSimulation />
      </main>
      
      <footer className="border-t py-6 bg-background/80">
        <div className="container flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <ShieldCheck className="w-5 h-5 text-quantum-400" />
            <span className="text-sm text-muted-foreground">Thales Luna PQC Module</span>
          </div>
          <div className="text-sm text-muted-foreground">
            Implementing NIST PQC standards: CRYSTAL-Kyber, CRYSTAL-Dilithium, SPHINCS+, and XMSS
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
