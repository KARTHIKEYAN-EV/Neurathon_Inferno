// frontend/src/lib/jobService.ts
import {
    collection,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    getDocs,
    getDoc,
    query,
    where,
    orderBy,
    serverTimestamp
} from 'firebase/firestore';
import { db } from './firebase';
import { Job, JobApplication } from '@/types/job';

// Add a new job (for recruiters)
export const addJob = async (jobData: Omit<Job, 'id' | 'postedDate' | 'applicants'>) => {
    try {
        const jobRef = await addDoc(collection(db, 'jobs'), {
            ...jobData,
            postedDate: serverTimestamp(),
            applicants: []
        });
        return jobRef.id;
    } catch (error) {
        console.error('Error adding job:', error);
        throw error;
    }
};

// Get all jobs
export const getAllJobs = async (): Promise<Job[]> => {
    try {
        const q = query(collection(db, 'jobs'), orderBy('postedDate', 'desc'));
        const querySnapshot = await getDocs(q);

        const jobs: Job[] = [];
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            jobs.push({
                id: doc.id,
                title: data.title,
                company: data.company,
                location: data.location,
                salaryMin: data.salaryMin,
                salaryMax: data.salaryMax,
                type: data.type,
                description: data.description,
                requirements: data.requirements || [],
                postedDate: data.postedDate?.toDate() || new Date(),
                deadline: data.deadline?.toDate(),
                recruiterId: data.recruiterId,
                recruiterName: data.recruiterName,
                isVerified: data.isVerified || false,
                riskLevel: data.riskLevel || 'medium',
                applicants: data.applicants || []
            });
        });

        return jobs;
    } catch (error) {
        console.error('Error getting jobs:', error);
        return [];
    }
};

// Get job by ID
export const getJobById = async (jobId: string): Promise<Job | null> => {
    try {
        const docRef = doc(db, 'jobs', jobId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const data = docSnap.data();
            return {
                id: docSnap.id,
                title: data.title,
                company: data.company,
                location: data.location,
                salaryMin: data.salaryMin,
                salaryMax: data.salaryMax,
                type: data.type,
                description: data.description,
                requirements: data.requirements || [],
                postedDate: data.postedDate?.toDate() || new Date(),
                deadline: data.deadline?.toDate(),
                recruiterId: data.recruiterId,
                recruiterName: data.recruiterName,
                isVerified: data.isVerified || false,
                riskLevel: data.riskLevel || 'medium',
                applicants: data.applicants || []
            };
        }
        return null;
    } catch (error) {
        console.error('Error getting job:', error);
        return null;
    }
};

// Apply for a job
export const applyForJob = async (jobId: string, userId: string, userName: string, userEmail: string, resumeUrl: string) => {
    try {
        // Add to applications collection
        await addDoc(collection(db, 'applications'), {
            jobId,
            userId,
            userName,
            userEmail,
            resumeUrl,
            status: 'pending',
            appliedDate: serverTimestamp()
        });

        // Update job's applicants array
        const jobRef = doc(db, 'jobs', jobId);
        const jobSnap = await getDoc(jobRef);

        if (jobSnap.exists()) {
            const currentApplicants = jobSnap.data().applicants || [];
            await updateDoc(jobRef, {
                applicants: [...currentApplicants, userId]
            });
        }

        return true;
    } catch (error) {
        console.error('Error applying for job:', error);
        throw error;
    }
};

// Get jobs by recruiter
export const getJobsByRecruiter = async (recruiterId: string): Promise<Job[]> => {
    try {
        const q = query(
            collection(db, 'jobs'),
            where('recruiterId', '==', recruiterId),
            orderBy('postedDate', 'desc')
        );
        const querySnapshot = await getDocs(q);

        const jobs: Job[] = [];
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            jobs.push({
                id: doc.id,
                ...data,
                postedDate: data.postedDate?.toDate() || new Date(),
                deadline: data.deadline?.toDate()
            } as Job);
        });

        return jobs;
    } catch (error) {
        console.error('Error getting recruiter jobs:', error);
        return [];
    }
};