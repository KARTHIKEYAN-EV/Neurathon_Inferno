import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { Shield, Search, Filter, MapPin, DollarSign, Briefcase, Flag, ExternalLink, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import StatusBadge from "@/components/StatusBadge";
import { jobAPI, type Job } from "@/lib/api";
const StudentDashboard = () => {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const loadJobs = useCallback(() => {
    const approved = jobAPI.getAllJobs().filter(j => j.status === "approved");
    setJobs(approved);
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
  const filtered = jobs.filter((job) => {
    const matchSearch = job.title.toLowerCase().includes(search.toLowerCase()) || job.company.toLowerCase().includes(search.toLowerCase());
    const matchType = typeFilter === "all" || job.jobType.toLowerCase() === typeFilter;
    return matchSearch && matchType;
  });
  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border sticky top-0 z-40">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            <span className="font-display text-lg font-bold text-foreground">JOBNEXIS</span>
            <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium ml-2">Student</span>
          </div>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/"><LogOut className="h-4 w-4 mr-1" /> Sign Out</Link>
          </Button>
        </div>
      </header>
      <main className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="font-display text-2xl font-bold text-foreground">Find Safe Jobs</h1>
          <p className="text-sm text-muted-foreground">All listings are verified and AI-cleared</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search jobs by title, company..." className="pl-10" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-full sm:w-44">
              <Filter className="h-4 w-4 mr-1" />
              <SelectValue placeholder="Job Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="internship">Internship</SelectItem>
              <SelectItem value="full-time">Full-time</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-3">
            {filtered.map((job) => (
              <button
                key={job.id}
                onClick={() => setSelectedJob(job)}
                className={`w-full text-left bg-card rounded-xl border p-4 hover:shadow-card-hover transition-all ${selectedJob?.id === job.id ? "border-primary shadow-card" : "border-border"}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <h3 className="font-body font-semibold text-foreground">{job.title}</h3>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <Briefcase className="h-3.5 w-3.5" /> {job.company}
                    </p>
                    <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {job.location}</span>
                      <span className="flex items-center gap-1"><DollarSign className="h-3 w-3" /> ₹{job.salaryMin} - ₹{job.salaryMax}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1.5">
                    <StatusBadge type="verified" />
                    <StatusBadge type={job.risk} />
                  </div>
                </div>
              </button>
            ))}
            {filtered.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">No jobs found matching your criteria.</div>
            )}
          </div>
          <div className="bg-card rounded-xl border border-border p-5 h-fit sticky top-20">
            {selectedJob ? (
              <div className="space-y-4">
                <div>
                  <h2 className="font-display text-xl font-bold text-foreground">{selectedJob.title}</h2>
                  <p className="text-sm text-muted-foreground mt-1">{selectedJob.company}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <StatusBadge type="verified" />
                  <StatusBadge type={selectedJob.risk} />
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">
                    <Shield className="h-3 w-3" /> Safe to Apply
                  </span>
                </div>
                <div className="space-y-2 text-sm">
                  <p><strong className="text-foreground">Location:</strong> <span className="text-muted-foreground">{selectedJob.location}</span></p>
                  <p><strong className="text-foreground">Salary:</strong> <span className="text-muted-foreground">₹{selectedJob.salaryMin} - ₹{selectedJob.salaryMax}</span></p>
                  <p><strong className="text-foreground">Type:</strong> <span className="text-muted-foreground">{selectedJob.jobType}</span></p>
                  <p><strong className="text-foreground">Description:</strong> <span className="text-muted-foreground">{selectedJob.description}</span></p>
                </div>
                <p className="text-sm text-muted-foreground">
                  This position has been verified by our team and cleared by AI fraud detection. It is safe to apply.
                </p>
                <div className="flex gap-2">
                  <Button className="flex-1" asChild>
                    <a href={selectedJob.applicationLink} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4 mr-1" /> Apply Now
                    </a>
                  </Button>
                  <Button variant="outline" size="icon">
                    <Flag className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground text-sm">
                <Briefcase className="h-8 w-8 mx-auto mb-2 opacity-40" />
                Select a job to view details
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};
export default StudentDashboard;