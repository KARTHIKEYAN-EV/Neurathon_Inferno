import { Shield } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-foreground text-primary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Shield className="h-6 w-6" />
              <span className="font-display text-lg font-bold">JOBNEXIS</span>
            </div>
            <p className="text-sm text-primary-foreground/60">
              Verified Jobs. Zero Scams. Protecting students from fraudulent job postings.
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="font-display text-sm font-semibold">Platform</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/60">
              <li><Link to="/login" className="hover:text-primary-foreground transition-colors">Find Jobs</Link></li>
              <li><Link to="/register" className="hover:text-primary-foreground transition-colors">For Recruiters</Link></li>
              <li><a href="#features" className="hover:text-primary-foreground transition-colors">Features</a></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="font-display text-sm font-semibold">Company</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/60">
              <li><a href="#" className="hover:text-primary-foreground transition-colors">About</a></li>
              <li><a href="#" className="hover:text-primary-foreground transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-primary-foreground transition-colors">Terms & Conditions</a></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="font-display text-sm font-semibold">Contact</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/60">
              <li>support@jobnexis.com</li>
              <li><a href="#" className="hover:text-primary-foreground transition-colors">Help Center</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-primary-foreground/10 mt-8 pt-6 text-center text-sm text-primary-foreground/40">
          © 2026 JobNexis. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
