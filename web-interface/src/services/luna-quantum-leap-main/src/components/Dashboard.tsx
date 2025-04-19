
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LucideBarChart3, LucideGitCompare, LucideShieldCheck } from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { algorithmCategories, useCases, postQuantumAlgorithms } from '@/lib/algorithms';
import AlgorithmCard from './AlgorithmCard';
import { cn } from '@/lib/utils';

interface AlgorithmPerformanceData {
  name: string;
  keygen: number;
  sign: number;
  verify: number;
}

const algorithmPerformanceData: AlgorithmPerformanceData[] = [
  {
    name: 'RSA-3072',
    keygen: 120,
    sign: 3500,
    verify: 19000
  },
  {
    name: 'ECDSA-P256',
    keygen: 5600,
    sign: 2800,
    verify: 1100
  },
  {
    name: 'Dilithium2',
    keygen: 2800,
    sign: 3200,
    verify: 12000
  },
  {
    name: 'Dilithium3',
    keygen: 1600,
    sign: 2200,
    verify: 9000
  },
  {
    name: 'SPHINCS+',
    keygen: 9800,
    sign: 14,
    verify: 680
  }
];

interface KemPerformanceData {
  name: string;
  keygen: number;
  encaps: number;
  decaps: number;
}

const kemPerformanceData: KemPerformanceData[] = [
  {
    name: 'RSA-3072',
    keygen: 120,
    encaps: 3500,
    decaps: 120
  },
  {
    name: 'ECDH-P256',
    keygen: 5600,
    encaps: 2800,
    decaps: 2800
  },
  {
    name: 'Kyber512',
    keygen: 5600,
    encaps: 4800,
    decaps: 5200
  },
  {
    name: 'Kyber768',
    keygen: 4200,
    encaps: 3800,
    decaps: 4000
  }
];

interface SizeComparisonData {
  name: string;
  publicKey: number;
  privateKey: number;
  signature: number;
}

const sizeComparisonData: SizeComparisonData[] = [
  {
    name: 'RSA-3072',
    publicKey: 398,
    privateKey: 1200,
    signature: 384
  },
  {
    name: 'ECDSA-P256',
    publicKey: 32,
    privateKey: 32,
    signature: 64
  },
  {
    name: 'Dilithium2',
    publicKey: 1312,
    privateKey: 2528,
    signature: 2420
  },
  {
    name: 'Dilithium3',
    publicKey: 1952,
    privateKey: 4000,
    signature: 3293
  },
  {
    name: 'SPHINCS+',
    publicKey: 32,
    privateKey: 64,
    signature: 17088
  }
];

interface KEMSizeData {
  name: string;
  publicKey: number,
  privateKey: number,
  ciphertext: number
}

const kemSizeData: KEMSizeData[] = [
  {
    name: 'RSA-3072',
    publicKey: 398,
    privateKey: 1200,
    ciphertext: 384
  },
  {
    name: 'ECDH-P256',
    publicKey: 32,
    privateKey: 32,
    ciphertext: 32
  },
  {
    name: 'Kyber512',
    publicKey: 800,
    privateKey: 1632,
    ciphertext: 768
  },
  {
    name: 'Kyber768',
    publicKey: 1184,
    privateKey: 2400,
    ciphertext: 1088
  }
];

const formatPerformanceTooltip = (value: number) => {
  return `${value.toLocaleString()} ops/sec`;
};

