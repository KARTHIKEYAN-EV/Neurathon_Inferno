// frontend/src/lib/jobService.ts - CORRECTED VERSION
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

// Define types based on YOUR Firestore data structure
export interface InternshipJob {
    id: string;
    // Your actual fields from Firestore:
    title: string;
    companyName: string;
    description: string;
    location: string;
    stipend: number;
    duration: string;
    skillsRequired: string[];
    postedAt: string;
    applicationsCount: number;
    applicationDeadline?: string;
    isActive: boolean;
    needsReview: boolean;
    scamScore: number;
    scamFlags: string[];
    companyId: string;
    lastAnalyzed: string;
    viewsCount: number;
    
    // For compatibility with existing code:
    company?: string; // Alias for companyName
    type?: string;    // Always "internship"
    salaryMin?: number; // Alias for stipend
    salaryMax?: number; // Alias for stipend
    isVerified?: boolean; // Inverse of needsReview
    riskLevel?: string;   // Calculated from scamScore
    postedDate?: Date;    // Parsed from postedAt
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

// Add a new internship (for recruiters)
export const addInternship = async (jobData: Omit<InternshipJob, 'id' | 'postedAt' | 'applicationsCount'>) => {
    try {
        const jobRef = await addDoc(collection(db, 'internships'), {
            ...jobData,
            postedAt: serverTimestamp(),
            applicationsCount: 0,
            viewsCount: 0,
            scamScore: 0,
            scamFlags: [],
            needsReview: true,
            isActive: true,
            lastAnalyzed: serverTimestamp()
        });
        return jobRef.id;
    } catch (error) {
        console.error('Error adding internship:', error);
        throw error;
    }
};

// Get all internships - FIXED TO MATCH YOUR DATA
export const getAllJobs = async (): Promise<InternshipJob[]> => {
    try {
        console.log("📡 Fetching internships from Firestore...");
        
        const q = query(collection(db, 'internships'), orderBy('postedAt', 'desc'));
        const querySnapshot = await getDocs(q);

        console.log(`✅ Found ${querySnapshot.size} internships`);
        
        const jobs: InternshipJob[] = [];
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            
            // Log each document to debug
            console.log(`📄 ${doc.id}:`, data);
            
            // Calculate risk level from scam score
            const scamScore = data.scamScore || 0;
            let riskLevel = 'medium';
            if (scamScore < 0.3) riskLevel = 'low';
            if (scamScore > 0.7) riskLevel = 'high';
            
            const job: InternshipJob = {
                id: doc.id,
                // Your actual Firestore fields:
                title: data.title || "Internship Position",
                companyName: data.companyName || "Unknown Company",
                description: data.description || "",
                location: data.location || "Remote",
                stipend: data.stipend || 0,
                duration: data.duration || "Not specified",
                skillsRequired: data.skillsRequired || [],
                postedAt: data.postedAt ? data.postedAt : new Date().toISOString(),
                applicationsCount: data.applicationsCount || 0,
                applicationDeadline: data.applicationDeadline,
                isActive: data.isActive !== false,
                needsReview: data.needsReview || false,
                scamScore: scamScore,
                scamFlags: data.scamFlags || [],
                companyId: data.companyId || "",
                lastAnalyzed: data.lastAnalyzed || new Date().toISOString(),
                viewsCount: data.viewsCount || 0,
                
                // Compatibility fields:
                company: data.companyName || "Unknown Company", // Alias
                type: "internship",
                salaryMin: data.stipend || 0, // Alias for stipend
                salaryMax: data.stipend || 0, // Alias for stipend
                isVerified: !(data.needsReview || false),
                riskLevel: riskLevel,
                postedDate: data.postedAt ? new Date(data.postedAt) : new Date()
            };
            
            jobs.push(job);
        });

        console.log(`🎯 Returning ${jobs.length} processed jobs`);
        return jobs;
    } catch (error) {
        console.error('❌ Error getting jobs:', error);
        return [];
    }
};

// Get internship by ID
export const getJobById = async (jobId: string): Promise<InternshipJob | null> => {
    try {
        console.log(`🔍 Fetching job ${jobId}...`);
        const docRef = doc(db, 'internships', jobId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const data = docSnap.data();
            console.log("📋 Job data:", data);
            
            // Calculate risk level
            const scamScore = data.scamScore || 0;
            let riskLevel = 'medium';
            if (scamScore < 0.3) riskLevel = 'low';
            if (scamScore > 0.7) riskLevel = 'high';
            
            return {
                id: docSnap.id,
                // Your actual Firestore fields:
                title: data.title || "Internship Position",
                companyName: data.companyName || "Unknown Company",
                description: data.description || "",
                location: data.location || "Remote",
                stipend: data.stipend || 0,
                duration: data.duration || "Not specified",
                skillsRequired: data.skillsRequired || [],
                postedAt: data.postedAt ? data.postedAt : new Date().toISOString(),
                applicationsCount: data.applicationsCount || 0,
                applicationDeadline: data.applicationDeadline,
                isActive: data.isActive !== false,
                needsReview: data.needsReview || false,
                scamScore: scamScore,
                scamFlags: data.scamFlags || [],
                companyId: data.companyId || "",
                lastAnalyzed: data.lastAnalyzed || new Date().toISOString(),
                viewsCount: data.viewsCount || 0,
                
                // Compatibility fields:
                company: data.companyName || "Unknown Company",
                type: "internship",
                salaryMin: data.stipend || 0,
                salaryMax: data.stipend || 0,
                isVerified: !(data.needsReview || false),
                riskLevel: riskLevel,
                postedDate: data.postedAt ? new Date(data.postedAt) : new Date()
            };
        }
        
        console.log(`⚠️ Job ${jobId} not found`);
        return null;
    } catch (error) {
        console.error('❌ Error getting job:', error);
        return null;
    }
};

