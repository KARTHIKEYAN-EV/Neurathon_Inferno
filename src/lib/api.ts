// Shared localStorage-based API for syncing data between Admin and Recruiter dashboards

export interface Job {
    id: number;
    title: string;
    description: string;
    location: string;
    salaryMin: string;
    salaryMax: string;
    jobType: string;
    applicationLink: string;
    company: string;
    risk: "low" | "medium" | "high";
    flags: string[];
    status: "pending" | "approved" | "rejected" | "banned";
    submittedAt: string;
}

export interface Recruiter {
    id: number;
    company: string;
    email: string;
    website: string;
    status: "pending" | "approved" | "rejected";
}

export interface Report {
    id: number;
    job: string;
    reason: string;
    reporter: string;
    date: string;
    status: "pending" | "reviewed" | "resolved";
}

// ---- Storage helpers ----
const JOBS_KEY = "jobnexis_jobs";
const RECRUITERS_KEY = "jobnexis_recruiters";
const REPORTS_KEY = "jobnexis_reports";

function getStore<T>(key: string, fallback: T[]): T[] {
    try {
        const raw = localStorage.getItem(key);
        return raw ? JSON.parse(raw) : fallback;
    } catch {
        return fallback;
    }
}

function setStore<T>(key: string, data: T[]) {
    localStorage.setItem(key, JSON.stringify(data));
    // Dispatch a custom event so other tabs/components can react
    window.dispatchEvent(new CustomEvent("jobnexis-sync", { detail: { key } }));
}

// ---- Seed data ----
const seedJobs: Job[] = [
    {
        id: 1, title: "Frontend Developer Intern", description: "Build UI components with React.",
        location: "Remote", salaryMin: "15000", salaryMax: "25000", jobType: "internship",
        applicationLink: "https://example.com/apply", company: "TechCorp",
        risk: "low", flags: [], status: "approved", submittedAt: "2026-02-01",
    },
    {
        id: 2, title: "Backend Engineer", description: "Design scalable APIs with Node.js.",
        location: "Bangalore", salaryMin: "40000", salaryMax: "70000", jobType: "full-time",
        applicationLink: "https://example.com/apply2", company: "DataWorks",
        risk: "low", flags: [], status: "pending", submittedAt: "2026-02-05",
    },
    {
        id: 3, title: "Marketing Associate", description: "Pay a registration fee to earn guaranteed job placement with unlimited income potential.",
        location: "Delhi", salaryMin: "20000", salaryMax: "30000", jobType: "full-time",
        applicationLink: "https://example.com/apply3", company: "GrowthInc",
        risk: "medium", flags: ["Payment request detected"], status: "pending", submittedAt: "2026-02-07",
    },
    {
        id: 4, title: "Data Entry Specialist", description: "Earn $5000 per day working from home. No experience needed, guaranteed job offer with advance payment required.",
        location: "Work From Home", salaryMin: "100000", salaryMax: "500000", jobType: "full-time",
        applicationLink: "https://scam.example.com", company: "QuickCash Ltd",
        risk: "high", flags: ["Unrealistic salary promise", "Payment request detected", "Guaranteed job claim"], status: "pending", submittedAt: "2026-02-08",
    },
];

const seedRecruiters: Recruiter[] = [
    { id: 1, company: "TechCorp", email: "hr@techcorp.com", website: "techcorp.com", status: "approved" },
    { id: 2, company: "DataWorks", email: "hire@dataworks.io", website: "dataworks.io", status: "pending" },
    { id: 3, company: "GrowthInc", email: "jobs@growthinc.in", website: "growthinc.in", status: "pending" },
    { id: 4, company: "QuickCash Ltd", email: "apply@quickcash.biz", website: "quickcash.biz", status: "pending" },
];

const seedReports: Report[] = [
    { id: 1, job: "Social Media Manager", reason: "Requests personal bank details", reporter: "user42@gmail.com", date: "2026-02-06", status: "pending" },
    { id: 2, job: "Customer Support Agent", reason: "Fake company details", reporter: "student99@mail.com", date: "2026-02-07", status: "pending" },
];

