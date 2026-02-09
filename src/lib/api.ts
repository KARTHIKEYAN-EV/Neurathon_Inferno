import { toast } from "@/hooks/use-toast";

// Types
export interface Job {
    id: number;
    title: string;
    company: string;
    risk: 'low' | 'medium' | 'high';
    flags: string[];
    status: 'pending' | 'approved' | 'rejected' | 'banned';
    createdAt: string;
}

export interface Recruiter {
    id: number;
    company: string;
    email: string;
    website: string;
    linkedin: string;
    status: 'pending' | 'approved' | 'rejected';
}

export interface Report {
    id: number;
    job: string;
    reason: string;
    reporter: string;
    date: string;
    status: 'pending' | 'reviewed' | 'resolved';
}

// Simulated database (in real app, this would be backend API calls)
let pendingJobs: Job[] = [
    { id: 1, title: "Social Media Manager", company: "BrandWorks", risk: "medium", flags: ["Vague description", "No salary info"], status: "pending", createdAt: "2026-02-08" },
    { id: 2, title: "Remote Data Entry", company: "QuickJobs", risk: "high", flags: ["Payment requested", "Guaranteed income"], status: "pending", createdAt: "2026-02-07" },
    { id: 3, title: "Software Engineer", company: "CloudBase", risk: "low", flags: [], status: "pending", createdAt: "2026-02-09" },
];

let pendingRecruiters: Recruiter[] = [
    { id: 1, company: "InnoTech Solutions", email: "hr@innotech.com", website: "innotech.com", linkedin: "linkedin.com/company/innotech", status: "pending" },
    { id: 2, company: "DataMinds AI", email: "careers@dataminds.ai", website: "dataminds.ai", linkedin: "linkedin.com/company/dataminds", status: "pending" },
];

let reports: Report[] = [
    { id: 1, job: "Virtual Assistant Role", reason: "Payment request", reporter: "student@univ.edu", date: "2026-02-08", status: "pending" },
    { id: 2, job: "Freelance Writer", reason: "Fake company", reporter: "user@gmail.com", date: "2026-02-07", status: "pending" },
];

// Job Functions
export const jobAPI = {
    getPendingJobs: () => {
        return pendingJobs.filter(job => job.status === 'pending');
    },

    getAllJobs: () => {
        return [...pendingJobs];
    },

    approveJob: (id: number) => {
        const job = pendingJobs.find(job => job.id === id);
        if (job) {
            job.status = 'approved';
            toast({
                title: "Job Approved",
                description: `${job.title} at ${job.company} has been approved.`,
            });
            return true;
        }
        return false;
    },

    rejectJob: (id: number) => {
        const job = pendingJobs.find(job => job.id === id);
        if (job) {
            job.status = 'rejected';
            toast({
                title: "Job Rejected",
                description: `${job.title} at ${job.company} has been rejected.`,
            });
            return true;
        }
        return false;
    },

    banJob: (id: number) => {
        const job = pendingJobs.find(job => job.id === id);
        if (job) {
            job.status = 'banned';
            toast({
                title: "Job Banned",
                description: `${job.title} at ${job.company} has been banned.`,
                variant: "destructive",
            });
            return true;
        }
        return false;
    },
};

// Recruiter Functions
export const recruiterAPI = {
    getPendingRecruiters: () => {
        return pendingRecruiters.filter(rec => rec.status === 'pending');
    },

    approveRecruiter: (id: number) => {
        const recruiter = pendingRecruiters.find(rec => rec.id === id);
        if (recruiter) {
            recruiter.status = 'approved';
            toast({
                title: "Recruiter Approved",
                description: `${recruiter.company} has been approved.`,
            });
            return true;
        }
        return false;
    },

    rejectRecruiter: (id: number) => {
        const recruiter = pendingRecruiters.find(rec => rec.id === id);
        if (recruiter) {
            recruiter.status = 'rejected';
            toast({
                title: "Recruiter Rejected",
                description: `${recruiter.company} has been rejected.`,
                variant: "destructive",
            });
            return true;
        }
        return false;
    },
};

// Report Functions
export const reportAPI = {
    getReports: () => {
        return reports.filter(report => report.status === 'pending');
    },

    reviewReport: (id: number) => {
        const report = reports.find(report => report.id === id);
        if (report) {
            report.status = 'reviewed';
            toast({
                title: "Report Reviewed",
                description: `Report for "${report.job}" has been marked as reviewed.`,
            });
            return true;
        }
        return false;
    },

    resolveReport: (id: number, action: 'remove' | 'dismiss') => {
        const report = reports.find(report => report.id === id);
        if (report) {
            report.status = 'resolved';
            toast({
                title: action === 'remove' ? "Job Removed" : "Report Dismissed",
                description: action === 'remove'
                    ? `The reported job has been removed.`
                    : `The report has been dismissed.`,
            });
            return true;
        }
        return false;
    },
};

// Stats Function
export const getAdminStats = () => {
    return {
        totalUsers: 1248,
        pendingVerifications: recruiterAPI.getPendingRecruiters().length,
        jobsAwaitingApproval: jobAPI.getPendingJobs().length,
        flaggedJobs: pendingJobs.filter(job => job.risk === 'high').length,
        reports: reportAPI.getReports().length,
    };
};