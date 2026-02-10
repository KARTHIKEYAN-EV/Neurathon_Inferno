// frontend/src/pages/StudentDashboard.tsx - FIXED
import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { Shield, Search, Filter, MapPin, DollarSign, Briefcase, Flag, ExternalLink, LogOut, User, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import StatusBadge from "@/components/StatusBadge";
import { getAllJobs, applyForJob } from "@/lib/jobService";
import { auth } from "@/lib/firebase";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";

// Combined type that accepts both Job and FirebaseJob
interface DashboardJob {
  id: string;
  title?: string;
  companyName?: string;
  company?: string;
  location: string;
  salaryMin?: number;
  salaryMax?: number;
  stipendMin?: number;
  stipendMax?: number;
  stipend?: number;
  description: string;
  type?: string;
  jobType?: string;
  duration?: string;
  isVerified?: boolean;
  isActive?: boolean;
  riskLevel?: string;
  risk?: string;
  postedAt?: string; // Make optional
  postedDate?: Date; // Add postedDate for Job type
  applicationDeadline?: string;
  recruiterName?: string;
  companyId?: string;
  applicationsCount?: number;
  scamScore?: number;
  skillsRequired?: string[];
}

type StatusBadgeType = "high" | "low" | "medium" | "verified" | "pending" | "rejected";

const StudentDashboard = () => {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [selectedJob, setSelectedJob] = useState<DashboardJob | null>(null);
  const [jobs, setJobs] = useState<DashboardJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [appliedJobs, setAppliedJobs] = useState<string[]>([]);
  const { user } = useAuth();

  const loadJobs = useCallback(async () => {
    try {
      const fetchedJobs = await getAllJobs();

      // Transform the data to match DashboardJob
      const transformedJobs: DashboardJob[] = fetchedJobs.map((job: any) => ({
        id: job.id,
        title: job.title,
        companyName: job.companyName || job.company,
        company: job.company || job.companyName,
        location: job.location || 'Remote',
        salaryMin: job.salaryMin,
        salaryMax: job.salaryMax,
        stipendMin: job.stipendMin,
        stipendMax: job.stipendMax,
        stipend: job.stipend,
        description: job.description || '',
        type: job.type || job.jobType,
        jobType: job.jobType || job.type,
        duration: job.duration,
        isVerified: job.isVerified,
        isActive: job.isActive !== false, // Default to true if not specified
        riskLevel: job.riskLevel || job.risk,
        risk: job.risk || job.riskLevel,
        postedAt: job.postedAt || job.postedDate?.toISOString?.() || new Date().toISOString(),
        postedDate: job.postedDate,
        applicationDeadline: job.applicationDeadline,
        recruiterName: job.recruiterName,
        companyId: job.companyId,
        applicationsCount: job.applicationsCount,
        scamScore: job.scamScore,
        skillsRequired: job.skillsRequired || job.requirements || [],
      }));

      setJobs(transformedJobs);
    } catch (error) {
      console.error("Error loading jobs:", error);
      toast({
        title: "Error loading jobs",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadJobs();
  }, [loadJobs]);

  const getRiskLevel = (job: DashboardJob): StatusBadgeType => {
    // First check for explicit risk level
    const risk = job.riskLevel || job.risk;
    if (risk) {
      const lowerRisk = risk.toLowerCase();
      if (['low', 'medium', 'high', 'verified', 'pending', 'rejected'].includes(lowerRisk)) {
        return lowerRisk as StatusBadgeType;
      }
    }

    // Check scam score
    if (job.scamScore !== undefined) {
      if (job.scamScore < 0.3) return 'low';
      if (job.scamScore < 0.7) return 'medium';
      return 'high';
    }

    // Default
    return 'medium';
  };

  const filtered = jobs.filter((job) => {
    const company = job.companyName || job.company || "";
    const title = job.title || "";
    const jobType = job.type || job.jobType || "";

    const matchSearch =
      title.toLowerCase().includes(search.toLowerCase()) ||
      company.toLowerCase().includes(search.toLowerCase()) ||
      job.description.toLowerCase().includes(search.toLowerCase());

    const matchType = typeFilter === "all" ||
      jobType.toLowerCase() === typeFilter ||
      (typeFilter === "internship" && job.duration);

    return matchSearch && matchType;
  });

  const handleApply = async (job: DashboardJob) => {
    if (!user) {
      toast({
        title: "Please login",
        description: "You need to login to apply for jobs",
        variant: "destructive",
      });
      return;
    }

    try {
      const userProfile = {
        name: user.displayName || user.email?.split('@')[0] || "User",
        email: user.email || "",
        resumeUrl: ""
      };

      await applyForJob(
        job.id,
        user.uid,
        userProfile.name,
        userProfile.email,
        userProfile.resumeUrl
      );

      toast({
        title: "Application submitted!",
        description: "Your application has been sent to the recruiter.",
      });

      setAppliedJobs([...appliedJobs, job.id]);
    } catch (error: any) {
      toast({
        title: "Application failed",
        description: error.message || "Please try again",
        variant: "destructive",
      });
    }
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const formatSalary = (job: DashboardJob) => {
    if (job.salaryMin && job.salaryMax) {
      return `₹${job.salaryMin.toLocaleString('en-IN')} - ₹${job.salaryMax.toLocaleString('en-IN')}`;
    } else if (job.stipendMin && job.stipendMax) {
      return `Stipend: ₹${job.stipendMin.toLocaleString('en-IN')} - ₹${job.stipendMax.toLocaleString('en-IN')}`;
    } else if (job.stipend) {
      return `Stipend: ₹${job.stipend.toLocaleString('en-IN')}`;
    }
    return "Salary not specified";
  };

  const formatDate = (dateString?: string | Date) => {
    if (!dateString) return "Date not available";

    try {
      const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
      return date.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
    } catch {
      return "Date not available";
    }
  };

  const getCompanyName = (job: DashboardJob) => {
    return job.companyName || job.company || "Unknown Company";
  };

  const getJobType = (job: DashboardJob) => {
    return job.type || job.jobType || (job.duration ? "internship" : "Full-time");
  };

  const getPostedDate = (job: DashboardJob) => {
    return job.postedAt || job.postedDate?.toISOString() || new Date().toISOString();
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border sticky top-0 z-40">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            <span className="font-display text-lg font-bold text-foreground">JOBNEXIS</span>
            <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium ml-2">Student</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/profile"><User className="h-4 w-4 mr-1" /> Profile</Link>
            </Button>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-1" /> Sign Out
            </Button>
          </div>
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
            <Input
              placeholder="Search jobs by title, company..."
              className="pl-10"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
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
              <SelectItem value="part-time">Part-time</SelectItem>
              <SelectItem value="contract">Contract</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-3">
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                <p className="mt-4 text-muted-foreground">Loading jobs...</p>
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                {jobs.length === 0 ? "No jobs available" : "No jobs found matching your criteria."}
                {jobs.length > 0 && (
                  <div className="mt-2 text-xs">
                    Try clearing your search filters
                  </div>
                )}
              </div>
            ) : (
              filtered.map((job) => (
                <button
                  key={job.id}
                  onClick={() => setSelectedJob(job)}
                  className={`w-full text-left bg-card rounded-xl border p-4 hover:shadow-card-hover transition-all ${selectedJob?.id === job.id ? "border-primary shadow-card" : "border-border"}`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <h3 className="font-body font-semibold text-foreground">
                        {job.title || "Untitled Job"}
                      </h3>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <Briefcase className="h-3.5 w-3.5" /> {getCompanyName(job)}
                      </p>
                      <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" /> {job.location || "Location not specified"}
                        </span>
                        <span className="flex items-center gap-1">
                          <DollarSign className="h-3 w-3" /> {formatSalary(job)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" /> {formatDate(getPostedDate(job))}
                        </span>
                        <span className="capitalize">{getJobType(job)}</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1.5">
                      {job.isVerified && <StatusBadge type="verified" />}
                      <StatusBadge type={getRiskLevel(job)} />
                      {job.applicationsCount && (
                        <span className="text-xs text-muted-foreground">
                          {job.applicationsCount} applicants
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>

          <div className="bg-card rounded-xl border border-border p-5 h-fit sticky top-20">
            {selectedJob ? (
              <div className="space-y-4">
                <div>
                  <h2 className="font-display text-xl font-bold text-foreground">
                    {selectedJob.title || "Untitled Job"}
                  </h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    {getCompanyName(selectedJob)}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {selectedJob.isVerified && <StatusBadge type="verified" />}
                  <StatusBadge type={getRiskLevel(selectedJob)} />
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">
                    <Shield className="h-3 w-3" />
                    {selectedJob.isActive === false ? 'Inactive' :
                      getRiskLevel(selectedJob) === 'low' ? 'Safe to Apply' :
                        getRiskLevel(selectedJob) === 'medium' ? 'Apply with Caution' :
                          'High Risk - Verify Details'}
                  </span>
                </div>
                <div className="space-y-2 text-sm">
                  <p><strong className="text-foreground">Location:</strong>
                    <span className="text-muted-foreground ml-1">{selectedJob.location || "Not specified"}</span>
                  </p>
                  <p><strong className="text-foreground">Salary/Stipend:</strong>
                    <span className="text-muted-foreground ml-1">{formatSalary(selectedJob)}</span>
                  </p>
                  <p><strong className="text-foreground">Type:</strong>
                    <span className="text-muted-foreground ml-1 capitalize">{getJobType(selectedJob)}</span>
                  </p>
                  {selectedJob.duration && (
                    <p><strong className="text-foreground">Duration:</strong>
                      <span className="text-muted-foreground ml-1">{selectedJob.duration}</span>
                    </p>
                  )}
                  <p><strong className="text-foreground">Description:</strong>
                    <span className="text-muted-foreground ml-1">{selectedJob.description}</span>
                  </p>

                  {selectedJob.skillsRequired && selectedJob.skillsRequired.length > 0 && (
                    <p><strong className="text-foreground">Skills Required:</strong>
                      <span className="text-muted-foreground ml-1">
                        {selectedJob.skillsRequired.join(", ")}
                      </span>
                    </p>
                  )}

                  {selectedJob.applicationDeadline && (
                    <p><strong className="text-foreground">Apply by:</strong>
                      <span className="text-muted-foreground ml-1">{formatDate(selectedJob.applicationDeadline)}</span>
                    </p>
                  )}

                  {selectedJob.applicationsCount && (
                    <p><strong className="text-foreground">Total Applicants:</strong>
                      <span className="text-muted-foreground ml-1">{selectedJob.applicationsCount}</span>
                    </p>
                  )}

                  <p className="text-xs text-muted-foreground pt-2 border-t">
                    Posted on: {formatDate(getPostedDate(selectedJob))}
                    {selectedJob.recruiterName && ` • Posted by: ${selectedJob.recruiterName}`}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    className="flex-1"
                    onClick={() => handleApply(selectedJob)}
                    disabled={appliedJobs.includes(selectedJob.id) || !user || selectedJob.isActive === false}
                  >
                    {selectedJob.isActive === false ? "Job Inactive" :
                      appliedJobs.includes(selectedJob.id) ? "✓ Applied" :
                        !user ? "Login to Apply" : "Apply Now"}
                  </Button>
                  <Button variant="outline" size="icon">
                    <Flag className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground text-sm">
                <Briefcase className="h-8 w-8 mx-auto mb-2 opacity-40" />
                {loading ? "Loading jobs..." :
                  jobs.length === 0 ? "No jobs available. Check back later." :
                    "Select a job to view details"}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default StudentDashboard;