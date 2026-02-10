// frontend/src/lib/profileService.ts
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from './firebase';
import { toast } from '@/hooks/use-toast';

export interface StudentProfile {
  uid: string;
  name: string;
  email: string;
  phone: string;
  college: string;
  degree: string;
  graduationYear: string;
  bio: string;
  skills: string[];
  linkedin: string;
  github: string;
  resumeUrl?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Get current user's profile from Firestore
export const getProfile = async (): Promise<StudentProfile> => {
  try {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('No user logged in');
    }

    const profileRef = doc(db, 'users', user.uid);
    const profileSnap = await getDoc(profileRef);

    if (profileSnap.exists()) {
      const data = profileSnap.data();
      return {
        uid: user.uid,
        name: data.name || user.displayName || 'Student User',
        email: data.email || user.email || '',
        phone: data.phone || '+91 9876543210',
        college: data.college || 'IIT Delhi',
        degree: data.degree || 'B.Tech Computer Science',
        graduationYear: data.graduationYear || '2026',
        bio: data.bio || 'Passionate about technology and building impactful solutions.',
        skills: data.skills || ['React', 'TypeScript', 'Python', 'Node.js'],
        linkedin: data.linkedin || '',
        github: data.github || '',
        resumeUrl: data.resumeUrl || '',
        createdAt: data.createdAt?.toDate(),
        updatedAt: data.updatedAt?.toDate()
      };
    } else {
      // Create default profile if doesn't exist
      const defaultProfile: StudentProfile = {
        uid: user.uid,
        name: user.displayName || 'Student User',
        email: user.email || '',
        phone: '+91 9876543210',
        college: 'IIT Delhi',
        degree: 'B.Tech Computer Science',
        graduationYear: '2026',
        bio: 'Passionate about technology and building impactful solutions.',
        skills: ['React', 'TypeScript', 'Python', 'Node.js'],
        linkedin: '',
        github: '',
        resumeUrl: ''
      };
      
      // Save default profile
      await setDoc(profileRef, {
        ...defaultProfile,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      
      return defaultProfile;
    }
  } catch (error: any) {
    console.error('Error getting profile:', error);
    // Return fallback profile
    return {
      uid: 'temp',
      name: 'Student User',
      email: 'student@example.com',
      phone: '+91 9876543210',
      college: 'IIT Delhi',
      degree: 'B.Tech Computer Science',
      graduationYear: '2026',
      bio: 'Passionate about technology and building impactful solutions.',
      skills: ['React', 'TypeScript', 'Python', 'Node.js'],
      linkedin: '',
      github: ''
    };
  }
};

// Update profile in Firestore
export const updateProfile = async (profileData: StudentProfile): Promise<StudentProfile> => {
  try {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('No user logged in');
    }

    const profileRef = doc(db, 'users', user.uid);
    
    // Get existing data to preserve createdAt
    const existingSnap = await getDoc(profileRef);
    const existingData = existingSnap.exists() ? existingSnap.data() : {};
    
    await setDoc(profileRef, {
      ...profileData,
      uid: user.uid,
      email: user.email, // Keep Firebase email
      createdAt: existingData.createdAt || new Date(),
      updatedAt: new Date()
    }, { merge: true });

    toast({
      title: 'Profile saved!',
      description: 'Your profile has been updated in the database.'
    });

    return profileData;
  } catch (error: any) {
    console.error('Error updating profile:', error);
    toast({
      title: 'Error saving profile',
      description: error.message || 'Please try again',
      variant: 'destructive'
    });
    throw error;
  }
};

// Create or update profile (for registration)
export const createOrUpdateProfile = async (profileData: Partial<StudentProfile>) => {
  try {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('No user logged in');
    }

    const profileRef = doc(db, 'users', user.uid);
    const existingSnap = await getDoc(profileRef);
    
    if (existingSnap.exists()) {
      // Update existing
      await updateDoc(profileRef, {
        ...profileData,
        updatedAt: new Date()
      });
    } else {
      // Create new
      await setDoc(profileRef, {
        uid: user.uid,
        email: user.email,
        ...profileData,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }
    
    return true;
  } catch (error) {
    console.error('Error saving profile:', error);
    throw error;
  }
};

// Upload resume URL
export const uploadResume = async (resumeUrl: string): Promise<boolean> => {
  try {
    const user = auth.currentUser;
    if (!user) return false;

    const profileRef = doc(db, 'users', user.uid);
    await updateDoc(profileRef, {
      resumeUrl: resumeUrl,
      updatedAt: new Date()
    });

    return true;
  } catch (error) {
    console.error('Error uploading resume:', error);
    return false;
  }
};