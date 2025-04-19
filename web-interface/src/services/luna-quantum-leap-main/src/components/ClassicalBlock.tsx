
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, ShieldOff } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ClassicalBlockProps {
  className?: string;
  blockHeight?: number;
  timestamp?: string;
  algorithmUsed?: string;
  compromised?: boolean;
}

const ClassicalBlock: React.FC<ClassicalBlockProps> = ({
  className,
  blockHeight = 1023,
  timestamp = new Date().toISOString(),
  algorithmUsed = 'RSA-3072',
  compromised = false
}) => {
  return (
    <Card className={cn("relative overflow-hidden", className)}>
      <div className={cn(
        "absolute top-0 right-0 w-2 h-full",
        compromised ? "bg-red-500" : "bg-quantum-400"
      )} />
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          {compromised ? (
            <ShieldOff className="h-5 w-5 text-red-500" />
          ) : (
            <Shield className="h-5 w-5 text-quantum-400" />
          )}
          Classical Block #{blockHeight}
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
          <span className="text-muted-foreground">Quantum Resistance:</span>
          <span className={cn(
            "px-2 py-0.5 rounded text-xs",
            compromised ? "bg-red-900/50 text-red-200" : "bg-green-900/50 text-green-200"
          )}>
            {compromised ? "Vulnerable" : "Currently Safe"}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

export default ClassicalBlock;
