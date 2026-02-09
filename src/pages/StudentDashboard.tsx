import { useState } from "react";
import { Link } from "react-router-dom";
import { Shield, Search, Filter, MapPin, DollarSign, Briefcase, Flag, ExternalLink, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import StatusBadge from "@/components/StatusBadge";

const mockJobs = [
  { id: 1, title: "Frontend Developer Intern", company: "TechCorp", location: "Remote", salary: "₹15,000/mo", type: "Internship", domain: "Technology", risk: "low" as const },
  { id: 2, title: "Data Analyst", company: "AnalyticsPro", location: "Bangalore", salary: "₹6,00,000/yr", type: "Full-time", domain: "Data Science", risk: "low" as const },
  { id: 3, title: "UI/UX Designer", company: "DesignStudio", location: "Mumbai", salary: "₹4,50,000/yr", type: "Full-time", domain: "Design", risk: "low" as const },
  { id: 4, title: "Marketing Intern", company: "BrandWorks", location: "Remote", salary: "₹10,000/mo", type: "Internship", domain: "Marketing", risk: "low" as const },
  { id: 5, title: "Backend Engineer", company: "CloudBase", location: "Hyderabad", salary: "₹8,00,000/yr", type: "Full-time", domain: "Technology", risk: "low" as const },
  { id: 6, title: "Content Writer Intern", company: "MediaHub", location: "Remote", salary: "₹8,000/mo", type: "Internship", domain: "Content", risk: "low" as const },
];

const StudentDashboard = () => {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [selectedJob, setSelectedJob] = useState<typeof mockJobs[0] | null>(null);

  const filtered = mockJobs.filter((job) => {
    const matchSearch = job.title.toLowerCase().includes(search.toLowerCase()) || job.company.toLowerCase().includes(search.toLowerCase());
    const matchType = typeFilter === "all" || job.type.toLowerCase() === typeFilter;
    return matchSearch && matchType;
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
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

        {/* Search & Filters */}
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
          {/* Job list */}
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
                      <span className="flex items-center gap-1"><DollarSign className="h-3 w-3" /> {job.salary}</span>
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

          {/* Job detail panel */}
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
                  <p><strong className="text-foreground">Salary:</strong> <span className="text-muted-foreground">{selectedJob.salary}</span></p>
                  <p><strong className="text-foreground">Type:</strong> <span className="text-muted-foreground">{selectedJob.type}</span></p>
                  <p><strong className="text-foreground">Domain:</strong> <span className="text-muted-foreground">{selectedJob.domain}</span></p>
                </div>
                <p className="text-sm text-muted-foreground">
                  This position has been verified by our team and cleared by AI fraud detection. It is safe to apply.
                </p>
                <div className="flex gap-2">
                  <Button className="flex-1">
                    <ExternalLink className="h-4 w-4 mr-1" /> Apply Now
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
