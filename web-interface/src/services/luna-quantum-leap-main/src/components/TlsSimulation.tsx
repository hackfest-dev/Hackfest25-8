
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  CircleCheck,
  Loader2,
  Lock,
  PlugZap,
  ServerCog,
  ShieldCheck,
  Wifi
} from 'lucide-react';
import { simulateTlsHandshake } from '@/utils/cryptoUtils';
import { useToast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';

const TlsSimulation: React.FC = () => {
  const { toast } = useToast();
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [handshakeSteps, setHandshakeSteps] = useState<any[]>([]);
  const [selectedClientAlgos, setSelectedClientAlgos] = useState<string[]>(['kyber768', 'dilithium3']);
  const [selectedServerAlgos, setSelectedServerAlgos] = useState<string[]>(['kyber768', 'dilithium3']);
  const [completedSteps, setCompletedSteps] = useState<number>(0);
  const [sharedSecret, setSharedSecret] = useState<string>('');
  
  const algorithmOptions = [
    { id: 'kyber512', name: 'CRYSTAL-Kyber512', type: 'KEM' },
    { id: 'kyber768', name: 'CRYSTAL-Kyber768', type: 'KEM' },
    { id: 'dilithium2', name: 'CRYSTAL-Dilithium2', type: 'Signature' },
    { id: 'dilithium3', name: 'CRYSTAL-Dilithium3', type: 'Signature' }
  ];
  
  const toggleClientAlgorithm = (id: string) => {
    setSelectedClientAlgos(prevSelected => 
      prevSelected.includes(id)
        ? prevSelected.filter(algoId => algoId !== id)
        : [...prevSelected, id]
    );
  };
  
  const toggleServerAlgorithm = (id: string) => {
    setSelectedServerAlgos(prevSelected => 
      prevSelected.includes(id)
        ? prevSelected.filter(algoId => algoId !== id)
        : [...prevSelected, id]
    );
  };

  const handleSimulateTls = async () => {
    if (selectedClientAlgos.length === 0 || selectedServerAlgos.length === 0) {
      toast({
        title: "Configuration Error",
        description: "Both client and server must support at least one algorithm",
        variant: "destructive"
      });
      return;
    }
    
    setIsSimulating(true);
    setHandshakeSteps([]);
    setCompletedSteps(0);
    setSharedSecret('');
    
    try {
      const result = await simulateTlsHandshake(
        selectedClientAlgos,
        selectedServerAlgos
      );
      
      // Process each step with a delay to visualize the handshake
      for (let i = 0; i < result.steps.length; i++) {
        const step = result.steps[i];
        
        // Add step to displayed steps
        setHandshakeSteps(prevSteps => [...prevSteps, step]);
        
        // Increment completed steps counter
        setCompletedSteps(i + 1);
        
        // Wait before processing next step (except for last step)
        if (i < result.steps.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 800));
        }
      }
      
      if (result.success) {
        setSharedSecret(result.sharedSecret);
        
        toast({
          title: "TLS Handshake Successful",
          description: "Quantum-safe secure connection established",
        });
      }
    } catch (error) {
      console.error("Error simulating TLS handshake:", error);
      toast({
        title: "Handshake Failed",
        description: "An error occurred during the TLS simulation",
        variant: "destructive"
      });
    } finally {
      setIsSimulating(false);
    }
  };
  
  const renderHandshakeStep = (step: any, index: number) => {
    const isCompleted = index < completedSteps;
    const isCurrent = index === completedSteps - 1;
    
    const iconMap: Record<string, React.ReactNode> = {
      'ClientHello': <Wifi className={cn("h-5 w-5", isCompleted ? "text-quantum-400" : "text-muted-foreground/50")} />,
      'ServerHello': <ServerCog className={cn("h-5 w-5", isCompleted ? "text-quantum-400" : "text-muted-foreground/50")} />,
      'ClientKeyShare': <PlugZap className={cn("h-5 w-5", isCompleted ? "text-quantum-400" : "text-muted-foreground/50")} />,
      'ServerFinished': <Lock className={cn("h-5 w-5", isCompleted ? "text-quantum-400" : "text-muted-foreground/50")} />,
      'HandshakeComplete': <CircleCheck className={cn("h-5 w-5", isCompleted ? "text-quantum-400" : "text-muted-foreground/50")} />,
    };
    
    return (
      <div 
        key={`step-${index}`} 
        className={cn(
          "flex items-start gap-3 p-3 rounded-md transition-all",
          isCompleted ? "bg-quantum-950/20" : "bg-muted/10",
          isCurrent ? "animate-pulse" : ""
        )}
      >
        <div className="mt-1">
          {iconMap[step.step] || <ShieldCheck className="h-5 w-5 text-muted-foreground/50" />}
        </div>
        <div className="flex-1">
          <h4 className={cn(
            "text-sm font-medium",
            isCompleted ? "text-foreground" : "text-muted-foreground"
          )}>
            {step.step}
          </h4>
          <p className="text-xs text-muted-foreground">{step.description}</p>
          
          {isCompleted && step.data && (
            <ScrollArea className="h-32 w-full rounded-md mt-2 bg-background/30 p-2">
              <pre className="text-xs font-mono text-muted-foreground">
                {JSON.stringify(step.data, null, 2)}
              </pre>
            </ScrollArea>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4" id="tls">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Quantum-Safe TLS</h2>
          <p className="text-muted-foreground">Simulate TLS handshakes with post-quantum algorithms</p>
        </div>
      </div>
      
      <div className="grid md:grid-cols-2 gap-4">
        <Card className="min-h-[500px]">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-quantum-400" />
              Configuration
            </CardTitle>
            <CardDescription>Configure client and server supported algorithms</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-semibold mb-2">Client Supported Algorithms</h3>
                <div className="grid grid-cols-2 gap-2">
                  {algorithmOptions.map((algo) => (
                    <div key={`client-${algo.id}`} className="flex items-center space-x-2 border p-2 rounded-md">
                      <Checkbox 
                        id={`client-${algo.id}`} 
                        checked={selectedClientAlgos.includes(algo.id)}
                        onCheckedChange={() => toggleClientAlgorithm(algo.id)}
                      />
                      <label
                        htmlFor={`client-${algo.id}`}
                        className="text-sm font-medium cursor-pointer leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex flex-col"
                      >
                        {algo.name}
                        <span className="text-xs text-muted-foreground">{algo.type}</span>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="text-sm font-semibold mb-2">Server Supported Algorithms</h3>
                <div className="grid grid-cols-2 gap-2">
                  {algorithmOptions.map((algo) => (
                    <div key={`server-${algo.id}`} className="flex items-center space-x-2 border p-2 rounded-md">
                      <Checkbox 
                        id={`server-${algo.id}`} 
                        checked={selectedServerAlgos.includes(algo.id)}
                        onCheckedChange={() => toggleServerAlgorithm(algo.id)}
                      />
                      <label
                        htmlFor={`server-${algo.id}`}
                        className="text-sm font-medium cursor-pointer leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex flex-col"
                      >
                        {algo.name}
                        <span className="text-xs text-muted-foreground">{algo.type}</span>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              
              <Button 
                onClick={handleSimulateTls} 
                className="w-full gap-2 bg-quantum-600 hover:bg-quantum-700"
                disabled={isSimulating}
              >
                {isSimulating ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <PlugZap className="h-4 w-4" />
                )}
                Simulate TLS Handshake
              </Button>
              
              {sharedSecret && (
                <div className="p-3 rounded-md bg-quantum-950/20 space-y-2">
                  <h4 className="text-sm font-medium">Established Shared Secret</h4>
                  <p className="text-xs font-mono text-muted-foreground break-all">{sharedSecret}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card className="min-h-[500px]">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Lock className="h-5 w-5 text-quantum-400" />
              TLS Handshake Simulation
            </CardTitle>
            <CardDescription>Visualize the steps of a quantum-safe TLS handshake</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {handshakeSteps.length > 0 ? (
                handshakeSteps.map((step, index) => renderHandshakeStep(step, index))
              ) : (
                <div className="flex flex-col items-center justify-center h-[400px] border border-dashed rounded-md p-4">
                  <Lock className="h-10 w-10 text-muted-foreground/50 mb-2" />
                  <p className="text-sm text-center text-muted-foreground">
                    Configure the settings and click "Simulate TLS Handshake" to start.
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TlsSimulation;
