import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Shield, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<"student" | "recruiter" | "admin">("student");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Demo navigation based on role
    if (role === "student") navigate("/student");
    else if (role === "recruiter") navigate("/recruiter");
    else navigate("/admin");
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-hero-gradient items-center justify-center p-12">
        <div className="max-w-md space-y-6 text-primary-foreground">
          <div className="flex items-center gap-2">
            <Shield className="h-8 w-8" />
            <span className="font-display text-2xl font-bold">JOBNEXIS</span>
          </div>
          <h2 className="font-display text-4xl font-bold leading-tight">
            Welcome back to your trusted job platform
          </h2>
          <p className="text-primary-foreground/70">
            Sign in to access verified jobs, manage your applications, or review postings.
          </p>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md space-y-8">
          <div className="lg:hidden flex items-center gap-2 justify-center mb-4">
            <Shield className="h-7 w-7 text-primary" />
            <span className="font-display text-xl font-bold text-foreground">JOBNEXIS</span>
          </div>

          <div className="text-center">
            <h1 className="font-display text-2xl font-bold text-foreground">Sign In</h1>
            <p className="text-sm text-muted-foreground mt-1">Choose your role and sign in to continue</p>
          </div>

          <Tabs value={role} onValueChange={(v) => setRole(v as typeof role)} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="student">Student</TabsTrigger>
              <TabsTrigger value="recruiter">Recruiter</TabsTrigger>
              <TabsTrigger value="admin">Admin</TabsTrigger>
            </TabsList>
          </Tabs>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input id="email" type="email" placeholder="you@example.com" className="pl-10" required />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="password">Password</Label>
                <a href="#" className="text-xs text-primary hover:underline">Forgot password?</a>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="pl-10 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button type="submit" className="w-full" size="lg">
              Sign In as {role.charAt(0).toUpperCase() + role.slice(1)}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link to="/register" className="text-primary font-medium hover:underline">Register</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