const formatSizeTooltip = (value: number) => {
  return `${value.toLocaleString()} bytes`;
};

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-4" id="dashboard">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Post-Quantum Cryptography Dashboard</h2>
          <p className="text-muted-foreground">Overview of algorithms and performance metrics</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {algorithmCategories.map((category) => (
          <Card key={category.id} className="quantum-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">{category.name}</CardTitle>
              <CardDescription className="text-xs">{category.description}</CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex justify-between items-center text-2xl font-bold">
                <span className="text-primary">{
                  category.id === 'signature' ? '3' : 
                  category.id === 'encryption' ? '2' : '1'
                }</span>
                <LucideShieldCheck className={cn(
                  "h-8 w-8",
                  category.id === 'signature' ? 'text-dilithium-400' : 
                  category.id === 'encryption' ? 'text-kyber-400' : 'text-sphincs-400'
                )} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="grid md:grid-cols-2 gap-4">
        {/* Performance Metrics Chart */}
        <Card className="col-span-2">
          <CardHeader className="pb-0">
            <CardTitle className="text-lg flex items-center gap-2">
              <LucideBarChart3 className="h-5 w-5 text-quantum-400" />
              Algorithm Performance Comparison
            </CardTitle>
            <CardDescription>Operations per second (higher is better)</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="signatures">
              <TabsList className="mb-2">
                <TabsTrigger value="signatures">Signature Algorithms</TabsTrigger>
                <TabsTrigger value="kem">Key Encapsulation</TabsTrigger>
              </TabsList>
              
              <TabsContent value="signatures">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={algorithmPerformanceData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 30 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                    <XAxis dataKey="name" stroke="#888" fontSize={12} />
                    <YAxis 
                      stroke="#888" 
                      fontSize={12}
                      tickFormatter={(value) => {
                        if (value >= 1000) return `${(value / 1000).toFixed(1)}k`;
                        return value.toString();
                      }}
                    />
                    <Tooltip 
                      formatter={formatPerformanceTooltip} 
                      contentStyle={{ backgroundColor: '#222', borderColor: '#444' }}
                    />
                    <Legend />
                    <Bar dataKey="keygen" name="Key Generation" fill="#0c91e6" />
                    <Bar dataKey="sign" name="Sign" fill="#9163fa" />
                    <Bar dataKey="verify" name="Verify" fill="#36ad59" />
                  </BarChart>
                </ResponsiveContainer>
              </TabsContent>
              
              <TabsContent value="kem">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={kemPerformanceData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 30 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                    <XAxis dataKey="name" stroke="#888" fontSize={12} />
                    <YAxis 
                      stroke="#888" 
                      fontSize={12}
                      tickFormatter={(value) => {
                        if (value >= 1000) return `${(value / 1000).toFixed(1)}k`;
                        return value.toString();
                      }}
                    />
                    <Tooltip 
                      formatter={formatPerformanceTooltip}
                      contentStyle={{ backgroundColor: '#222', borderColor: '#444' }}
                    />
                    <Legend />
                    <Bar dataKey="keygen" name="Key Generation" fill="#0c91e6" />
                    <Bar dataKey="encaps" name="Encapsulation" fill="#9163fa" />
                    <Bar dataKey="decaps" name="Decapsulation" fill="#36ad59" />
                  </BarChart>
                </ResponsiveContainer>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
        
        {/* Size Comparison Chart */}
        <Card className="col-span-2">
          <CardHeader className="pb-0">
            <CardTitle className="text-lg flex items-center gap-2">
              <LucideGitCompare className="h-5 w-5 text-quantum-400" />
              Size Comparison
            </CardTitle>
            <CardDescription>Key and signature sizes in bytes (smaller is better)</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="signatures">
              <TabsList className="mb-2">
                <TabsTrigger value="signatures">Signature Algorithms</TabsTrigger>
                <TabsTrigger value="kem">Key Encapsulation</TabsTrigger>
              </TabsList>
              
              <TabsContent value="signatures">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={sizeComparisonData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 30 }}
                    layout="vertical"
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#444" horizontal={false} />
                    <XAxis 
                      type="number" 
                      stroke="#888" 
                      fontSize={12}
                      tickFormatter={(value) => {
                        if (value >= 1000) return `${(value / 1000).toFixed(0)}K`;
                        return value.toString();
                      }}
                    />
                    <YAxis type="category" dataKey="name" stroke="#888" fontSize={12} width={80} />
                    <Tooltip 
                      formatter={formatSizeTooltip}
                      contentStyle={{ backgroundColor: '#222', borderColor: '#444' }}
                    />
                    <Legend />
                    <Bar dataKey="publicKey" name="Public Key" fill="#0c91e6" />
                    <Bar dataKey="privateKey" name="Private Key" fill="#9163fa" />
                    <Bar dataKey="signature" name="Signature" fill="#36ad59" />
                  </BarChart>
                </ResponsiveContainer>
              </TabsContent>
              
              <TabsContent value="kem">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={kemSizeData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 30 }}
                    layout="vertical"
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#444" horizontal={false} />
                    <XAxis 
                      type="number" 
                      stroke="#888" 
                      fontSize={12}
                      tickFormatter={(value) => {
                        if (value >= 1000) return `${(value / 1000).toFixed(0)}K`;
                        return value.toString();
                      }}
                    />
                    <YAxis type="category" dataKey="name" stroke="#888" fontSize={12} width={80} />
                    <Tooltip 
                      formatter={formatSizeTooltip}
                      contentStyle={{ backgroundColor: '#222', borderColor: '#444' }}
                    />
                    <Legend />
                    <Bar dataKey="publicKey" name="Public Key" fill="#0c91e6" />
                    <Bar dataKey="privateKey" name="Private Key" fill="#9163fa" />
                    <Bar dataKey="ciphertext" name="Ciphertext" fill="#36ad59" />
                  </BarChart>
                </ResponsiveContainer>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
      
      <div className="space-y-4" id="algorithms">
        <h3 className="text-xl font-bold">Recommended Algorithms</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {useCases.map((useCase) => (
            <Card key={useCase.id}>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{useCase.name}</CardTitle>
                <CardDescription>{useCase.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  <h4 className="text-sm font-medium">Recommended Algorithms:</h4>
                  <div className="flex flex-wrap gap-2">
                    {useCase.recommendedAlgorithms.map((algoId) => {
                      const algo = postQuantumAlgorithms.find(a => a.id === algoId);
                      return algo ? (
                        <div 
                          key={algoId} 
                          className={cn(
                            "text-xs py-1 px-2 rounded-md",
                            algo.colorScheme === 'dilithium' ? 'bg-dilithium-950/50 text-dilithium-200' :
                            algo.colorScheme === 'kyber' ? 'bg-kyber-950/50 text-kyber-200' :
                            algo.colorScheme === 'sphincs' ? 'bg-sphincs-950/50 text-sphincs-200' :
                            'bg-quantum-950/50 text-quantum-200'
                          )}
                        >
                          {algo.name}
                        </div>
                      ) : null;
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
