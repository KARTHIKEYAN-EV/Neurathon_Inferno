// 📄 frontend/src/test-firebase.js
import app from './firebase/firebaseConfig.js';  // CORRECT PATH

console.log("🎉 Firebase Connected Successfully!");
console.log("App Name:", app.name);
console.log("Project:", app.options.projectId);