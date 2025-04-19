
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartLegend, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend,
  BarChart,  // Add this import
  Bar        // Add this import
} from 'recharts';
import { ChartLine, PieChart as PieChartIcon, Shield, ChartBarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

const transactionsByAlgorithm = [
  { name: 'CRYSTAL-Kyber512', value: 35 },
  { name: 'CRYSTAL-Kyber768', value: 25 },
  { name: 'CRYSTAL-Dilithium2', value: 18 },
  { name: 'CRYSTAL-Dilithium3', value: 12 },
  { name: 'SPHINCS+', value: 5 },
  { name: 'RSA-3072', value: 5 },
];

const transactionTimeline = [
  { date: '2025-04-10', quantum: 12, classical: 8, compromised: 1 },
  { date: '2025-04-11', quantum: 15, classical: 7, compromised: 1 },
  { date: '2025-04-12', quantum: 18, classical: 6, compromised: 2 },
  { date: '2025-04-13', quantum: 20, classical: 5, compromised: 0 },
  { date: '2025-04-14', quantum: 22, classical: 5, compromised: 1 },
  { date: '2025-04-15', quantum: 25, classical: 4, compromised: 2 },
  { date: '2025-04-16', quantum: 28, classical: 3, compromised: 0 },
  { date: '2025-04-17', quantum: 30, classical: 2, compromised: 1 },
  { date: '2025-04-18', quantum: 32, classical: 2, compromised: 0 },
  { date: '2025-04-19', quantum: 35, classical: 1, compromised: 0 },
];

const securityData = [
  { category: 'Quantum-Safe', value: 78 },
  { category: 'Classical', value: 17 },
  { category: 'Compromised', value: 5 },
];

const COLORS = ['#9163fa', '#0c91e6', '#ff4d4f'];

const TransactionAnalytics: React.FC = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Transaction Analytics</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <PieChartIcon className="h-5 w-5 text-quantum-400" />
              Transaction Security Profile
            </CardTitle>
            <CardDescription>Distribution of transaction security types</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={securityData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({name, percent}) => `${(percent * 100).toFixed(0)}%`}
                >
                  {securityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <ChartLine className="h-5 w-5 text-quantum-400" />
              Transaction Timeline
            </CardTitle>
            <CardDescription>Daily transactions by security type</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart
                data={transactionTimeline}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorQuantum" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#9163fa" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#9163fa" stopOpacity={0.2}/>
                  </linearGradient>
                  <linearGradient id="colorClassical" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0c91e6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#0c91e6" stopOpacity={0.2}/>
                  </linearGradient>
                  <linearGradient id="colorCompromised" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ff4d4f" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#ff4d4f" stopOpacity={0.2}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" />
                <YAxis />
                <CartesianGrid strokeDasharray="3 3" />
                <Tooltip />
                <Area type="monotone" dataKey="quantum" stroke="#9163fa" fillOpacity={1} fill="url(#colorQuantum)" />
                <Area type="monotone" dataKey="classical" stroke="#0c91e6" fillOpacity={1} fill="url(#colorClassical)" />
                <Area type="monotone" dataKey="compromised" stroke="#ff4d4f" fillOpacity={1} fill="url(#colorCompromised)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Shield className="h-5 w-5 text-quantum-400" />
            Algorithm Adoption
          </CardTitle>
          <CardDescription>Distribution of cryptographic algorithms used in transactions</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={transactionsByAlgorithm}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              layout="vertical"
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={150} />
              <Tooltip />
              <Bar dataKey="value" fill="#9163fa" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default TransactionAnalytics;
