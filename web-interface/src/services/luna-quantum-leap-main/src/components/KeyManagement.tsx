
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { KeyRound, KeySquare, Loader2, Plus, RefreshCcw, Save, Trash2, ShieldAlert } from 'lucide-react';
import { Algorithm, postQuantumAlgorithms } from '@/lib/algorithms';
import { generateKeyPair } from '@/utils/cryptoUtils';
import { useToast } from '@/components/ui/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

interface KeyPair {
  id: string;
  algorithm: Algorithm;
  publicKey: string;
  privateKey: string;
  createdAt: Date;
  description: string;
}

const KeyManagement: React.FC = () => {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [keyPairs, setKeyPairs] = useState<KeyPair[]>([]);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<Algorithm | null>(null);
  const [activeKey, setActiveKey] = useState<KeyPair | null>(null);
  
  const handleGenerateKeyPair = async () => {
    if (!selectedAlgorithm) {
      toast({
        title: "Error",
        description: "Please select an algorithm first",
        variant: "destructive"
      });
      return;
    }
    
    setIsGenerating(true);
    
    try {
      const result = await generateKeyPair(selectedAlgorithm.id, {
        securityLevel: selectedAlgorithm.securityLevel
      });
      
      const newKeyPair: KeyPair = {
        id: `key-${Date.now()}`,
        algorithm: selectedAlgorithm,
        publicKey: result.publicKey,
        privateKey: result.privateKey,
        createdAt: new Date(),
        description: `${selectedAlgorithm.name} Key`
      };
      
      setKeyPairs([newKeyPair, ...keyPairs]);
      setActiveKey(newKeyPair);
      
      toast({
        title: "Success",
        description: `Generated new ${selectedAlgorithm.name} key pair`,
      });
    } catch (error) {
      console.error("Error generating key pair:", error);
      toast({
        title: "Error",
        description: "Failed to generate key pair",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };
  
  const handleDeleteKey = (keyId: string) => {
    setKeyPairs(keyPairs.filter(key => key.id !== keyId));
    if (activeKey?.id === keyId) {
      setActiveKey(null);
    }
    
    toast({
      title: "Key Deleted",
      description: "The key pair has been permanently deleted",
    });
  };

  return (
    <div className="space-y-4" id="key-management">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Key Management</h2>
          <p className="text-muted-foreground">Generate and manage post-quantum keys in your HSM</p>
        </div>
      </div>
      
      <div className="grid lg:grid-cols-3 gap-4">
        {/* Algorithm selection panel */}
        <Card className="border-quantum-border quantum-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <KeyRound className="h-5 w-5 text-quantum-400" />
              Algorithm Selection
            </CardTitle>
            <CardDescription>Choose an algorithm for key generation</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <ScrollArea className="h-[240px] pr-4">
                <div className="space-y-2">
                  {postQuantumAlgorithms.map((algo) => (
                    <Button
                      key={algo.id}
                      variant={selectedAlgorithm?.id === algo.id ? "secondary" : "outline"}
                      className={cn(
                        "w-full justify-start text-left",
                        selectedAlgorithm?.id === algo.id ? "border-quantum-400/50" : ""
                      )}
                      onClick={() => setSelectedAlgorithm(algo)}
                    >
                      <div className="flex flex-col items-start">
                        <span>{algo.name}</span>
                        <span className="text-xs text-muted-foreground">{algo.category}</span>
                      </div>
                    </Button>
                  ))}
                </div>
              </ScrollArea>
              
              <div className="pt-2">
                <Button 
                  className="w-full gap-2 bg-quantum-600 hover:bg-quantum-700" 
                  onClick={handleGenerateKeyPair}
                  disabled={!selectedAlgorithm || isGenerating}
                >
                  {isGenerating ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Plus className="h-4 w-4" />
                  )}
                  Generate Key Pair
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Key list panel */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <KeySquare className="h-5 w-5 text-quantum-400" />
              Generated Keys
            </CardTitle>
            <CardDescription>Your post-quantum key inventory</CardDescription>
          </CardHeader>
          <CardContent>
            {keyPairs.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-[240px] border border-dashed rounded-md p-4">
                <KeySquare className="h-10 w-10 text-muted-foreground/50 mb-2" />
                <p className="text-sm text-center text-muted-foreground">
                  No keys generated yet. Select an algorithm and generate your first key pair.
                </p>
              </div>
            ) : (
              <ScrollArea className="h-[240px] pr-4">
                <div className="space-y-2">
                  {keyPairs.map((keyPair) => (
                    <Button
                      key={keyPair.id}
                      variant={activeKey?.id === keyPair.id ? "secondary" : "outline"}
                      className="w-full justify-start text-left"
                      onClick={() => setActiveKey(keyPair)}
                    >
                      <div className="flex flex-col items-start w-full overflow-hidden">
                        <div className="flex justify-between items-center w-full">
                          <span className="truncate">{keyPair.description}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 hover:text-destructive opacity-70"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteKey(keyPair.id);
                            }}
                          >
                            <Trash2 className="h-3 w-3" />
                            <span className="sr-only">Delete key</span>
                          </Button>
                        </div>
                        <span className="text-xs text-muted-foreground">{keyPair.algorithm.name}</span>
                      </div>
                    </Button>
                  ))}
                </div>
              </ScrollArea>
            )}
            
            <div className="flex justify-between items-center pt-4">
              <Button variant="outline" size="sm" className="gap-1">
                <RefreshCcw className="h-3 w-3" />
                Refresh
              </Button>
              <Button variant="outline" size="sm" className="gap-1">
                <Save className="h-3 w-3" />
                Export
              </Button>
            </div>
          </CardContent>
        </Card>
        
        {/* Key details panel */}
        <Card className="min-h-[372px]">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <KeyRound className="h-5 w-5 text-quantum-400" />
              Key Details
            </CardTitle>
            <CardDescription>
              {activeKey ? `${activeKey.description}` : 'Select a key to view details'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {activeKey ? (
              <Tabs defaultValue="public">
                <TabsList className="grid grid-cols-2 mb-2">
                  <TabsTrigger value="public">Public Key</TabsTrigger>
                  <TabsTrigger value="private">Private Key</TabsTrigger>
                </TabsList>
                <TabsContent value="public">
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium mb-1">Algorithm</h4>
                      <p className="text-sm text-muted-foreground">{activeKey.algorithm.name}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium mb-1">Created</h4>
                      <p className="text-sm text-muted-foreground">
                        {activeKey.createdAt.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium mb-1">Public Key (HSM Protected)</h4>
                      <ScrollArea className="h-20 w-full rounded-md border p-2">
                        <pre className="text-xs font-mono text-muted-foreground">
                          {activeKey.publicKey}
                        </pre>
                      </ScrollArea>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="private">
                  <Alert className="mb-4 bg-destructive/20 border-destructive/50">
                    <ShieldAlert className="h-4 w-4 mr-2" />
                    <AlertDescription className="text-xs">
                      Private key material is protected by the Luna HSM and never exposed in plaintext
                    </AlertDescription>
                  </Alert>
                  <div className="space-y-2">
                    <div>
                      <h4 className="text-sm font-medium mb-1">Private Key Reference</h4>
                      <ScrollArea className="h-20 w-full rounded-md border p-2">
                        <pre className="text-xs font-mono text-muted-foreground">
                          {`[HSM PROTECTED CONTENT]
Handle: ${activeKey.id.split('-')[1]}
Type: ${activeKey.algorithm.category.toUpperCase()}
Created: ${activeKey.createdAt.toISOString()}`}
                        </pre>
                      </ScrollArea>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            ) : (
              <div className="flex flex-col items-center justify-center h-[240px] border border-dashed rounded-md p-4">
                <KeyRound className="h-10 w-10 text-muted-foreground/50 mb-2" />
                <p className="text-sm text-center text-muted-foreground">
                  Select a key from the list to view its details.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default KeyManagement;
