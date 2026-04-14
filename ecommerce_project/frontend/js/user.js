// Check if user is logged in
const token = localStorage.getItem("access");

if (!token) {
    // ❌ No token → go back to login
    window.location.href = "login.html";
}