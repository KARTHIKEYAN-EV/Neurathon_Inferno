import { Link } from "react-router-dom";
import { Shield, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <Link to="/" className="flex items-center gap-2">
          <Shield className="h-7 w-7 text-primary" />
          <span className="font-display text-xl font-bold text-foreground tracking-tight">
            JOBNEXIS
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6">
          <a href="#features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Features</a>
          <a href="#how-it-works" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">How It Works</a>
          <a href="#why" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Why JobNexis</a>
        </div>

        <div className="hidden md:flex items-center gap-3">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/login">Sign In</Link>
          </Button>
          <Button size="sm" asChild>
            <Link to="/register">Get Started</Link>
          </Button>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden text-foreground"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-card border-b border-border px-4 pb-4 space-y-3">
          <a href="#features" className="block text-sm font-medium text-muted-foreground">Features</a>
          <a href="#how-it-works" className="block text-sm font-medium text-muted-foreground">How It Works</a>
          <a href="#why" className="block text-sm font-medium text-muted-foreground">Why JobNexis</a>
          <div className="flex gap-2 pt-2">
            <Button variant="outline" size="sm" asChild className="flex-1">
              <Link to="/login">Sign In</Link>
            </Button>
            <Button size="sm" asChild className="flex-1">
              <Link to="/register">Get Started</Link>
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
