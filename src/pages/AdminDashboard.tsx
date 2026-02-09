import { Link } from "react-router-dom";
import { Shield, Users, Briefcase, AlertTriangle, Flag, CheckCircle, XCircle, LogOut, Eye, Ban, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import StatusBadge from "@/components/StatusBadge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const stats = [
  { label: "Total Users", value: "1,248", icon: Users, color: "text-primary" },
  { label: "Pending Verifications", value: "12", icon: Shield, color: "text-warning" },
  { label: "Jobs Awaiting Approval", value: "8", icon: Briefcase, color: "text-accent" },
  { label: "Flagged Jobs", value: "3", icon: AlertTriangle, color: "text-destructive" },
  { label: "Reports", value: "5", icon: Flag, color: "text-destructive" },
];

const pendingRecruiters = [
  { id: 1, company: "InnoTech Solutions", email: "hr@innotech.com", website: "innotech.com", linkedin: "linkedin.com/company/innotech" },
  { id: 2, company: "DataMinds AI", email: "careers@dataminds.ai", website: "dataminds.ai", linkedin: "linkedin.com/company/dataminds" },
];

const pendingJobs = [
  { id: 1, title: "Social Media Manager", company: "BrandWorks", risk: "medium" as const, flags: ["Vague description", "No salary info"] },
  { id: 2, title: "Remote Data Entry", company: "QuickJobs", risk: "high" as const, flags: ["Payment requested", "Guaranteed income"] },
  { id: 3, title: "Software Engineer", company: "CloudBase", risk: "low" as const, flags: [] },
];

const reports = [
  { id: 1, job: "Virtual Assistant Role", reason: "Payment request", reporter: "student@univ.edu", date: "2026-02-08" },
  { id: 2, job: "Freelance Writer", reason: "Fake company", reporter: "user@gmail.com", date: "2026-02-07" },
];

const AdminDashboard = () => {
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
          {stats.map((stat) => (
            <div key={stat.label} className="bg-card rounded-xl border border-border p-4 space-y-1">
              <div className="flex items-center gap-2">
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
                <span className="text-xs text-muted-foreground">{stat.label}</span>
              </div>
              <p className="font-display text-2xl font-bold text-foreground">{stat.value}</p>
            </div>
          ))}
        </div>

        <Tabs defaultValue="recruiters">
          <TabsList>
            <TabsTrigger value="recruiters">Recruiter Verification</TabsTrigger>
            <TabsTrigger value="jobs">Job Review</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="recruiters" className="mt-4">
            <div className="bg-card rounded-xl border border-border overflow-hidden">
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
                    <tr key={rec.id} className="border-b border-border last:border-0">
                      <td className="p-3 font-medium text-sm text-foreground">{rec.company}</td>
                      <td className="p-3 text-sm text-muted-foreground">{rec.email}</td>
                      <td className="p-3 text-sm text-muted-foreground">{rec.website}</td>
                      <td className="p-3 text-right space-x-1">
                        <Button size="sm" variant="default"><CheckCircle className="h-3.5 w-3.5 mr-1" /> Approve</Button>
                        <Button size="sm" variant="outline"><XCircle className="h-3.5 w-3.5 mr-1" /> Reject</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>

          <TabsContent value="jobs" className="mt-4">
            <div className="bg-card rounded-xl border border-border overflow-hidden">
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
                    <tr key={job.id} className="border-b border-border last:border-0">
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
                        <Button size="sm"><CheckCircle className="h-3.5 w-3.5 mr-1" /> Approve</Button>
                        <Button size="sm" variant="outline"><XCircle className="h-3.5 w-3.5 mr-1" /> Reject</Button>
                        <Button size="sm" variant="destructive"><Ban className="h-3.5 w-3.5" /></Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>

          <TabsContent value="reports" className="mt-4">
            <div className="bg-card rounded-xl border border-border overflow-hidden">
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
                    <tr key={r.id} className="border-b border-border last:border-0">
                      <td className="p-3 font-medium text-sm text-foreground">{r.job}</td>
                      <td className="p-3 text-sm text-muted-foreground">{r.reason}</td>
                      <td className="p-3 text-sm text-muted-foreground">{r.reporter}</td>
                      <td className="p-3 text-sm text-muted-foreground">{r.date}</td>
                      <td className="p-3 text-right space-x-1">
                        <Button size="sm" variant="outline"><Eye className="h-3.5 w-3.5 mr-1" /> Review</Button>
                        <Button size="sm" variant="destructive"><Ban className="h-3.5 w-3.5 mr-1" /> Remove</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminDashboard;
