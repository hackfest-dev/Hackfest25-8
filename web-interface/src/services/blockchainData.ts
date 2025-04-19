
import { generateDate, generateId, generateAddress, generateAmount } from "./utils";

export interface Transaction {
  id: string;
  from: string;
  to: string;
  amount: string;
  timestamp: string;
  quantumSafe: boolean;
}

export interface Block {
  id: number;
  hash: string;
  previousHash: string;
  timestamp: string;
  transactions: Transaction[];
  quantumSafe: boolean;
}

export const generateTransactions = (count: number, quantumSafe: boolean = false): Transaction[] => {
  return Array.from({ length: count }).map(() => ({
    id: generateId(),
    from: generateAddress(),
    to: generateAddress(),
    amount: generateAmount(),
    timestamp: generateDate(),
    quantumSafe,
  }));
};

export const getRecentTransactions = (): Transaction[] => {
  const classicalTransactions = generateTransactions(3, false);
  const quantumTransactions = generateTransactions(5, true);
  
  return [...quantumTransactions, ...classicalTransactions]
    .sort(() => Math.random() - 0.5)
    .slice(0, 5);
};

export const getBlockchain = (length: number): Block[] => {
  return Array.from({ length }).map((_, index) => {
    const quantumSafe = index > length / 2; // Later blocks are quantum-safe
    
    return {
      id: index + 1,
      hash: generateId(),
      previousHash: index === 0 ? "0000000000000000" : generateId(),
      timestamp: generateDate(index * 600000), // 10 minutes apart
      transactions: generateTransactions(Math.floor(Math.random() * 5) + 1, quantumSafe),
      quantumSafe,
    };
  });
};

export const getSecurityMetrics = () => {
  return {
    totalBlocks: 12843,
    totalTransactions: 153921,
    quantumSafePercentage: 78,
    activeAttacks: 0,
    vulnerabilitiesDetected: 3,
    mitigationSuccessRate: 100,
  };
};
