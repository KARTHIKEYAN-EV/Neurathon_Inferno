import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Briefcase, MapPin, DollarSign, Link2, FileText, Loader2, ShieldCheck, ShieldAlert, ShieldX, CheckCircle, ArrowRight, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

type RiskLevel = "low" | "medium" | "high" | null;
type Step = "form" | "scanning" | "result";

interface JobFormData {
  title: string;
  description: string;
  location: string;
  salaryMin: string;
  salaryMax: string;
  jobType: string;
  applicationLink: string;
}

const SUSPICIOUS_PATTERNS = [
  { pattern: /pay.*fee|registration.*fee|advance.*payment/i, label: "Payment request detected" },
  { pattern: /guaranteed.*job|100%.*placement|assured.*offer/i, label: "Guaranteed job claim" },
  { pattern: /earn.*\$?\d{4,}.*day|unlimited.*income|get.*rich/i, label: "Unrealistic salary promise" },
  { pattern: /no.*experience.*needed.*high.*salary|work.*from.*home.*\$\d{4,}/i, label: "Misleading language" },
];

function simulateAIScan(description: string): { risk: RiskLevel; flags: string[] } {
  const flags: string[] = [];
  SUSPICIOUS_PATTERNS.forEach(({ pattern, label }) => {
    if (pattern.test(description)) flags.push(label);
  });

  if (flags.length === 0 && description.length > 30) return { risk: "low", flags: [] };
  if (flags.length === 1) return { risk: "medium", flags };
  if (flags.length >= 2) return { risk: "high", flags };
  return { risk: "low", flags: [] };
}

const riskConfig = {
  low: { icon: ShieldCheck, label: "Low Risk", color: "text-success", bg: "bg-success/10 border-success/20", message: "This job posting appears safe. It will be submitted for admin approval." },
  medium: { icon: ShieldAlert, label: "Medium Risk", color: "text-warning", bg: "bg-warning/10 border-warning/20", message: "Some concerns detected. This job will require manual admin review before approval." },
  high: { icon: ShieldX, label: "High Risk", color: "text-destructive", bg: "bg-destructive/10 border-destructive/20", message: "Multiple red flags detected. This job has been auto-blocked and flagged for admin review." },
};

interface JobPostingFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onJobSubmitted?: (job: JobFormData & { risk: RiskLevel; flags: string[] }) => void;
}

