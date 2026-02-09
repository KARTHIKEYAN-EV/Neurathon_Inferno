import { Link } from "react-router-dom";
import { Shield, Users, Briefcase, AlertTriangle, Flag, CheckCircle, XCircle, LogOut, Eye, Ban, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import StatusBadge from "@/components/StatusBadge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState, useEffect } from "react";
import {
  jobAPI,
  recruiterAPI,
  reportAPI,
  getAdminStats,
  type Job,
  type Recruiter,
  type Report
} from "@/lib/api";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    pendingVerifications: 0,
    jobsAwaitingApproval: 0,
    flaggedJobs: 0,
    reports: 0,
  });

  const [pendingRecruiters, setPendingRecruiters] = useState<Recruiter[]>([]);
  const [pendingJobs, setPendingJobs] = useState<Job[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [activeTab, setActiveTab] = useState("recruiters");

  // Load initial data
  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    // Load stats
    const newStats = getAdminStats();
    setStats(newStats);

    // Load pending recruiters
    const recruiters = recruiterAPI.getPendingRecruiters();
    setPendingRecruiters(recruiters);

    // Load pending jobs
    const jobs = jobAPI.getPendingJobs();
    setPendingJobs(jobs);

    // Load reports
    const reportList = reportAPI.getReports();
    setReports(reportList);
  };

  const handleApproveRecruiter = (id: number) => {
    if (recruiterAPI.approveRecruiter(id)) {
      setPendingRecruiters(prev => prev.filter(rec => rec.id !== id));
      setStats(prev => ({ ...prev, pendingVerifications: prev.pendingVerifications - 1 }));
    }
  };

  const handleRejectRecruiter = (id: number) => {
    if (recruiterAPI.rejectRecruiter(id)) {
      setPendingRecruiters(prev => prev.filter(rec => rec.id !== id));
      setStats(prev => ({ ...prev, pendingVerifications: prev.pendingVerifications - 1 }));
    }
  };

  const handleApproveJob = (id: number) => {
    if (jobAPI.approveJob(id)) {
      setPendingJobs(prev => prev.filter(job => job.id !== id));
      setStats(prev => ({ ...prev, jobsAwaitingApproval: prev.jobsAwaitingApproval - 1 }));
    }
  };

  const handleRejectJob = (id: number) => {
    if (jobAPI.rejectJob(id)) {
      setPendingJobs(prev => prev.filter(job => job.id !== id));
      setStats(prev => ({ ...prev, jobsAwaitingApproval: prev.jobsAwaitingApproval - 1 }));
    }
  };

  const handleBanJob = (id: number) => {
    if (jobAPI.banJob(id)) {
      setPendingJobs(prev => prev.filter(job => job.id !== id));
      setStats(prev => ({
        ...prev,
        jobsAwaitingApproval: prev.jobsAwaitingApproval - 1,
        flaggedJobs: Math.max(0, prev.flaggedJobs - 1)
      }));
    }
  };

  const handleReviewReport = (id: number) => {
    if (reportAPI.reviewReport(id)) {
      setReports(prev => prev.filter(report => report.id !== id));
      setStats(prev => ({ ...prev, reports: prev.reports - 1 }));
    }
  };

  const handleRemoveJob = (id: number) => {
    if (reportAPI.resolveReport(id, 'remove')) {
      setReports(prev => prev.filter(report => report.id !== id));
      setStats(prev => ({ ...prev, reports: prev.reports - 1 }));
    }
  };

  const handleDismissReport = (id: number) => {
    if (reportAPI.resolveReport(id, 'dismiss')) {
      setReports(prev => prev.filter(report => report.id !== id));
      setStats(prev => ({ ...prev, reports: prev.reports - 1 }));
    }
  };

  const statsData = [
    { label: "Total Users", value: stats.totalUsers.toLocaleString(), icon: Users, color: "text-primary" },
    { label: "Pending Verifications", value: stats.pendingVerifications.toString(), icon: Shield, color: "text-warning" },
    { label: "Jobs Awaiting Approval", value: stats.jobsAwaitingApproval.toString(), icon: Briefcase, color: "text-accent" },
    { label: "Flagged Jobs", value: stats.flaggedJobs.toString(), icon: AlertTriangle, color: "text-destructive" },
    { label: "Reports", value: stats.reports.toString(), icon: Flag, color: "text-destructive" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border sticky top-0 z-40">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            <span className="font-display text-lg font-bold text-foreground">JOBNEXIS</span>
            <span className="text-xs bg-destructive/10 text-destructive px-2 py-0.5 rounded-full font-medium ml-2">Admin</span>
          </div>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/"><LogOut className="h-4 w-4 mr-1" /> Sign Out</Link>
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 space-y-6">
        <h1 className="font-display text-2xl font-bold text-foreground">Admin Dashboard</h1>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {statsData.map((stat) => (
            <div key={stat.label} className="bg-card rounded-xl border border-border p-4 space-y-1">
              <div className="flex items-center gap-2">
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
                <span className="text-xs text-muted-foreground">{stat.label}</span>
              </div>
              <p className="font-display text-2xl font-bold text-foreground">{stat.value}</p>
            </div>
          ))}
        </div>

        <Tabs defaultValue="recruiters" value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="recruiters">Recruiter Verification</TabsTrigger>
            <TabsTrigger value="jobs">Job Review</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="recruiters" className="mt-4">
            <div className="bg-card rounded-xl border border-border overflow-hidden">
              {pendingRecruiters.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">
                  <Users className="h-12 w-12 mx-auto mb-4 opacity-20" />
                  <p className="text-lg font-medium">No pending recruiter verifications</p>
                  <p className="text-sm">All recruiters have been reviewed.</p>
                </div>
              ) : (
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border bg-muted/50">
                      <th className="text-left p-3 text-xs font-semibold text-muted-foreground uppercase">Company</th>
                      <th className="text-left p-3 text-xs font-semibold text-muted-foreground uppercase">Email</th>
                      <th className="text-left p-3 text-xs font-semibold text-muted-foreground uppercase">Website</th>
                      <th className="text-right p-3 text-xs font-semibold text-muted-foreground uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingRecruiters.map((rec) => (
                      <tr key={rec.id} className="border-b border-border last:border-0 hover:bg-muted/50">
                        <td className="p-3 font-medium text-sm text-foreground">{rec.company}</td>
                        <td className="p-3 text-sm text-muted-foreground">{rec.email}</td>
                        <td className="p-3 text-sm text-muted-foreground">{rec.website}</td>
                        <td className="p-3 text-right space-x-1">
                          <Button size="sm" variant="default" onClick={() => handleApproveRecruiter(rec.id)}>
                            <CheckCircle className="h-3.5 w-3.5 mr-1" /> Approve
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button size="sm" variant="outline">
                                <XCircle className="h-3.5 w-3.5 mr-1" /> Reject
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Reject Recruiter Verification?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This will reject {rec.company}'s verification request. They will need to reapply.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleRejectRecruiter(rec.id)}>
                                  Confirm Reject
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </TabsContent>

          <TabsContent value="jobs" className="mt-4">
            <div className="bg-card rounded-xl border border-border overflow-hidden">
              {pendingJobs.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">
                  <Briefcase className="h-12 w-12 mx-auto mb-4 opacity-20" />
                  <p className="text-lg font-medium">No pending job reviews</p>
                  <p className="text-sm">All jobs have been reviewed.</p>
                </div>
              ) : (
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border bg-muted/50">
                      <th className="text-left p-3 text-xs font-semibold text-muted-foreground uppercase">Job Title</th>
                      <th className="text-left p-3 text-xs font-semibold text-muted-foreground uppercase">Company</th>
                      <th className="text-left p-3 text-xs font-semibold text-muted-foreground uppercase">AI Risk</th>
                      <th className="text-left p-3 text-xs font-semibold text-muted-foreground uppercase">Flags</th>
                      <th className="text-right p-3 text-xs font-semibold text-muted-foreground uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingJobs.map((job) => (
                      <tr key={job.id} className="border-b border-border last:border-0 hover:bg-muted/50">
                        <td className="p-3 font-medium text-sm text-foreground">{job.title}</td>
                        <td className="p-3 text-sm text-muted-foreground">{job.company}</td>
                        <td className="p-3"><StatusBadge type={job.risk} /></td>
                        <td className="p-3">
                          <div className="flex flex-wrap gap-1">
                            {job.flags.length > 0 ? job.flags.map((f) => (
                              <span key={f} className="text-xs bg-destructive/10 text-destructive px-2 py-0.5 rounded-full">{f}</span>
                            )) : <span className="text-xs text-muted-foreground">None</span>}
                          </div>
                        </td>
                        <td className="p-3 text-right space-x-1">
                          <Button size="sm" onClick={() => handleApproveJob(job.id)}>
                            <CheckCircle className="h-3.5 w-3.5 mr-1" /> Approve
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button size="sm" variant="outline">
                                <XCircle className="h-3.5 w-3.5 mr-1" /> Reject
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Reject Job Posting?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This will reject "{job.title}" at {job.company}. The recruiter will be notified.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleRejectJob(job.id)}>
                                  Confirm Reject
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button size="sm" variant="destructive">
                                <Ban className="h-3.5 w-3.5" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Ban Job Posting?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This will permanently ban "{job.title}" at {job.company} and prevent it from being reposted.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleBanJob(job.id)}>
                                  Confirm Ban
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </TabsContent>

          <TabsContent value="reports" className="mt-4">
            <div className="bg-card rounded-xl border border-border overflow-hidden">
              {reports.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">
                  <Flag className="h-12 w-12 mx-auto mb-4 opacity-20" />
                  <p className="text-lg font-medium">No pending reports</p>
                  <p className="text-sm">All reports have been reviewed.</p>
                </div>
              ) : (
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border bg-muted/50">
                      <th className="text-left p-3 text-xs font-semibold text-muted-foreground uppercase">Job</th>
                      <th className="text-left p-3 text-xs font-semibold text-muted-foreground uppercase">Reason</th>
                      <th className="text-left p-3 text-xs font-semibold text-muted-foreground uppercase">Reporter</th>
                      <th className="text-left p-3 text-xs font-semibold text-muted-foreground uppercase">Date</th>
                      <th className="text-right p-3 text-xs font-semibold text-muted-foreground uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reports.map((r) => (
                      <tr key={r.id} className="border-b border-border last:border-0 hover:bg-muted/50">
                        <td className="p-3 font-medium text-sm text-foreground">{r.job}</td>
                        <td className="p-3 text-sm text-muted-foreground">{r.reason}</td>
                        <td className="p-3 text-sm text-muted-foreground">{r.reporter}</td>
                        <td className="p-3 text-sm text-muted-foreground">{r.date}</td>
                        <td className="p-3 text-right space-x-1">
                          <Button size="sm" variant="outline" onClick={() => handleReviewReport(r.id)}>
                            <Eye className="h-3.5 w-3.5 mr-1" /> Review
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button size="sm" variant="destructive">
                                <Ban className="h-3.5 w-3.5 mr-1" /> Remove
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Remove Reported Job?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This will remove the reported job from the platform.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleRemoveJob(r.id)}>
                                  Confirm Remove
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button size="sm" variant="secondary">
                                Dismiss
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Dismiss Report?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This will dismiss the report as invalid.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDismissReport(r.id)}>
                                  Confirm Dismiss
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminDashboard;