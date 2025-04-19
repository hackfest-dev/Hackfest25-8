
import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent 
} from "@/components/ui/chart";

interface SecurityRiskPieProps {
  quantumSafe: number;
  vulnerable: number;
}

const SecurityRiskPie: React.FC<SecurityRiskPieProps> = ({ quantumSafe, vulnerable }) => {
  const data = [
    { name: "Quantum-Safe", value: quantumSafe, color: "#7c3aed" },
    { name: "Vulnerable", value: vulnerable, color: "#ef4444" },
  ];

  const chartConfig = {
    "Quantum-Safe": {
      label: "Quantum-Safe",
      theme: {
        light: "#7c3aed",
        dark: "#7c3aed",
      },
    },
    "Vulnerable": {
      label: "Vulnerable",
      theme: {
        light: "#ef4444",
        dark: "#ef4444",
      },
    },
  };

  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        fontSize="smaller"
        fontWeight="bold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="quantum-card rounded-xl p-6">
      <h3 className="text-lg font-medium text-white mb-4">Security Risk Assessment</h3>
      <div className="h-80">
        <ChartContainer config={chartConfig}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomizedLabel}
              outerRadius={120}
              fill="#8884d8"
              dataKey="value"
              nameKey="name"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<ChartTooltipContent />} />
            <Legend verticalAlign="bottom" height={36} />
          </PieChart>
        </ChartContainer>
      </div>
    </div>
  );
};

export default SecurityRiskPie;
