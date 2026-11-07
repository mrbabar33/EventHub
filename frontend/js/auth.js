function getToken() { return localStorage.getItem('token'); }

function getUser() {
  try { return JSON.parse(localStorage.getItem('user')); }
  catch { return null; }
}

function saveAuth(data) {
  localStorage.setItem('token', data.token);
  localStorage.setItem('user', JSON.stringify(data.user));
}

function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  location.href = PREFIX + 'index.html';
}

// Login zaroori wale pages par call karo
function requireAuth() {
  if (!getToken()) {
    const back = encodeURIComponent(location.pathname + location.search);
    location.href = PREFIX + 'pages/login.html?redirect=' + back;
    return false;
  }
  return true;
}

function showAuthError(msg) {
  const box = document.getElementById('authError');
  if (!box) return;
  box.textContent = msg;
  box.hidden = false;
}

function afterAuth() {
  const redirect = new URLSearchParams(location.search).get('redirect');
  location.href = redirect ? decodeURIComponent(redirect) : PREFIX + 'index.html';
}

// Login form
const loginForm = document.getElementById('loginForm');
if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    try {
      const data = await apiFetch('/auth/login', {
        method: 'POST',
        body: JSON.stringify({
          email: document.getElementById('email').value.trim(),
          password: document.getElementById('password').value
        })
      });
      saveAuth(data);
      afterAuth();
    } catch (err) { showAuthError(err.message); }
  });
}

// Register form
const registerForm = document.getElementById('registerForm');
if (registerForm) {
  registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    try {
      const data = await apiFetch('/auth/register', {
        method: 'POST',
        body: JSON.stringify({
          name: document.getElementById('name').value.trim(),
          email: document.getElementById('email').value.trim(),
          password: document.getElementById('password').value
        })
      });
      saveAuth(data);
      afterAuth();
    } catch (err) { showAuthError(err.message); }
  });
}