
import React from "react";
import { Search } from "lucide-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useNavigate } from "react-router-dom";

type SearchInputProps = {
  placeholder?: string;
  className?: string;
};

const SearchInput = ({ 
  placeholder = "Search...", 
  className = ""
}: SearchInputProps) => {
  const [open, setOpen] = React.useState(false);
  const navigate = useNavigate();

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const handleSearch = (value: string) => {
    setOpen(false);
    navigate(value);
  };

  return (
    <>
      <div className={`relative ${className}`}>
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
        <input
          type="text"
          placeholder={placeholder}
          className="w-full py-2 pl-10 pr-4 rounded-md bg-slate-800 border border-slate-700 text-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          onClick={() => setOpen(true)}
          readOnly
        />
        <kbd className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none hidden md:inline-flex h-5 select-none items-center gap-1 rounded border border-slate-700 bg-slate-800 px-1.5 font-mono text-xs text-slate-400">
          <span className="text-xs">⌘</span>K
        </kbd>
      </div>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder={placeholder} />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Navigation">
            <CommandItem onSelect={() => handleSearch("/")}>
              Dashboard
            </CommandItem>
            <CommandItem onSelect={() => handleSearch("/blockchain")}>
              Blockchain
            </CommandItem>
            <CommandItem onSelect={() => handleSearch("/transactions")}>
              Transactions
            </CommandItem>
            <CommandItem onSelect={() => handleSearch("/security")}>
              Security
            </CommandItem>
            <CommandItem onSelect={() => handleSearch("/contracts")}>
              Smart Contracts
            </CommandItem>
            <CommandItem onSelect={() => handleSearch("/analytics")}>
              Analytics
            </CommandItem>
          </CommandGroup>
          <CommandGroup heading="Quantum Cryptography">
            <CommandItem onSelect={() => handleSearch("/security")}>
              SPHINCS+ Hash-Based Signatures
            </CommandItem>
            <CommandItem onSelect={() => handleSearch("/security")}>
              Lattice-Based Encryption
            </CommandItem>
            <CommandItem onSelect={() => handleSearch("/blockchain")}>
              Post-Quantum Blockchain
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
};

export default SearchInput;
