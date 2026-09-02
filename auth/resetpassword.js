import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFunctions, httpsCallable } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-functions.js";

const firebaseConfig = {
  apiKey: "AIzaSyD2dnVrNfzx8ktUT4s2ocJ5Q2-VhJR66A4",
  authDomain: "boomer-431e6.firebaseapp.com",
  projectId: "boomer-431e6",
  storageBucket: "boomer-431e6.firebasestorage.app",
  messagingSenderId: "481343133195",
  appId: "1:481343133195:web:ef20f718dd4ae4e574990e"
};

const app = initializeApp(firebaseConfig);
const functions = getFunctions(app);
const resetPasswordWithOTP = httpsCallable(functions, 'resetPasswordWithOTP');

const userEmail = localStorage.getItem('resetEmail');
document.getElementById('emailText').innerText = "Resetting password for: " + userEmail;

document.getElementById('reset').addEventListener('click', async () => {
    const newPassword = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm').value;

    if(newPassword === "" || confirmPassword === ""){
        alert("Please fill all fields");
        return;
    }
    if(newPassword !== confirmPassword){
        alert("Passwords do not match");
        return;
    }

    try {
        // CALL CLOUD FUNCTION - NO LOGIN NEEDED
        await resetPasswordWithOTP({email: userEmail, newPassword: newPassword});
        
        alert("Password changed successfully!");
        localStorage.removeItem('resetEmail');
        window.location.href = "../interlock/interlock.html";

    } catch (error) {
        alert("Error: " + error.message);
    }
});