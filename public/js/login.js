// login.js

// Modal elements
const loginModal = document.getElementById('loginModal');
const loginBtn = document.querySelector('.cta__login');
const closeLogin = document.getElementById('closeLogin');
const loginForm = document.getElementById('loginForm');

// Open modal on login button click
loginBtn.addEventListener('click', () => {
  loginModal.style.display = 'flex';
  loginModal.setAttribute('aria-hidden', 'false');
  loginForm.email.focus();
});

// Close modal on close button click
closeLogin.addEventListener('click', () => {
  closeLoginModal();
});

// Close modal on outside click
window.addEventListener('click', (e) => {
  if (e.target === loginModal) {
    closeLoginModal();
  }
});

// Close modal helper function
function closeLoginModal() {
  loginModal.style.display = 'none';
  loginModal.setAttribute('aria-hidden', 'true');
  loginForm.reset();
  loginBtn.focus();
}

// Form submit handler
loginForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const email = loginForm.email.value.trim();
  const password = loginForm.password.value.trim();

  if (!email || !password) {
    alert('Please enter email and password');
    return;
  }

  // Placeholder alert - replace with real backend integration
  alert(`Login successful for: ${email}\n(This is placeholder. Integrate backend for real login)`);

  closeLoginModal();
});
