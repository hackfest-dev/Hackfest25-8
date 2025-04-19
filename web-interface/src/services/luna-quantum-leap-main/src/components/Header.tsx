
import React from 'react';
import { cn } from '@/lib/utils';
import { ShieldCheck, Shield, Lock, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';
import { useIsMobile } from '@/hooks/use-mobile';

interface HeaderProps {
  className?: string;
}

const Header: React.FC<HeaderProps> = ({ className }) => {
  const isMobile = useIsMobile();
  
  const navigationItems = [
    { name: 'Dashboard', href: '#dashboard' },
    { name: 'Algorithms', href: '#algorithms' },
    { name: 'Key Management', href: '#key-management' },
    { name: 'Code Signing', href: '#code-signing' },
    { name: 'TLS Security', href: '#tls' },
  ];

  return (
    <header className={cn("sticky top-0 z-40 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60", className)}>
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-8 h-8 text-quantum-300" />
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg tracking-tight flex items-center gap-1">
                Thales<span className="text-quantum-400">Luna</span>
                <span className="hidden sm:inline font-normal text-sm text-muted-foreground">PQC Module</span>
              </span>
            </div>
            <span className="text-xs text-muted-foreground hidden sm:block">Quantum-Safe Cryptography Implementation</span>
          </div>
        </div>

        {/* Desktop navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {navigationItems.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {item.name}
            </a>
          ))}
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-1">
              <Lock className="h-4 w-4" />
              <span>API Keys</span>
            </Button>
            <Button size="sm" className="gap-1 bg-quantum-600 hover:bg-quantum-700">
              <Shield className="h-4 w-4" />
              <span>HSM Status</span>
            </Button>
          </div>
        </nav>

        {/* Mobile navigation */}
        {isMobile && (
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent>
              <div className="flex flex-col gap-4 pt-4">
                {navigationItems.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {item.name}
                  </a>
                ))}
                <div className="flex flex-col gap-2 mt-4">
                  <Button variant="outline" size="sm" className="justify-start gap-2">
                    <Lock className="h-4 w-4" />
                    <span>API Keys</span>
                  </Button>
                  <Button size="sm" className="justify-start gap-2 bg-quantum-600 hover:bg-quantum-700">
                    <Shield className="h-4 w-4" />
                    <span>HSM Status</span>
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        )}
      </div>
    </header>
  );
};

export default Header;
