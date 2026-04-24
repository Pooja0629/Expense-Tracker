const container = document.getElementById("container");
const registerBtn = document.getElementById("register");
const loginBtn = document.getElementById("login");

// Use your live Render URL
const API_URL = "https://expense-tracker-5lur.onrender.com/api";

// Toggle between Sign In and Sign Up UI
if (registerBtn) {
    registerBtn.addEventListener("click", () => container.classList.add("active"));
}
if (loginBtn) {
    loginBtn.addEventListener("click", () => container.classList.remove("active"));
}

document.addEventListener('DOMContentLoaded', function() {
    // Handle Sign Up
    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        signupForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('signupEmail').value;
            const password = document.getElementById('signupPassword').value;

            try {
                // FIXED: Now points to live signup route
                const response = await fetch(`${API_URL}/signup`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                });

                const data = await response.json();

                if (response.ok) {
                    alert('Signup successful! Please sign in.');
                    container.classList.remove("active");
                } else {
                    alert('Signup failed: ' + (data.error || 'User might already exist'));
                }
            } catch (error) {
                console.error('Error:', error);
                alert('Cannot connect to server. Render might be sleeping, wait 1 minute!');
            }
        });
    }

    // Handle Login
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;

            try {
                // FIXED: Now points to live login route
                const response = await fetch(`${API_URL}/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                });

                const data = await response.json();

                if (response.ok) {
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('userEmail', email);
                    window.location.href = 'index.html'; 
                } else {
                    alert('Login failed: ' + (data.error || 'Invalid credentials'));
                }
            } catch (error) {
                console.error('Error:', error);
                alert('Cannot connect to server. Please try again in 1 minute.');
            }
        });
    }
});

// Password visibility toggle
function togglePassword(inputId, icon) {
    const passwordInput = document.getElementById(inputId);
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        icon.classList.replace('fa-eye', 'fa-eye-slash');
    } else {
        passwordInput.type = 'password';
        icon.classList.replace('fa-eye-slash', 'fa-eye');
    }
}