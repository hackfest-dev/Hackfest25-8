
import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Home,
  Database,
  Zap,
  Shield,
  FileText,
  BarChart3,
  BookOpen
} from "lucide-react";

const Sidebar = () => {
  const location = useLocation();
  
  const menuItems = [
    { name: "Dashboard", icon: Home, path: "/" },
    { name: "Blockchain", icon: Database, path: "/blockchain" },
    { name: "Transactions", icon: Zap, path: "/transactions" },
    { name: "Security", icon: Shield, path: "/security" },
    { name: "Smart Contracts", icon: FileText, path: "/contracts" },
    { name: "Analytics", icon: BarChart3, path: "/analytics" },
    { name: "Education", icon: BookOpen, path: "/education" },
  ];

  return (
    <aside className="w-64 hidden md:block bg-slate-900/70 border-r border-slate-800 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider px-3">
            Explorer
          </h2>
          <nav className="space-y-1">
            {menuItems.slice(0, 6).map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2 rounded-md hover:bg-slate-800 hover:text-white transition-colors ${
                  location.pathname === item.path 
                    ? "bg-slate-800 text-white" 
                    : "text-slate-300"
                }`}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>
        </div>

        <div className="space-y-2">
          <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider px-3">
            Resources
          </h2>
          <nav className="space-y-1">
            {menuItems.slice(6).map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2 rounded-md hover:bg-slate-800 hover:text-white transition-colors ${
                  location.pathname === item.path 
                    ? "bg-slate-800 text-white" 
                    : "text-slate-300"
                }`}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>
        </div>

        <div className="p-4 rounded-lg bg-gradient-to-br from-purple-900/40 to-blue-900/40 border border-purple-700/30">
          <h3 className="font-medium text-white mb-1">Quantum Protection</h3>
          <p className="text-sm text-slate-300 mb-3">
            Your network is secured with SPHINCS+ and lattice-based cryptography
          </p>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-green-500 animate-quantum-pulse"></div>
            <span className="text-xs text-green-400">Active Protection</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
