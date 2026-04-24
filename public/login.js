const container = document.getElementById("container");
const registerBtn = document.getElementById("register");
const loginBtn = document.getElementById("login");

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
                const response = await fetch('http://localhost:5000/api/signup', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                });

                const data = await response.json();

                if (response.ok) {
                    alert('Signup successful! Please sign in.');
                    container.classList.remove("active"); // Switch to login view
                } else {
                    alert('Signup failed: ' + (data.error || 'User might already exist'));
                }
            } catch (error) {
                console.error('Error:', error);
                alert('Cannot connect to server. Make sure node server.js is running!');
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
                const response = await fetch('http://localhost:5000/api/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                });

                const data = await response.json();

                if (response.ok) {
                    // IMPORTANT: Store the token and email for the dashboard to use
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('userEmail', email);
                    window.location.href = 'index.html'; 
                } else {
                    alert('Login failed: ' + (data.error || 'Invalid credentials'));
                }
            } catch (error) {
                console.error('Error:', error);
                alert('Cannot connect to server. Check your terminal!');
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