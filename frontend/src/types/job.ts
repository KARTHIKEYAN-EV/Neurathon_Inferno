// frontend/src/types/job.ts
export interface Job {
    id: string;
    title: string;
    company: string;
    location: string;
    salaryMin: number;
    salaryMax: number;
    type: 'internship' | 'full-time' | 'part-time' | 'contract';
    description: string;
    requirements: string[];
    postedDate: Date;
    deadline?: Date;
    recruiterId: string;
    recruiterName: string;
    isVerified: boolean;
    riskLevel: 'low' | 'medium' | 'high';
    applicants: string[]; // Array of user IDs who applied
}

export interface JobApplication {
    id: string;
    jobId: string;
    userId: string;
    userName: string;
    userEmail: string;
    resumeUrl: string;
    status: 'pending' | 'reviewed' | 'accepted' | 'rejected';
    appliedDate: Date;
}

export type JobType = Job['type'];
export type RiskLevel = Job['riskLevel'];