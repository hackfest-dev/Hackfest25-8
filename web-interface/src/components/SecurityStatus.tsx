
import React from "react";
import { Shield, AlertTriangle } from "lucide-react";

interface SecurityStatusProps {
  status: "secure" | "vulnerable" | "under-attack";
  cryptoType: "classical" | "quantum";
}

const SecurityStatus: React.FC<SecurityStatusProps> = ({ status, cryptoType }) => {
  const getStatusInfo = () => {
    if (status === "secure") {
      return {
        color: "text-green-500",
        bgColor: "bg-green-900/20",
        borderColor: "border-green-700/30",
        icon: Shield,
        label: "Secure",
        description:
          cryptoType === "quantum"
            ? "Protected with quantum-resistant algorithms"
            : "Using standard cryptographic protection",
      };
    } else if (status === "vulnerable") {
      return {
        color: "text-yellow-500",
        bgColor: "bg-yellow-900/20",
        borderColor: "border-yellow-700/30",
        icon: AlertTriangle,
        label: "Vulnerable",
        description:
          cryptoType === "quantum"
            ? "Some quantum vulnerabilities detected"
            : "Vulnerable to quantum attacks",
      };
    } else {
      return {
        color: "text-red-500",
        bgColor: "bg-red-900/20",
        borderColor: "border-red-700/30",
        icon: AlertTriangle,
        label: "Under Attack",
        description:
          cryptoType === "quantum"
            ? "Quantum attack detected, mitigation active"
            : "Active quantum attack in progress",
      };
    }
  };

  const { color, bgColor, borderColor, icon: Icon, label, description } =
    getStatusInfo();

  return (
    <div
      className={`p-4 rounded-lg ${bgColor} border ${borderColor} flex items-center gap-3`}
    >
      <div className={`p-2 rounded-full ${bgColor} ${color}`}>
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <h3 className={`font-medium ${color}`}>{label}</h3>
        <p className="text-sm text-slate-300">{description}</p>
      </div>
    </div>
  );
};

export default SecurityStatus;
