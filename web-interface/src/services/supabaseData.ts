
import { supabase } from "@/integrations/supabase/client";
import { Transaction, Block } from "./blockchainData";

export const fetchRecentTransactions = async (): Promise<Transaction[]> => {
  const { data, error } = await supabase
    .from("transactions")
    .select("*")
    .order("timestamp", { ascending: false })
    .limit(5);

  if (error) {
    console.error("Error fetching transactions:", error);
    return [];
  }

  return data.map((tx) => ({
    id: tx.transaction_hash,
    from: tx.from_address,
    to: tx.to_address,
    amount: tx.amount.toString(),
    timestamp: new Date(tx.timestamp).toLocaleString(),
    quantumSafe: tx.quantum_safe,
  }));
};

export const fetchBlockchain = async (limit: number = 10): Promise<Block[]> => {
  const { data, error } = await supabase
    .from("blocks")
    .select("*, transactions(*)")
    .order("block_number", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Error fetching blockchain:", error);
    return [];
  }

  return data.map((block) => ({
    id: block.block_number,
    hash: block.hash,
    previousHash: block.previous_hash,
    timestamp: new Date(block.timestamp).toLocaleString(),
    quantumSafe: block.quantum_safe,
    transactions: (block.transactions || []).map((tx: any) => ({
      id: tx.transaction_hash,
      from: tx.from_address,
      to: tx.to_address,
      amount: tx.amount.toString(),
      timestamp: new Date(tx.timestamp).toLocaleString(),
      quantumSafe: tx.quantum_safe,
    })),
  }));
};

export const fetchSecurityMetrics = async () => {
  const { data, error } = await supabase
    .from("security_metrics")
    .select("*")
    .single();

  if (error) {
    console.error("Error fetching security metrics:", error);
    return {
      totalBlocks: 0,
      totalTransactions: 0,
      quantumSafePercentage: 0,
      activeAttacks: 0,
      vulnerabilitiesDetected: 0,
      mitigationSuccessRate: 100,
    };
  }

  return {
    totalBlocks: data.total_blocks,
    totalTransactions: data.total_transactions,
    quantumSafePercentage: data.quantum_safe_percentage,
    activeAttacks: data.active_attacks,
    vulnerabilitiesDetected: data.vulnerabilities_detected,
    mitigationSuccessRate: data.mitigation_success_rate,
  };
};

// Edge function to simulate adding a new block to the blockchain
export const simulateNewBlock = async (
  quantumSafe: boolean = true
): Promise<void> => {
  try {
    const { data: latestBlocks, error: fetchError } = await supabase
      .from("blocks")
      .select("*")
      .order("block_number", { ascending: false })
      .limit(1);

    if (fetchError) throw fetchError;

    const lastBlock = latestBlocks?.[0];
    const newBlockNumber = lastBlock ? lastBlock.block_number + 1 : 1;
    const previousHash = lastBlock ? lastBlock.hash : "0000000000000000";
    const newHash = generateHash();

    // Insert new block
    const { error: blockError } = await supabase
      .from("blocks")
      .insert({
        block_number: newBlockNumber,
        hash: newHash,
        previous_hash: previousHash,
        quantum_safe: quantumSafe,
      });

    if (blockError) {
      console.error("Block insert error:", blockError);
      throw blockError;
    }

    // Generate random transactions for this block
    const txCount = Math.floor(Math.random() * 3) + 1;
    const transactions = Array.from({ length: txCount }).map(() => ({
      transaction_hash: generateHash(),
      from_address: generateAddress(),
      to_address: generateAddress(),
      amount: parseFloat((Math.random() * 10).toFixed(4)),
      quantum_safe: quantumSafe,
    }));

    // Insert transactions
    const { error: txError } = await supabase
      .from("transactions")
      .insert(transactions);

    if (txError) {
      console.error("Transaction insert error:", txError);
      throw txError;
    }

    // Update metrics
    await updateSecurityMetrics();
  } catch (error) {
    console.error("Error simulating new block:", error);
    throw error;
  }
};

// Simulate a quantum attack
export const simulateQuantumAttack = async (): Promise<void> => {
  try {
    // Update security metrics to indicate attack in progress
    const { error: updateError } = await supabase
      .from("security_metrics")
      .update({
        active_attacks: 1,
        vulnerabilities_detected: 3,
        updated_at: new Date().toISOString(),
      })
      .eq("id", (await supabase.from("security_metrics").select("id").single()).data.id);

    if (updateError) throw updateError;
    
    return Promise.resolve();
  } catch (error) {
    console.error("Error simulating quantum attack:", error);
    throw error;
  }
};

// Mitigate a quantum attack
export const mitigateQuantumAttack = async (): Promise<void> => {
  try {
    // Update security metrics to indicate attack mitigation
    const { error: updateError } = await supabase
      .from("security_metrics")
      .update({
        active_attacks: 0,
        quantum_safe_percentage: 100,
        mitigation_success_rate: 100,
        updated_at: new Date().toISOString(),
      })
      .eq("id", (await supabase.from("security_metrics").select("id").single()).data.id);

    if (updateError) throw updateError;
    
    // Update all blocks to be quantum safe
    const { error: blocksError } = await supabase
      .from("blocks")
      .update({
        quantum_safe: true,
      })
      .eq("quantum_safe", false);
      
    if (blocksError) throw blocksError;
    
    // Update all transactions to be quantum safe
    const { error: txError } = await supabase
      .from("transactions")
      .update({
        quantum_safe: true,
      })
      .eq("quantum_safe", false);
      
    if (txError) throw txError;
    
    return Promise.resolve();
  } catch (error) {
    console.error("Error mitigating quantum attack:", error);
    throw error;
  }
};

// Helper to update security metrics
async function updateSecurityMetrics() {
  try {
    // Count blocks
    const { count: blockCount, error: blockError } = await supabase
      .from("blocks")
      .select("*", { count: "exact", head: true });

    if (blockError) throw blockError;

    // Count transactions
    const { count: txCount, error: txError } = await supabase
      .from("transactions")
      .select("*", { count: "exact", head: true });

    if (txError) throw txError;

    // Count quantum safe blocks
    const { count: quantumSafeCount, error: quantumError } = await supabase
      .from("blocks")
      .select("*", { count: "exact", head: true })
      .eq("quantum_safe", true);

    if (quantumError) throw quantumError;

    const quantumSafePercentage = blockCount
      ? Math.round((quantumSafeCount / blockCount) * 100)
      : 0;

    // Update metrics
    const { error: updateError } = await supabase
      .from("security_metrics")
      .update({
        total_blocks: blockCount || 0,
        total_transactions: txCount || 0,
        quantum_safe_percentage: quantumSafePercentage,
        updated_at: new Date().toISOString(),
      })
      .eq("id", (await supabase.from("security_metrics").select("id").single()).data.id);

    if (updateError) throw updateError;
  } catch (error) {
    console.error("Error updating security metrics:", error);
  }
}

// Helper functions
function generateHash(): string {
  return (
    "0x" +
    Array.from({ length: 64 })
      .map(() => Math.floor(Math.random() * 16).toString(16))
      .join("")
  );
}

function generateAddress(): string {
  return (
    "0x" +
    Array.from({ length: 40 })
      .map(() => Math.floor(Math.random() * 16).toString(16))
      .join("")
  );
}
