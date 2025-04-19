
import React from "react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const SecurityMetrics: React.FC = () => {
  const classicalData = [
    { name: "Jan", value: 80 },
    { name: "Feb", value: 75 },
    { name: "Mar", value: 78 },
    { name: "Apr", value: 70 },
    { name: "May", value: 65 },
    { name: "Jun", value: 60 },
    { name: "Jul", value: 50 },
    { name: "Aug", value: 40 },
    { name: "Sep", value: 30 },
    { name: "Oct", value: 20 },
    { name: "Nov", value: 15 },
    { name: "Dec", value: 10 },
  ];

  const quantumData = [
    { name: "Jan", value: 85 },
    { name: "Feb", value: 85 },
    { name: "Mar", value: 88 },
    { name: "Apr", value: 87 },
    { name: "May", value: 90 },
    { name: "Jun", value: 89 },
    { name: "Jul", value: 92 },
    { name: "Aug", value: 91 },
    { name: "Sep", value: 93 },
    { name: "Oct", value: 94 },
    { name: "Nov", value: 95 },
    { name: "Dec", value: 95 },
  ];

  return (
    <div className="quantum-card rounded-xl p-6">
      <h3 className="text-lg font-medium text-white mb-6">
        Security Strength Over Time (Against Quantum Attacks)
      </h3>
      
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={classicalData}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorClassical" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorQuantum" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
              </linearGradient>
            </defs>
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
              domain={[0, 100]}
              label={{
                value: "Security Strength (%)",
                angle: -90,
                position: "insideLeft",
                fill: "#94a3b8",
                style: { textAnchor: "middle" },
              }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1e293b",
                borderColor: "#334155",
                borderRadius: "0.375rem",
                color: "#e2e8f0",
              }}
            />
            <Area
              type="monotone"
              dataKey="value"
              name="Classical Cryptography"
              stroke="#ef4444"
              fillOpacity={1}
              fill="url(#colorClassical)"
            />
            <Area
              type="monotone"
              dataKey="value"
              data={quantumData}
              name="Quantum-Safe Cryptography"
              stroke="#7c3aed"
              fillOpacity={1}
              fill="url(#colorQuantum)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-4 flex items-center justify-center space-x-6">
        <div className="flex items-center">
          <div className="h-3 w-3 rounded-full bg-red-500 mr-2"></div>
          <span className="text-sm text-slate-300">Classical Cryptography</span>
        </div>
        <div className="flex items-center">
          <div className="h-3 w-3 rounded-full bg-purple-500 mr-2"></div>
          <span className="text-sm text-slate-300">Quantum-Safe Cryptography</span>
        </div>
      </div>
    </div>
  );
};

export default SecurityMetrics;
