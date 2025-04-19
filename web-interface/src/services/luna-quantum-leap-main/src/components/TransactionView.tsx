
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Shield, ShieldCheck, ArrowRight, Database } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export interface Transaction {
  id: string;
  from: string;
  to: string;
  amount: number;
  timestamp: string;
  algorithm: string;
  isQuantumSafe: boolean;
  status: 'pending' | 'completed' | 'compromised';
}

interface TransactionViewProps {
  className?: string;
}

// Sample transaction data
const sampleTransactions: Transaction[] = [
  {
    id: 'tx-001',
    from: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F',
    to: '0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199',
    amount: 1.25,
    timestamp: new Date(Date.now() - 15 * 60000).toISOString(),
    algorithm: 'CRYSTAL-Kyber768',
    isQuantumSafe: true,
    status: 'completed'
  },
  {
    id: 'tx-002',
    from: '0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199',
    to: '0x2546BcD3c84621e976D8185a91A922aE77ECEc30',
    amount: 0.75,
    timestamp: new Date(Date.now() - 45 * 60000).toISOString(),
    algorithm: 'RSA-3072',
    isQuantumSafe: false,
    status: 'compromised'
  },
  {
    id: 'tx-003',
    from: '0x2546BcD3c84621e976D8185a91A922aE77ECEc30',
    to: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F',
    amount: 2.5,
    timestamp: new Date(Date.now() - 120 * 60000).toISOString(),
    algorithm: 'CRYSTAL-Dilithium3',
    isQuantumSafe: true,
    status: 'completed'
  },
];

const TransactionView: React.FC<TransactionViewProps> = ({ className }) => {
  const [transactions] = useState<Transaction[]>(sampleTransactions);

  const truncateAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  return (
    <Card className={cn("", className)}>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Database className="h-5 w-5 text-quantum-400" />
          Recent Transactions
        </CardTitle>
        <CardDescription>
          View recent blockchain transactions and their security status
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>From/To</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Algorithm</TableHead>
              <TableHead className="text-right">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((tx) => (
              <TableRow key={tx.id}>
                <TableCell className="font-mono text-xs">{tx.id}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <span className="text-xs font-mono">{truncateAddress(tx.from)}</span>
                    <ArrowRight className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs font-mono">{truncateAddress(tx.to)}</span>
                  </div>
                </TableCell>
                <TableCell>{tx.amount.toFixed(2)}</TableCell>
                <TableCell className="flex items-center gap-1">
                  {tx.isQuantumSafe ? (
                    <ShieldCheck className="h-3 w-3 text-dilithium-400" />
                  ) : (
                    <Shield className="h-3 w-3 text-quantum-400" />
                  )}
                  <span className="text-xs">{tx.algorithm}</span>
                </TableCell>
                <TableCell className="text-right">
                  <span 
                    className={cn(
                      "px-2 py-0.5 text-xs rounded",
                      tx.status === 'completed' ? "bg-green-900/50 text-green-200" :
                      tx.status === 'compromised' ? "bg-red-900/50 text-red-200" :
                      "bg-yellow-900/50 text-yellow-200"
                    )}
                  >
                    {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default TransactionView;