// Apply for a job
export const applyForJob = async (jobId: string, userId: string, userName: string, userEmail: string, resumeUrl: string) => {
    try {
        console.log(`📝 User ${userId} applying for job ${jobId}...`);
        
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

        // Update internship's applicationsCount
        const jobRef = doc(db, 'internships', jobId);
        const jobSnap = await getDoc(jobRef);

        if (jobSnap.exists()) {
            const currentCount = jobSnap.data().applicationsCount || 0;
            await updateDoc(jobRef, {
                applicationsCount: currentCount + 1
            });
            
            console.log(`✅ Application submitted. Total applications: ${currentCount + 1}`);
        }

        return true;
    } catch (error) {
        console.error('❌ Error applying for job:', error);
        throw error;
    }
};

// Get internships by company
export const getJobsByCompany = async (companyId: string): Promise<InternshipJob[]> => {
    try {
        console.log(`🏢 Fetching jobs for company ${companyId}...`);
        const q = query(
            collection(db, 'internships'),
            where('companyId', '==', companyId),
            orderBy('postedAt', 'desc')
        );
        const querySnapshot = await getDocs(q);

        console.log(`📊 Found ${querySnapshot.size} jobs for company ${companyId}`);
        
        const jobs: InternshipJob[] = [];
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            
            // Calculate risk level
            const scamScore = data.scamScore || 0;
            let riskLevel = 'medium';
            if (scamScore < 0.3) riskLevel = 'low';
            if (scamScore > 0.7) riskLevel = 'high';
            
            jobs.push({
                id: doc.id,
                // Your actual Firestore fields:
                title: data.title || "Internship Position",
                companyName: data.companyName || "Unknown Company",
                description: data.description || "",
                location: data.location || "Remote",
                stipend: data.stipend || 0,
                duration: data.duration || "Not specified",
                skillsRequired: data.skillsRequired || [],
                postedAt: data.postedAt ? data.postedAt : new Date().toISOString(),
                applicationsCount: data.applicationsCount || 0,
                applicationDeadline: data.applicationDeadline,
                isActive: data.isActive !== false,
                needsReview: data.needsReview || false,
                scamScore: scamScore,
                scamFlags: data.scamFlags || [],
                companyId: data.companyId || "",
                lastAnalyzed: data.lastAnalyzed || new Date().toISOString(),
                viewsCount: data.viewsCount || 0,
                
                // Compatibility fields:
                company: data.companyName || "Unknown Company",
                type: "internship",
                salaryMin: data.stipend || 0,
                salaryMax: data.stipend || 0,
                isVerified: !(data.needsReview || false),
                riskLevel: riskLevel,
                postedDate: data.postedAt ? new Date(data.postedAt) : new Date()
            });
        });

        return jobs;
    } catch (error) {
        console.error('❌ Error getting company jobs:', error);
        return [];
    }
};

// Get active internships only
export const getActiveJobs = async (): Promise<InternshipJob[]> => {
    try {
        const q = query(
            collection(db, 'internships'),
            where('isActive', '==', true),
            orderBy('postedAt', 'desc')
        );
        const querySnapshot = await getDocs(q);

        const jobs: InternshipJob[] = [];
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            
            // Calculate risk level
            const scamScore = data.scamScore || 0;
            let riskLevel = 'medium';
            if (scamScore < 0.3) riskLevel = 'low';
            if (scamScore > 0.7) riskLevel = 'high';
            
            jobs.push({
                id: doc.id,
                // Your actual Firestore fields:
                title: data.title || "Internship Position",
                companyName: data.companyName || "Unknown Company",
                description: data.description || "",
                location: data.location || "Remote",
                stipend: data.stipend || 0,
                duration: data.duration || "Not specified",
                skillsRequired: data.skillsRequired || [],
                postedAt: data.postedAt ? data.postedAt : new Date().toISOString(),
                applicationsCount: data.applicationsCount || 0,
                applicationDeadline: data.applicationDeadline,
                isActive: data.isActive !== false,
                needsReview: data.needsReview || false,
                scamScore: scamScore,
                scamFlags: data.scamFlags || [],
                companyId: data.companyId || "",
                lastAnalyzed: data.lastAnalyzed || new Date().toISOString(),
                viewsCount: data.viewsCount || 0,
                
                // Compatibility fields:
                company: data.companyName || "Unknown Company",
                type: "internship",
                salaryMin: data.stipend || 0,
                salaryMax: data.stipend || 0,
                isVerified: !(data.needsReview || false),
                riskLevel: riskLevel,
                postedDate: data.postedAt ? new Date(data.postedAt) : new Date()
            });
        });

        return jobs;
    } catch (error) {
        console.error('Error getting active jobs:', error);
        return [];
    }
};