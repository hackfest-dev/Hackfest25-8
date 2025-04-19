
import React, { useState, useEffect } from "react";
import { 
  Area, 
  AreaChart, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend 
} from "recharts";
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent 
} from "@/components/ui/chart";

const NetworkSecurityGraph = () => {
  // Sample data for node security over time
  const [data, setData] = useState([
    { name: "Day 1", secure: 80, compromised: 20 },
    { name: "Day 2", secure: 75, compromised: 25 },
    { name: "Day 3", secure: 70, compromised: 30 },
    { name: "Day 4", secure: 65, compromised: 35 },
    { name: "Day 5", secure: 60, compromised: 40 },
    { name: "Day 6", secure: 65, compromised: 35 },
    { name: "Day 7", secure: 70, compromised: 30 },
    { name: "Day 8", secure: 85, compromised: 15 },
    { name: "Day 9", secure: 90, compromised: 10 },
    { name: "Day 10", secure: 95, compromised: 5 },
  ]);

  const chartConfig = {
    secure: {
      label: "Secure Nodes",
      theme: {
        light: "#22c55e",
        dark: "#22c55e",
      },
    },
    compromised: {
      label: "Compromised Nodes",
      theme: {
        light: "#ef4444",
        dark: "#ef4444",
      },
    },
  };

  return (
    <div className="quantum-card rounded-xl p-6">
      <h3 className="text-lg font-medium text-white mb-4">Network Security Status</h3>
      <div className="h-80">
        <ChartContainer config={chartConfig}>
          <AreaChart
            data={data}
            margin={{ top: 20, right: 30, left: 10, bottom: 10 }}
          >
            <defs>
              <linearGradient id="colorSecure" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorCompromised" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis 
              dataKey="name" 
              stroke="#475569" 
              tick={{ fill: "#94a3b8" }} 
              tickLine={false}
            />
            <YAxis
              stroke="#475569"
              tick={{ fill: "#94a3b8" }}
              tickLine={false}
              axisLine={false}
              domain={[0, 100]}
              tickFormatter={(value) => `${value}%`}
            />
            <Tooltip 
              content={<ChartTooltipContent />}
              cursor={{ stroke: "#475569" }}
            />
            <Legend 
              verticalAlign="top" 
              height={36}
            />
            <Area
              type="monotone"
              dataKey="secure"
              stroke="var(--color-secure)"
              fillOpacity={1}
              fill="url(#colorSecure)"
              stackId="1"
              name="secure"
            />
            <Area
              type="monotone"
              dataKey="compromised"
              stroke="var(--color-compromised)"
              fillOpacity={1}
              fill="url(#colorCompromised)"
              stackId="1"
              name="compromised"
            />
          </AreaChart>
        </ChartContainer>
      </div>
    </div>
  );
};

export default NetworkSecurityGraph;
