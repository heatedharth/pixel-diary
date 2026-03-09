// ============================================================
// login.js — Login Page Logic
// Handles form submission and forgot password flow.
// Depends on: db.js, auth.js
// ============================================================

const loginForm  = document.getElementById("login-form");
const msgBox     = document.getElementById("auth-message");
const forgotLink = document.getElementById("forgot-link");

// ── Handle Login ──
loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  msgBox.className   = "auth-message";
  msgBox.textContent = "";

  const email    = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  const error = await logIn(email, password);
  if (error) {
    msgBox.textContent = error;
    msgBox.classList.add("error");
  }
});

// ── Handle Forgot Password ──
forgotLink.addEventListener("click", async (e) => {
  e.preventDefault();
  const email = document.getElementById("email").value.trim();

  if (!email) {
    msgBox.className   = "auth-message error";
    msgBox.textContent = "Enter your email above first.";
    return;
  }

  const error = await resetPassword(email);
  msgBox.className = "auth-message";
  if (error) {
    msgBox.textContent = error;
    msgBox.classList.add("error");
  } else {
    msgBox.textContent = "Password reset email sent! Check your inbox.";
    msgBox.classList.add("success");
  }
});
