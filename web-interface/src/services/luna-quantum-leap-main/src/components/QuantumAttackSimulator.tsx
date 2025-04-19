
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ShieldOff, Shield, Lock } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface AttackResult {
  targetAlgorithm: string;
  isSuccessful: boolean;
  timeToBreak?: string;
  qubits?: number;
  details: string;
}

const QuantumAttackSimulator: React.FC = () => {
  const [isAttacking, setIsAttacking] = useState(false);
  const [attackProgress, setAttackProgress] = useState(0);
  const [attackResults, setAttackResults] = useState<AttackResult[]>([]);

  const simulateAttack = async (algorithm: string) => {
    setIsAttacking(true);
    setAttackProgress(0);
    
    // Simulate progress over time
    const interval = setInterval(() => {
      setAttackProgress(prev => {
        const newProgress = prev + 2;
        if (newProgress >= 100) {
          clearInterval(interval);
          return 100;
        }
        return newProgress;
      });
    }, 50);

    // Simulate attack completion
    setTimeout(() => {
      clearInterval(interval);
      setAttackProgress(100);
      setIsAttacking(false);
      
      // Generate attack result based on algorithm
      let result: AttackResult;
      
      if (algorithm === 'rsa' || algorithm === 'ecdsa') {
        result = {
          targetAlgorithm: algorithm === 'rsa' ? 'RSA-3072' : 'ECDSA P-256',
          isSuccessful: true,
          timeToBreak: algorithm === 'rsa' ? '6 hours 23 minutes' : '3 hours 47 minutes',
          qubits: algorithm === 'rsa' ? 4099 : 2330,
          details: algorithm === 'rsa' ? 
            'Vulnerable to Shor\'s algorithm quantum attack, which can efficiently factor large primes.' :
            'Vulnerable to quantum attacks that can solve the elliptic curve discrete logarithm problem efficiently.'
        };
      } else {
        // Post-quantum algorithms
        result = {
          targetAlgorithm: algorithm === 'dilithium' ? 'CRYSTAL-Dilithium3' : 
                         algorithm === 'kyber' ? 'CRYSTAL-Kyber768' : 'SPHINCS+',
          isSuccessful: false,
          qubits: 5000,
          details: `${algorithm === 'dilithium' ? 'Lattice-based' : 
                   algorithm === 'kyber' ? 'Lattice-based KEM' : 
                   'Hash-based signature'} algorithm resistant to known quantum attacks. The structure of this algorithm provides quantum resistance.`
        };
      }
      
      setAttackResults(prev => [result, ...prev]);
    }, algorithm === 'rsa' || algorithm === 'ecdsa' ? 3000 : 5000);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShieldOff className="h-5 w-5 text-red-500" />
          Quantum Attack Simulator
        </CardTitle>
        <CardDescription>
          Simulate quantum computing attacks against different cryptographic algorithms
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs defaultValue="classical">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="classical">Classical Algorithms</TabsTrigger>
            <TabsTrigger value="quantum">Quantum-Safe Algorithms</TabsTrigger>
          </TabsList>
          
          <TabsContent value="classical" className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-sm font-medium">RSA-3072</h3>
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  Public key cryptography based on factoring large primes
                </div>
                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={() => simulateAttack('rsa')}
                  disabled={isAttacking}
                >
                  Simulate Attack
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-sm font-medium">ECDSA P-256</h3>
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  Elliptic Curve Digital Signature Algorithm
                </div>
                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={() => simulateAttack('ecdsa')}
                  disabled={isAttacking}
                >
                  Simulate Attack
                </Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="quantum" className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-sm font-medium">CRYSTAL-Dilithium3</h3>
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  Lattice-based digital signature algorithm
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => simulateAttack('dilithium')}
                  disabled={isAttacking}
                >
                  Test Resistance
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-sm font-medium">CRYSTAL-Kyber768</h3>
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  Lattice-based key encapsulation mechanism
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => simulateAttack('kyber')}
                  disabled={isAttacking}
                >
                  Test Resistance
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-sm font-medium">SPHINCS+</h3>
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  Hash-based digital signature algorithm
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => simulateAttack('sphincs')}
                  disabled={isAttacking}
                >
                  Test Resistance
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        {isAttacking && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Simulating quantum attack...</span>
              <span className="text-sm">{attackProgress}%</span>
            </div>
            <Progress value={attackProgress} className="h-2" />
          </div>
        )}
        
        {attackResults.length > 0 && (
          <div className="space-y-3 mt-4">
            <h3 className="text-sm font-medium">Attack Results</h3>
            {attackResults.map((result, idx) => (
              <Alert key={idx} variant={result.isSuccessful ? "destructive" : "default"}>
                <div className="flex items-start">
                  {result.isSuccessful ? (
                    <ShieldOff className="h-4 w-4 mt-0.5" />
                  ) : (
                    <Lock className="h-4 w-4 mt-0.5" />
                  )}
                  <div className="ml-2">
                    <AlertTitle>
                      {result.isSuccessful ? 
                        `${result.targetAlgorithm} compromised in ${result.timeToBreak}` : 
                        `${result.targetAlgorithm} withstood attack`}
                    </AlertTitle>
                    <AlertDescription className="text-xs">
                      <p>{result.details}</p>
                      {result.qubits && (
                        <p className="mt-1">Simulated quantum computer: {result.qubits.toLocaleString()} qubits</p>
                      )}
                    </AlertDescription>
                  </div>
                </div>
              </Alert>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default QuantumAttackSimulator;
