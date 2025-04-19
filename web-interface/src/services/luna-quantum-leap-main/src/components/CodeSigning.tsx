
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CheckCircle2, CircleAlert, FileDigit, Fingerprint, Loader2, Terminal } from 'lucide-react';
import { Algorithm, postQuantumAlgorithms } from '@/lib/algorithms';
import { signData, verifySignature } from '@/utils/cryptoUtils';
import { useToast } from '@/components/ui/use-toast';

const CodeSigning: React.FC = () => {
  const { toast } = useToast();
  const [code, setCode] = useState<string>('package main\n\nimport "fmt"\n\nfunc main() {\n    fmt.Println("Hello, quantum-safe world!")\n}');
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<string>('dilithium3');
  const [signature, setSignature] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [verificationResult, setVerificationResult] = useState<boolean | null>(null);
  const [activeTab, setActiveTab] = useState<string>('sign');
  
  const getSelectedAlgorithm = (): Algorithm | undefined => {
    return postQuantumAlgorithms.find(algo => algo.id === selectedAlgorithm);
  };

  const handleSign = async () => {
    const algorithm = getSelectedAlgorithm();
    if (!algorithm) return;
    
    setIsProcessing(true);
    
    try {
      // Simulate private key - in reality, this would be in the HSM
      const privateKey = "HSM_PROTECTED_PRIVATE_KEY";
      
      const signatureResult = await signData(code, privateKey, algorithm.id);
      setSignature(signatureResult);
      
      toast({
        title: "Code Signed Successfully",
        description: `The code was signed using ${algorithm.name}`,
      });
    } catch (error) {
      console.error("Error signing code:", error);
      toast({
        title: "Error",
        description: "Failed to sign code",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };
  
  const handleVerify = async () => {
    const algorithm = getSelectedAlgorithm();
    if (!algorithm || !signature) {
      toast({
        title: "Error",
        description: "No signature to verify",
        variant: "destructive"
      });
      return;
    }
    
    setIsProcessing(true);
    setVerificationResult(null);
    
    try {
      // Simulate public key - in reality, this would be retrieved from storage
      const publicKey = "PUBLIC_KEY_CORRESPONDING_TO_PRIVATE_KEY";
      
      const isValid = await verifySignature(code, signature, publicKey, algorithm.id);
      setVerificationResult(isValid);
      
      toast({
        title: isValid ? "Signature Valid" : "Signature Invalid",
        description: isValid 
          ? "The code signature was successfully verified" 
          : "The code signature verification failed",
        variant: isValid ? "default" : "destructive"
      });
    } catch (error) {
      console.error("Error verifying signature:", error);
      toast({
        title: "Error",
        description: "Failed to verify signature",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-4" id="code-signing">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Quantum-Safe Code Signing</h2>
          <p className="text-muted-foreground">Sign and verify code with post-quantum algorithms</p>
        </div>
      </div>
      
      <div className="grid md:grid-cols-2 gap-4">
        {/* Code Panel */}
        <Card className="min-h-[550px]">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Terminal className="h-5 w-5 text-quantum-400" />
              Code to Sign
            </CardTitle>
            <CardDescription>Enter or paste the code to sign</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="code">Source Code</Label>
                <Textarea 
                  id="code" 
                  className="font-mono h-[400px] resize-none bg-background" 
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Signing & Verification Panel */}
        <Card className="min-h-[550px]">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Fingerprint className="h-5 w-5 text-quantum-400" />
              Digital Signature
            </CardTitle>
            <CardDescription>Sign and verify with post-quantum algorithms</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="sign" className="space-y-4" onValueChange={setActiveTab} value={activeTab}>
              <TabsList className="grid grid-cols-2">
                <TabsTrigger value="sign">Sign Code</TabsTrigger>
                <TabsTrigger value="verify">Verify Signature</TabsTrigger>
              </TabsList>
              
              <div className="flex flex-col space-y-1.5 mb-4">
                <Label htmlFor="algorithm">Signature Algorithm</Label>
                <Select 
                  value={selectedAlgorithm} 
                  onValueChange={setSelectedAlgorithm}
                >
                  <SelectTrigger id="algorithm">
                    <SelectValue placeholder="Select algorithm" />
                  </SelectTrigger>
                  <SelectContent>
                    {postQuantumAlgorithms.filter(algo => algo.category === 'signature').map((algo) => (
                      <SelectItem key={algo.id} value={algo.id}>{algo.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <TabsContent value="sign" className="space-y-4">
                <Alert className="bg-quantum-950/20">
                  <FileDigit className="h-4 w-4 text-quantum-400" />
                  <AlertDescription>
                    Digitally sign code with quantum-resistant algorithms to ensure authenticity and integrity.
                  </AlertDescription>
                </Alert>
                
                {getSelectedAlgorithm()?.id.includes('xmss') && (
                  <Alert className="bg-amber-950/20">
                    <CircleAlert className="h-4 w-4 text-amber-400" />
                    <AlertDescription>
                      XMSS is a stateful signature scheme. Each signing key must only be used once. The HSM tracks key usage automatically.
                    </AlertDescription>
                  </Alert>
                )}
                
                <Button 
                  onClick={handleSign} 
                  className="w-full gap-2 bg-dilithium-600 hover:bg-dilithium-700"
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Fingerprint className="h-4 w-4" />
                  )}
                  Sign Code with {getSelectedAlgorithm()?.name}
                </Button>
                
                {signature && (
                  <div className="space-y-2">
                    <Label htmlFor="signature">Generated Signature</Label>
                    <ScrollArea className="h-[200px] w-full rounded-md border p-2">
                      <pre className="text-xs font-mono text-muted-foreground">
                        {signature}
                      </pre>
                    </ScrollArea>
                    
                    <Button 
                      variant="outline" 
                      className="w-full" 
                      onClick={() => {
                        navigator.clipboard.writeText(signature);
                        toast({
                          description: "Signature copied to clipboard"
                        });
                      }}
                    >
                      Copy Signature
                    </Button>
                    
                    <Button 
                      variant="secondary" 
                      className="w-full"
                      onClick={() => setActiveTab('verify')}
                    >
                      Go to Verify
                    </Button>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="verify" className="space-y-4">
                <Alert className="bg-quantum-950/20">
                  <CheckCircle2 className="h-4 w-4 text-quantum-400" />
                  <AlertDescription>
                    Verify code signatures to ensure the code hasn't been tampered with.
                  </AlertDescription>
                </Alert>
                
                <div className="space-y-2">
                  <Label htmlFor="verify-signature">Signature to Verify</Label>
                  <Textarea 
                    id="verify-signature" 
                    className="font-mono h-[150px] resize-none" 
                    value={signature}
                    onChange={(e) => setSignature(e.target.value)}
                    placeholder="Paste the signature here..."
                  />
                </div>
                
                <Button 
                  onClick={handleVerify} 
                  className="w-full gap-2 bg-quantum-600 hover:bg-quantum-700"
                  disabled={isProcessing || !signature}
                >
                  {isProcessing ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <CheckCircle2 className="h-4 w-4" />
                  )}
                  Verify Signature
                </Button>
                
                {verificationResult !== null && (
                  <Alert className={verificationResult ? "bg-green-950/20" : "bg-destructive/20"}>
                    {verificationResult ? (
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                    ) : (
                      <CircleAlert className="h-4 w-4 text-destructive" />
                    )}
                    <AlertDescription>
                      {verificationResult
                        ? "Signature validation successful! Code integrity verified."
                        : "Signature validation failed. Code may have been modified."
                      }
                    </AlertDescription>
                  </Alert>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CodeSigning;
