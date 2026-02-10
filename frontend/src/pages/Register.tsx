// frontend/src/pages/Register.tsx - COMPLETE CORRECTED FILE
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Shield, User, Mail, Lock, Phone, GraduationCap, BookOpen, Calendar, Eye, EyeOff, FileText, Building2, Briefcase, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { collection, addDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

type Role = "student" | "recruiter";

const Register = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState<Role | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const [studentForm, setStudentForm] = useState({
    name: "", email: "", phone: "", password: "",
    college: "", degree: "", graduationYear: "",
  });

  const [recruiterForm, setRecruiterForm] = useState({
    name: "", email: "", phone: "", password: "",
    company: "", designation: "", companyWebsite: "",
  });

  const updateStudent = (field: string, value: string) =>
    setStudentForm(f => ({ ...f, [field]: value }));

  const updateRecruiter = (field: string, value: string) =>
    setRecruiterForm(f => ({ ...f, [field]: value }));

  const handleStudentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Create Firebase auth user
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        studentForm.email,
        studentForm.password
      );

      const user = userCredential.user;

      // 2. Save student data to Firestore
      await addDoc(collection(db, "users"), {
        uid: user.uid,
        email: user.email,
        role: "student",
        name: studentForm.name,
        phone: studentForm.phone,
        college: studentForm.college,
        degree: studentForm.degree,
        graduationYear: studentForm.graduationYear,
        createdAt: new Date(),
        profileComplete: false
      });

      // 3. Success toast
      toast({
        title: "Account created!",
        description: "Welcome to JobNexis as a student.",
      });

      // 4. Redirect to student dashboard
      navigate("/student");

    } catch (error: any) {
      toast({
        title: "Registration failed",
        description: error.message || "Please try again",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRecruiterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Create Firebase auth user
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        recruiterForm.email,
        recruiterForm.password
      );

      const user = userCredential.user;

      // 2. Save recruiter data to Firestore
      await addDoc(collection(db, "users"), {
        uid: user.uid,
        email: user.email,
        role: "recruiter",
        name: recruiterForm.name,
        phone: recruiterForm.phone,
        company: recruiterForm.company,
        designation: recruiterForm.designation,
        companyWebsite: recruiterForm.companyWebsite,
        createdAt: new Date(),
        profileComplete: false
      });

      // 3. Success toast
      toast({
        title: "Account created!",
        description: "Welcome to JobNexis as a recruiter.",
      });

      // 4. Redirect to recruiter dashboard
      navigate("/recruiter");

    } catch (error: any) {
      toast({
        title: "Registration failed",
        description: error.message || "Please try again",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Role selection screen
  if (!role) {
    return (
      <div className="min-h-screen bg-background flex">
        <div className="hidden lg:flex lg:w-1/2 bg-hero-gradient items-center justify-center p-12">
          <div className="max-w-md space-y-6 text-primary-foreground">
            <div className="flex items-center gap-2">
              <Shield className="h-8 w-8" />
              <span className="font-display text-2xl font-bold">JOBNEXIS</span>
            </div>
            <h2 className="font-display text-4xl font-bold leading-tight">Join JobNexis today</h2>
            <p className="opacity-70">Choose your role to get started with the right experience.</p>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="w-full max-w-md space-y-8">
            <div className="lg:hidden flex items-center gap-2 justify-center mb-4">
              <Shield className="h-7 w-7 text-primary" />
              <span className="font-display text-xl font-bold text-foreground">JOBNEXIS</span>
            </div>
            <div className="text-center">
              <h1 className="font-display text-2xl font-bold text-foreground">I am a...</h1>
              <p className="text-sm text-muted-foreground mt-1">Select your role to continue</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setRole("student")}
                className="flex flex-col items-center gap-3 p-6 rounded-xl border-2 border-border bg-card hover:border-primary hover:bg-primary/5 transition-all"
              >
                <GraduationCap className="h-10 w-10 text-primary" />
                <span className="font-display font-semibold text-foreground">Student</span>
                <span className="text-xs text-muted-foreground text-center">Find verified, safe job opportunities</span>
              </button>
              <button
                onClick={() => setRole("recruiter")}
                className="flex flex-col items-center gap-3 p-6 rounded-xl border-2 border-border bg-card hover:border-primary hover:bg-primary/5 transition-all"
              >
                <Building2 className="h-10 w-10 text-primary" />
                <span className="font-display font-semibold text-foreground">Recruiter</span>
                <span className="text-xs text-muted-foreground text-center">Post jobs and find top talent</span>
              </button>
            </div>
            <p className="text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link to="/login" className="text-primary font-medium hover:underline">Sign In</Link>
            </p>
          </div>
        </div>
      </div>
    );
  }

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
            {role === "student" ? "Create your account and start finding safe jobs" : "Start hiring top talent today"}
          </h2>
          <p className="opacity-70">
            {role === "student"
              ? "Your profile details help recruiters find you. You can always edit them later."
              : "Set up your recruiter profile to post verified job listings."}
          </p>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6 overflow-y-auto">
        <div className="w-full max-w-lg space-y-6 py-8">
          <div className="lg:hidden flex items-center gap-2 justify-center mb-4">
            <Shield className="h-7 w-7 text-primary" />
            <span className="font-display text-xl font-bold text-foreground">JOBNEXIS</span>
          </div>

          <div className="flex items-center gap-2">
            <button onClick={() => setRole(null)} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              ← Change role
            </button>
          </div>

          <div className="text-center">
            <h1 className="font-display text-2xl font-bold text-foreground">
              {role === "student" ? "Student Registration" : "Recruiter Registration"}
            </h1>
            <p className="text-sm text-muted-foreground mt-1">Fill in your details to get started</p>
          </div>

          {role === "student" ? (
            <form onSubmit={handleStudentSubmit} className="space-y-4">
              {/* Personal */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-foreground">Personal Information</h3>
                <div className="grid sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="name">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input id="name" className="pl-10" placeholder="John Doe" value={studentForm.name} onChange={e => updateStudent("name", e.target.value)} required />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="phone">Phone</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input id="phone" className="pl-10" placeholder="+91 9876543210" value={studentForm.phone} onChange={e => updateStudent("phone", e.target.value)} required />
                    </div>
                  </div>
                </div>
              </div>

              {/* Account */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-foreground">Account</h3>
                <div className="space-y-1.5">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input id="email" type="email" className="pl-10" placeholder="you@example.com" value={studentForm.email} onChange={e => updateStudent("email", e.target.value)} required />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input id="password" type={showPassword ? "text" : "password"} className="pl-10 pr-10" placeholder="••••••••" value={studentForm.password} onChange={e => updateStudent("password", e.target.value)} required minLength={6} />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Education */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-foreground">Education</h3>
                <div className="grid sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="college">College</Label>
                    <div className="relative">
                      <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input id="college" className="pl-10" placeholder="IIT Delhi" value={studentForm.college} onChange={e => updateStudent("college", e.target.value)} required />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="degree">Degree</Label>
                    <div className="relative">
                      <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input id="degree" className="pl-10" placeholder="B.Tech CS" value={studentForm.degree} onChange={e => updateStudent("degree", e.target.value)} required />
                    </div>
                  </div>
                </div>
                <div className="w-1/2 space-y-1.5">
                  <Label htmlFor="gradYear">Graduation Year</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input id="gradYear" className="pl-10" placeholder="2026" value={studentForm.graduationYear} onChange={e => updateStudent("graduationYear", e.target.value)} required />
                  </div>
                </div>
              </div>

              {/* Resume */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-foreground">Resume</h3>
                <div className="space-y-1.5">
                  <Label htmlFor="resume">Upload Resume (PDF)</Label>
                  <div className="relative">
                    <FileText className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input id="resume" type="file" accept=".pdf,.doc,.docx" className="pl-10" onChange={e => setResumeFile(e.target.files?.[0] || null)} />
                  </div>
                  {resumeFile && <p className="text-xs text-muted-foreground">Selected: {resumeFile.name}</p>}
                </div>
              </div>

              <Button
                type="submit"
                className="w-full"
                size="lg"
                disabled={loading}
              >
                {loading ? "Creating account..." : "Create Student Account"}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleRecruiterSubmit} className="space-y-4">
              {/* Personal */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-foreground">Personal Information</h3>
                <div className="grid sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="r-name">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input id="r-name" className="pl-10" placeholder="Jane Smith" value={recruiterForm.name} onChange={e => updateRecruiter("name", e.target.value)} required />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="r-phone">Phone</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input id="r-phone" className="pl-10" placeholder="+91 9876543210" value={recruiterForm.phone} onChange={e => updateRecruiter("phone", e.target.value)} required />
                    </div>
                  </div>
                </div>
              </div>

              {/* Account */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-foreground">Account</h3>
                <div className="space-y-1.5">
                  <Label htmlFor="r-email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input id="r-email" type="email" className="pl-10" placeholder="you@company.com" value={recruiterForm.email} onChange={e => updateRecruiter("email", e.target.value)} required />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="r-password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input id="r-password" type={showPassword ? "text" : "password"} className="pl-10 pr-10" placeholder="••••••••" value={recruiterForm.password} onChange={e => updateRecruiter("password", e.target.value)} required minLength={6} />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Company */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-foreground">Company Details</h3>
                <div className="grid sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="company">Company Name</Label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input id="company" className="pl-10" placeholder="TechCorp" value={recruiterForm.company} onChange={e => updateRecruiter("company", e.target.value)} required />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="designation">Designation</Label>
                    <div className="relative">
                      <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input id="designation" className="pl-10" placeholder="HR Manager" value={recruiterForm.designation} onChange={e => updateRecruiter("designation", e.target.value)} required />
                    </div>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="companyWebsite">Company Website</Label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input id="companyWebsite" className="pl-10" placeholder="https://techcorp.com" value={recruiterForm.companyWebsite} onChange={e => updateRecruiter("companyWebsite", e.target.value)} />
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full"
                size="lg"
                disabled={loading}
              >
                {loading ? "Creating account..." : "Create Recruiter Account"}
              </Button>
            </form>
          )}

          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="text-primary font-medium hover:underline">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;