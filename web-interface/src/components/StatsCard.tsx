
import React from "react";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    positive: boolean;
  };
  className?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  description,
  icon: Icon,
  trend,
  className,
}) => {
  return (
    <div className={`quantum-card rounded-xl p-6 ${className}`}>
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-sm font-medium text-slate-400">{title}</h3>
          <div className="mt-1 flex items-baseline gap-2">
            <p className="text-2xl font-semibold text-white">{value}</p>
            {trend && (
              <span
                className={`text-xs font-medium ${
                  trend.positive ? "text-green-500" : "text-red-500"
                }`}
              >
                {trend.positive ? "+" : "-"}
                {trend.value}%
              </span>
            )}
          </div>
          {description && (
            <p className="mt-1 text-xs text-slate-400">{description}</p>
          )}
        </div>
        <div className="p-2 rounded-lg bg-purple-900/30 border border-purple-800/30">
          <Icon className="h-5 w-5 text-purple-400" />
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
