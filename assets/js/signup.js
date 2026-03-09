// ============================================================
// signup.js — Sign Up Page Logic
// Handles form submission and validation.
// Depends on: db.js, auth.js
// ============================================================

const signupForm = document.getElementById("signup-form");
const msgBox     = document.getElementById("auth-message");

signupForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  msgBox.className   = "auth-message";
  msgBox.textContent = "";

  const username  = document.getElementById("username").value.trim();
  const email     = document.getElementById("email").value.trim();
  const password  = document.getElementById("password").value;
  const confirmPw = document.getElementById("confirm-password").value;

  // ── Client-side validation ──
  if (!username) {
    msgBox.textContent = "Please enter a username.";
    msgBox.classList.add("error");
    return;
  }

  if (password !== confirmPw) {
    msgBox.textContent = "Passwords don't match. Please try again.";
    msgBox.classList.add("error");
    return;
  }

  // ── Create account ──
  const error = await signUp(username, email, password);
  if (error) {
    msgBox.textContent = error;
    msgBox.classList.add("error");
  }
});
