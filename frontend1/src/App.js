// 📄 frontend/src/App.js - COMPLETE LOGIN SYSTEM
import React, { useState, useEffect } from 'react';
import { auth, db } from './firebase/firebaseConfig';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged 
} from 'firebase/auth';
import { collection, addDoc } from 'firebase/firestore';
import './App.css';

function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
      console.log('User:', currentUser);
    });
    return unsubscribe;
  }, []);

  // 1. SIGN UP - Create new account
  const handleSignUp = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const newUser = userCredential.user;
      
      // Save user to Firestore database
      await addDoc(collection(db, "users"), {
        uid: newUser.uid,
        email: newUser.email,
        createdAt: new Date(),
        userType: "job_seeker" // or "employer"
      });
      
      alert('Account created! User saved to database.');
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  // 2. SIGN IN - Login existing user
  const handleSignIn = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert('Logged in successfully!');
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  // 3. LOGOUT
  const handleLogout = async () => {
    try {
      await signOut(auth);
      alert('Logged out!');
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="App" style={{ padding: '20px' }}>
      <h1>JOBNEXIS Job Portal</h1>
      
      {user ? (
        // SHOW WHEN LOGGED IN
        <div>
          <h2>Welcome, {user.email}!</h2>
          <p>User ID: {user.uid}</p>
          <button onClick={handleLogout} style={{ padding: '10px 20px', margin: '10px' }}>
            Logout
          </button>
          
          {/* Job Seeker Features (Add these later) */}
          <div style={{ marginTop: '30px' }}>
            <h3>Job Seeker Dashboard</h3>
            <button>Browse Jobs</button>
            <button>Upload Resume</button>
          </div>
        </div>
      ) : (
        // SHOW LOGIN FORM WHEN NOT LOGGED IN
        <div>
          <h2>Login / Sign Up</h2>
          <div style={{ margin: '20px 0' }}>
            <input 
              type="email" 
              placeholder="Email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ padding: '10px', margin: '5px', width: '250px' }}
            />
            <br />
            <input 
              type="password" 
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ padding: '10px', margin: '5px', width: '250px' }}
            />
          </div>
          
          <button 
            onClick={handleSignIn}
            style={{ padding: '10px 20px', margin: '5px', backgroundColor: '#4CAF50', color: 'white' }}
          >
            Sign In
          </button>
          
          <button 
            onClick={handleSignUp}
            style={{ padding: '10px 20px', margin: '5px', backgroundColor: '#008CBA', color: 'white' }}
          >
            Sign Up
          </button>
          
          <p style={{ marginTop: '20px', color: '#666' }}>
            Try: test@example.com / password123
          </p>
        </div>
      )}
      
      <div style={{ marginTop: '40px', padding: '20px', backgroundColor: '#f5f5f5' }}>
        <h3>Firebase Status</h3>
        <p>✅ Authentication: Ready</p>
        <p>✅ Firestore Database: Ready</p>
        <p>✅ React App: Running on localhost:3000</p>
      </div>
    </div>
  );
}

export default App;