
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ShieldCheck, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface QuantumSafeBlockProps {
  className?: string;
  blockHeight?: number;
  timestamp?: string;
  algorithmUsed?: string;
  secured?: boolean;
}

const QuantumSafeBlock: React.FC<QuantumSafeBlockProps> = ({
  className,
  blockHeight = 1024,
  timestamp = new Date().toISOString(),
  algorithmUsed = 'CRYSTAL-Dilithium3',
  secured = true
}) => {
  return (
    <Card className={cn("quantum-border relative overflow-hidden", className)}>
      <div className={cn(
        "absolute top-0 right-0 w-2 h-full",
        secured ? "bg-dilithium-400" : "bg-red-500"
      )} />
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-dilithium-400" />
          Quantum-Safe Block #{blockHeight}
        </CardTitle>
        <CardDescription>
          {new Date(timestamp).toLocaleString()}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Algorithm:</span>
          <span className="font-mono">{algorithmUsed}</span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="text-muted-foreground">Security Status:</span>
          <span className={cn(
            "px-2 py-0.5 rounded text-xs flex items-center gap-1",
            secured ? "bg-dilithium-950/50 text-dilithium-200" : "bg-red-900/50 text-red-200"
          )}>
            <Lock className="h-3 w-3" />
            {secured ? "Secured" : "Compromised"}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuantumSafeBlock;