function ensureSeeded() {
    if (!localStorage.getItem(JOBS_KEY)) setStore(JOBS_KEY, seedJobs);
    if (!localStorage.getItem(RECRUITERS_KEY)) setStore(RECRUITERS_KEY, seedRecruiters);
    if (!localStorage.getItem(REPORTS_KEY)) setStore(REPORTS_KEY, seedReports);
}

ensureSeeded();

// ---- Job API ----
export const jobAPI = {
    getAllJobs: (): Job[] => getStore<Job>(JOBS_KEY, seedJobs),

    getPendingJobs: (): Job[] => jobAPI.getAllJobs().filter(j => j.status === "pending"),

    getJobsByCompany: (company: string): Job[] => jobAPI.getAllJobs().filter(j => j.company === company),

    addJob: (job: Omit<Job, "id" | "submittedAt">): Job => {
        const jobs = jobAPI.getAllJobs();
        const newJob: Job = {
            ...job,
            id: Date.now(),
            submittedAt: new Date().toISOString().split("T")[0],
        };
        setStore(JOBS_KEY, [...jobs, newJob]);
        return newJob;
    },

    approveJob: (id: number): boolean => {
        const jobs = jobAPI.getAllJobs();
        const idx = jobs.findIndex(j => j.id === id);
        if (idx === -1) return false;
        jobs[idx].status = "approved";
        setStore(JOBS_KEY, jobs);
        return true;
    },

    rejectJob: (id: number): boolean => {
        const jobs = jobAPI.getAllJobs();
        const idx = jobs.findIndex(j => j.id === id);
        if (idx === -1) return false;
        jobs[idx].status = "rejected";
        setStore(JOBS_KEY, jobs);
        return true;
    },

    banJob: (id: number): boolean => {
        const jobs = jobAPI.getAllJobs();
        const idx = jobs.findIndex(j => j.id === id);
        if (idx === -1) return false;
        jobs[idx].status = "banned";
        setStore(JOBS_KEY, jobs);
        return true;
    },
};

// ---- Recruiter API ----
export const recruiterAPI = {
    getAllRecruiters: (): Recruiter[] => getStore<Recruiter>(RECRUITERS_KEY, seedRecruiters),

    getPendingRecruiters: (): Recruiter[] => recruiterAPI.getAllRecruiters().filter(r => r.status === "pending"),

    approveRecruiter: (id: number): boolean => {
        const recs = recruiterAPI.getAllRecruiters();
        const idx = recs.findIndex(r => r.id === id);
        if (idx === -1) return false;
        recs[idx].status = "approved";
        setStore(RECRUITERS_KEY, recs);
        return true;
    },

    rejectRecruiter: (id: number): boolean => {
        const recs = recruiterAPI.getAllRecruiters();
        const idx = recs.findIndex(r => r.id === id);
        if (idx === -1) return false;
        recs[idx].status = "rejected";
        setStore(RECRUITERS_KEY, recs);
        return true;
    },
};

// ---- Report API ----
export const reportAPI = {
    getReports: (): Report[] => getStore<Report>(REPORTS_KEY, seedReports).filter(r => r.status === "pending"),

    reviewReport: (id: number): boolean => {
        const reps = getStore<Report>(REPORTS_KEY, seedReports);
        const idx = reps.findIndex(r => r.id === id);
        if (idx === -1) return false;
        reps[idx].status = "reviewed";
        setStore(REPORTS_KEY, reps);
        return true;
    },

    resolveReport: (id: number, action: "remove" | "dismiss"): boolean => {
        const reps = getStore<Report>(REPORTS_KEY, seedReports);
        const idx = reps.findIndex(r => r.id === id);
        if (idx === -1) return false;
        reps[idx].status = "resolved";
        setStore(REPORTS_KEY, reps);
        return true;
    },
};

// ---- Admin stats ----
export const getAdminStats = () => {
    const jobs = jobAPI.getAllJobs();
    const recruiters = recruiterAPI.getAllRecruiters();
    const reports = reportAPI.getReports();
    return {
        totalUsers: recruiters.length + 120, // simulated user count
        pendingVerifications: recruiters.filter(r => r.status === "pending").length,
        jobsAwaitingApproval: jobs.filter(j => j.status === "pending").length,
        flaggedJobs: jobs.filter(j => j.risk === "high").length,
        reports: reports.length,
    };
};