const JobPostingForm = ({ open, onOpenChange, onJobSubmitted }: JobPostingFormProps) => {
  const { toast } = useToast();
  const [step, setStep] = useState<Step>("form");
  const [riskLevel, setRiskLevel] = useState<RiskLevel>(null);
  const [flags, setFlags] = useState<string[]>([]);
  const [formData, setFormData] = useState<JobFormData>({
    title: "",
    description: "",
    location: "",
    salaryMin: "",
    salaryMax: "",
    jobType: "",
    applicationLink: "",
  });

  const resetForm = () => {
    setStep("form");
    setRiskLevel(null);
    setFlags([]);
    setFormData({ title: "", description: "", location: "", salaryMin: "", salaryMax: "", jobType: "", applicationLink: "" });
  };

  const handleClose = (val: boolean) => {
    if (!val) resetForm();
    onOpenChange(val);
  };

  const handleScan = () => {
    if (!formData.title.trim() || !formData.description.trim() || !formData.location.trim() || !formData.jobType) {
      toast({ title: "Missing fields", description: "Please fill in all required fields.", variant: "destructive" });
      return;
    }
    setStep("scanning");
    setTimeout(() => {
      const result = simulateAIScan(formData.description);
      setRiskLevel(result.risk);
      setFlags(result.flags);
      setStep("result");
    }, 2500);
  };

  const handleSubmit = () => {
    onJobSubmitted?.({ ...formData, risk: riskLevel, flags });
    toast({
      title: riskLevel === "high" ? "Job Auto-Blocked" : "Job Submitted",
      description: riskLevel === "high"
        ? "This posting was flagged and sent to admin for review."
        : "Your job posting has been submitted for admin approval.",
    });
    handleClose(false);
  };

  const updateField = (field: keyof JobFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const RiskIcon = riskLevel ? riskConfig[riskLevel].icon : ShieldCheck;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">
            {step === "form" && "Post a New Job"}
            {step === "scanning" && "AI Fraud Scan"}
            {step === "result" && "Scan Results"}
          </DialogTitle>
        </DialogHeader>

        <AnimatePresence mode="wait">
          {step === "form" && (
            <motion.div key="form" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-4 py-2">
              <div className="space-y-2">
                <Label htmlFor="title" className="flex items-center gap-1.5"><Briefcase className="h-3.5 w-3.5" /> Job Title *</Label>
                <Input id="title" placeholder="e.g. Frontend Developer Intern" value={formData.title} onChange={(e) => updateField("title", e.target.value)} maxLength={100} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="flex items-center gap-1.5"><FileText className="h-3.5 w-3.5" /> Job Description *</Label>
                <Textarea id="description" placeholder="Describe the role, responsibilities, and requirements…" className="min-h-[120px]" value={formData.description} onChange={(e) => updateField("description", e.target.value)} maxLength={3000} />
                <p className="text-xs text-muted-foreground">This will be scanned by AI for fraud detection.</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="location" className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" /> Location *</Label>
                  <Input id="location" placeholder="e.g. Remote, Bangalore" value={formData.location} onChange={(e) => updateField("location", e.target.value)} maxLength={100} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="jobType">Job Type *</Label>
                  <Select value={formData.jobType} onValueChange={(v) => updateField("jobType", v)}>
                    <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="internship">Internship</SelectItem>
                      <SelectItem value="full-time">Full-time</SelectItem>
                      <SelectItem value="part-time">Part-time</SelectItem>
                      <SelectItem value="contract">Contract</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="salaryMin" className="flex items-center gap-1.5"><DollarSign className="h-3.5 w-3.5" /> Min Salary</Label>
                  <Input id="salaryMin" type="number" placeholder="e.g. 20000" value={formData.salaryMin} onChange={(e) => updateField("salaryMin", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="salaryMax">Max Salary</Label>
                  <Input id="salaryMax" type="number" placeholder="e.g. 50000" value={formData.salaryMax} onChange={(e) => updateField("salaryMax", e.target.value)} />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="appLink" className="flex items-center gap-1.5"><Link2 className="h-3.5 w-3.5" /> Application Link</Label>
                <Input id="appLink" type="url" placeholder="https://..." value={formData.applicationLink} onChange={(e) => updateField("applicationLink", e.target.value)} maxLength={500} />
              </div>

              <Button onClick={handleScan} className="w-full mt-2">
                Submit for AI Scan <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </motion.div>
          )}

          {step === "scanning" && (
            <motion.div key="scanning" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center py-12 space-y-4">
              <div className="relative">
                <Loader2 className="h-12 w-12 text-primary animate-spin" />
                <ShieldCheck className="h-5 w-5 text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
              </div>
              <div className="text-center">
                <p className="font-display text-lg font-semibold text-foreground">Scanning Job Posting…</p>
                <p className="text-sm text-muted-foreground mt-1">Our AI is analyzing the description for potential fraud indicators.</p>
              </div>
            </motion.div>
          )}

          {step === "result" && riskLevel && (
            <motion.div key="result" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4 py-2">
              <div className={`rounded-xl border p-5 ${riskConfig[riskLevel].bg}`}>
                <div className="flex items-center gap-3 mb-3">
                  <RiskIcon className={`h-8 w-8 ${riskConfig[riskLevel].color}`} />
                  <div>
                    <p className={`font-display text-lg font-bold ${riskConfig[riskLevel].color}`}>{riskConfig[riskLevel].label}</p>
                    <p className="text-sm text-muted-foreground">{riskConfig[riskLevel].message}</p>
                  </div>
                </div>

                {flags.length > 0 && (
                  <div className="mt-3 space-y-1.5">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Flagged Issues</p>
                    {flags.map((f, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm text-foreground">
                        <ShieldAlert className="h-3.5 w-3.5 text-warning shrink-0" />
                        {f}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="rounded-lg border border-border bg-muted/30 p-4">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Posting Summary</p>
                <div className="grid grid-cols-2 gap-y-1.5 text-sm">
                  <span className="text-muted-foreground">Title</span>
                  <span className="font-medium text-foreground">{formData.title}</span>
                  <span className="text-muted-foreground">Location</span>
                  <span className="font-medium text-foreground">{formData.location}</span>
                  <span className="text-muted-foreground">Type</span>
                  <span className="font-medium text-foreground capitalize">{formData.jobType}</span>
                  {formData.salaryMin && (
                    <>
                      <span className="text-muted-foreground">Salary</span>
                      <span className="font-medium text-foreground">₹{formData.salaryMin}{formData.salaryMax && ` – ₹${formData.salaryMax}`}</span>
                    </>
                  )}
                </div>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setStep("form")} className="flex-1">
                  <ArrowLeft className="h-4 w-4 mr-1" /> Edit
                </Button>
                <Button onClick={handleSubmit} className="flex-1" disabled={riskLevel === "high"}>
                  <CheckCircle className="h-4 w-4 mr-1" />
                  {riskLevel === "high" ? "Auto-Blocked" : "Submit for Approval"}
                </Button>
              </div>

              {riskLevel === "high" && (
                <p className="text-xs text-center text-muted-foreground">High-risk postings are automatically blocked. An admin has been notified.</p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
};

export default JobPostingForm;
