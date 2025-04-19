
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Algorithm } from '@/lib/algorithms';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { CircleCheck, Clock, Fingerprint, Key, Shield, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface AlgorithmCardProps {
  algorithm: Algorithm;
  className?: string;
  onSelect?: (algorithm: Algorithm) => void;
}

const AlgorithmCard: React.FC<AlgorithmCardProps> = ({ 
  algorithm, 
  className,
  onSelect
}) => {
  const [expanded, setExpanded] = useState(false);
  
  const getSecurityLevelBadge = (level: string) => {
    switch(level) {
      case 'level1':
        return <Badge variant="outline" className="bg-dilithium-950/20 hover:bg-dilithium-950/30 text-dilithium-200">Level 1 (AES-128)</Badge>;
      case 'level3':
        return <Badge variant="outline" className="bg-kyber-950/20 hover:bg-kyber-950/30 text-kyber-200">Level 3 (AES-192)</Badge>;
      case 'level5':
        return <Badge variant="outline" className="bg-sphincs-950/20 hover:bg-sphincs-950/30 text-sphincs-200">Level 5 (AES-256)</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };
  
  const getCategoryBadge = (category: string) => {
    switch(category) {
      case 'signature':
        return <Badge className="bg-dilithium-600 hover:bg-dilithium-700">Digital Signature</Badge>;
      case 'encryption':
        return <Badge className="bg-kyber-600 hover:bg-kyber-700">Key Encapsulation</Badge>;
      case 'hash':
        return <Badge className="bg-sphincs-600 hover:bg-sphincs-700">Hash-Based</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };
  
  const getStandardBadge = (status: string) => {
    if (status.includes('NIST selected')) {
      return <Badge variant="secondary" className="border-quantum-400/30">NIST Selected</Badge>;
    } else if (status.includes('NIST finalist')) {
      return <Badge variant="secondary" className="border-quantum-400/30">NIST Finalist</Badge>;
    } else if (status.includes('NIST alternate')) {
      return <Badge variant="secondary" className="border-quantum-400/30">NIST Alternate</Badge>;
    } else {
      return <Badge variant="secondary" className="border-quantum-400/30">{status}</Badge>;
    }
  };
  
  const cardColorClass = algorithm.colorScheme === 'dilithium' 
    ? 'border-dilithium-600/20 hover:border-dilithium-500/30 card-glow' 
    : algorithm.colorScheme === 'kyber'
    ? 'border-kyber-600/20 hover:border-kyber-500/30 card-glow'
    : algorithm.colorScheme === 'sphincs'
    ? 'border-sphincs-600/20 hover:border-sphincs-500/30 card-glow'
    : 'border-quantum-600/20 hover:border-quantum-500/30 card-glow';
  
  return (
    <Card className={cn(
      "flex flex-col overflow-hidden transition-all duration-300", 
      cardColorClass,
      expanded ? "h-auto" : "h-[280px]",
      className
    )}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{algorithm.name}</CardTitle>
            <CardDescription className="mt-1">{getCategoryBadge(algorithm.category)}</CardDescription>
          </div>
          {getStandardBadge(algorithm.standardStatus)}
        </div>
      </CardHeader>
      <CardContent className="pb-2 flex-1">
        <div className={cn(
          "text-sm text-muted-foreground transition-all duration-300",
          expanded ? "" : "line-clamp-2"
        )}>
          {algorithm.description}
        </div>
        
        {expanded && (
          <>
            <Separator className="my-4" />
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2 text-sm">
                  <Shield className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Security:</span>
                </div>
                {getSecurityLevelBadge(algorithm.securityLevel)}
              </div>
              
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2 text-sm">
                  <Key className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Public Key:</span>
                </div>
                <span className="text-sm font-mono">{algorithm.keySize} bytes</span>
              </div>
              
              {algorithm.signatureSize && (
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2 text-sm">
                    <Fingerprint className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Signature:</span>
                  </div>
                  <span className="text-sm font-mono">{algorithm.signatureSize} bytes</span>
                </div>
              )}
              
              {algorithm.encapsulationSize && (
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2 text-sm">
                    <CircleCheck className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Ciphertext:</span>
                  </div>
                  <span className="text-sm font-mono">{algorithm.encapsulationSize} bytes</span>
                </div>
              )}
              
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Performance:</span>
                </div>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex gap-1">
                        <span className={cn(
                          "w-2 h-4 rounded-sm",
                          algorithm.category === 'signature' && algorithm.name.includes('SPHINCS') 
                            ? "bg-destructive/70" 
                            : "bg-green-500/70"
                        )}></span>
                        <span className={cn(
                          "w-2 h-4 rounded-sm",
                          algorithm.category === 'signature' && algorithm.name.includes('SPHINCS') 
                            ? "bg-destructive/50" 
                            : "bg-green-500/50"
                        )}></span>
                        <span className={cn(
                          "w-2 h-4 rounded-sm",
                          "bg-green-500/30"
                        )}></span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs">{algorithm.category === 'signature' && algorithm.name.includes('SPHINCS') 
                        ? 'Slower signing, fast verification' 
                        : 'Good all-around performance'
                      }</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          </>
        )}
      </CardContent>
      <CardFooter className="flex gap-2 pt-0">
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-xs gap-1"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? 'Show Less' : 'Show More'}
        </Button>
        <Button 
          variant="default" 
          size="sm" 
          className={cn(
            "ml-auto text-xs gap-1",
            algorithm.colorScheme === 'dilithium' ? 'bg-dilithium-600 hover:bg-dilithium-700' :
            algorithm.colorScheme === 'kyber' ? 'bg-kyber-600 hover:bg-kyber-700' :
            algorithm.colorScheme === 'sphincs' ? 'bg-sphincs-600 hover:bg-sphincs-700' :
            'bg-quantum-600 hover:bg-quantum-700'
          )}
          onClick={() => onSelect && onSelect(algorithm)}
        >
          <ShieldCheck className="h-3 w-3" />
          Select
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AlgorithmCard;
