import { useState } from "react";
import { Link } from "react-router-dom";
import { Shield, Plus, LogOut, Briefcase, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import StatusBadge from "@/components/StatusBadge";
import JobPostingForm from "@/components/JobPostingForm";

type JobEntry = {
  id: number;
  title: string;
  status: "Approved" | "Pending Review" | "Rejected";
  risk: "low" | "medium" | "high";
};

const initialJobs: JobEntry[] = [
  { id: 1, title: "Frontend Developer Intern", status: "Approved", risk: "low" },
  { id: 2, title: "Backend Engineer", status: "Pending Review", risk: "low" },
  { id: 3, title: "Marketing Associate", status: "Rejected", risk: "medium" },
];

const RecruiterDashboard = () => {
  const isVerified = true; // demo
  const [showPostForm, setShowPostForm] = useState(false);
  const [jobs, setJobs] = useState(initialJobs);

  const handleJobSubmitted = (job: any) => {
    setJobs((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        title: job.title,
        status: job.risk === "high" ? "Rejected" as const : "Pending Review" as const,
        risk: job.risk as "low" | "medium" | "high",
      },
    ]);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border sticky top-0 z-40">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            <span className="font-display text-lg font-bold text-foreground">JOBNEXIS</span>
            <span className="text-xs bg-accent/10 text-accent px-2 py-0.5 rounded-full font-medium ml-2">Recruiter</span>
          </div>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/"><LogOut className="h-4 w-4 mr-1" /> Sign Out</Link>
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Verification banner */}
        <div className={`rounded-xl p-4 border ${isVerified ? "bg-success/5 border-success/20" : "bg-warning/5 border-warning/20"}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <StatusBadge type={isVerified ? "verified" : "pending"} />
              <span className="text-sm text-foreground font-medium">
                {isVerified ? "Your account is verified. You can post jobs." : "Your account is pending verification. You cannot post jobs yet."}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold text-foreground">Your Job Postings</h1>
            <p className="text-sm text-muted-foreground">Manage and track your posted jobs</p>
          </div>
          <Button disabled={!isVerified} onClick={() => setShowPostForm(true)}>
            <Plus className="h-4 w-4 mr-1" /> Post New Job
          </Button>
        </div>

        {/* Jobs table */}
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="text-left p-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Job Title</th>
                  <th className="text-left p-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Status</th>
                  <th className="text-left p-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">AI Risk</th>
                  <th className="text-right p-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Actions</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map((job) => (
                  <tr key={job.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <Briefcase className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium text-sm text-foreground">{job.title}</span>
                      </div>
                    </td>
                    <td className="p-3">
                      <StatusBadge type={job.status === "Approved" ? "verified" : job.status === "Rejected" ? "rejected" : "pending"} />
                    </td>
                    <td className="p-3">
                      <StatusBadge type={job.risk} />
                    </td>
                    <td className="p-3 text-right">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      <JobPostingForm open={showPostForm} onOpenChange={setShowPostForm} onJobSubmitted={handleJobSubmitted} />
    </div>
  );
};

export default RecruiterDashboard;
