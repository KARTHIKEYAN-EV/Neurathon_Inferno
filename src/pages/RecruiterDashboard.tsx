import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { Shield, Plus, LogOut, Briefcase, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import StatusBadge from "@/components/StatusBadge";
import JobPostingForm from "@/components/JobPostingForm";
import { jobAPI, type Job } from "@/lib/api";

const DEMO_COMPANY = "TechCorp";

const RecruiterDashboard = () => {
  const isVerified = true;
  const [showPostForm, setShowPostForm] = useState(false);
  const [jobs, setJobs] = useState<Job[]>([]);

  const loadJobs = useCallback(() => {
    const allJobs = jobAPI.getAllJobs().filter(j => j.company === DEMO_COMPANY);
    setJobs(allJobs);
  }, []);

  useEffect(() => {
    loadJobs();
    const handler = () => loadJobs();
    window.addEventListener("jobnexis-sync", handler);
    const interval = setInterval(loadJobs, 2000);
    return () => {
      window.removeEventListener("jobnexis-sync", handler);
      clearInterval(interval);
    };
  }, [loadJobs]);

  const handleJobSubmitted = (job: any) => {
    jobAPI.addJob({
      title: job.title,
      description: job.description,
      location: job.location,
      salaryMin: job.salaryMin,
      salaryMax: job.salaryMax,
      jobType: job.jobType,
      applicationLink: job.applicationLink,
      company: DEMO_COMPANY,
      risk: job.risk || "low",
      flags: job.flags || [],
      status: job.risk === "high" ? "banned" : "pending",
    });
    loadJobs();
  };

  const getStatusBadgeType = (status: Job["status"]) => {
    if (status === "approved") return "verified";
    if (status === "rejected" || status === "banned") return "rejected";
    return "pending";
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border sticky top-0 z-40">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            <span className="font-display text-lg font-bold text-foreground">JOBNEXIS</span>
            <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium ml-2">Recruiter</span>
          </div>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/"><LogOut className="h-4 w-4 mr-1" /> Sign Out</Link>
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 space-y-6">
        <div className={`rounded-xl p-4 border ${isVerified ? "bg-success/5 border-success/20" : "bg-warning/5 border-warning/20"}`}>
          <div className="flex items-center gap-3">
            <StatusBadge type={isVerified ? "verified" : "pending"} />
            <span className="text-sm text-foreground font-medium">
              {isVerified ? "Your account is verified. You can post jobs." : "Your account is pending verification."}
            </span>
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
                {jobs.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-muted-foreground">
                      <Briefcase className="h-12 w-12 mx-auto mb-4 opacity-20" />
                      <p className="text-lg font-medium">No jobs posted yet</p>
                      <p className="text-sm">Click "Post New Job" to get started.</p>
                    </td>
                  </tr>
                ) : (
                  jobs.map((job) => (
                    <tr key={job.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <Briefcase className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium text-sm text-foreground">{job.title}</span>
                        </div>
                      </td>
                      <td className="p-3">
                        <StatusBadge type={getStatusBadgeType(job.status)} />
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
                  ))
                )}
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
