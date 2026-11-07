(function renderNavbar() {
  const el = document.getElementById('navbar');
  if (!el) return;

  el.className = 'navbar';
  const user = getUser();
  const path = location.pathname;
  const active = (name) => (path.endsWith(name) ? 'active' : '');
  const isHome = path.endsWith('/') || path.endsWith('index.html');

  el.innerHTML = `
    <div class="nav-inner">
      <a href="${PREFIX}index.html" class="logo">EventHub</a>

      <nav class="nav-links" id="navLinks">
        <a href="${PREFIX}index.html" class="${isHome ? 'active' : ''}">Home</a>
        <a href="${PREFIX}pages/browse.html" class="${active('browse.html')}">Browse Events</a>
        <a href="${PREFIX}pages/my-bookings.html" class="${active('my-bookings.html')}">My Bookings</a>
      </nav>

      <div class="nav-right">
        ${user
          ? `<div class="avatar" title="${escapeHtml(user.name)}">${escapeHtml(user.name.charAt(0).toUpperCase())}</div>
             <button class="logout-btn" id="logoutBtn">Logout</button>`
          : `<a class="nav-login" href="${PREFIX}pages/login.html">Login</a>`}
      </div>

      <button class="menu-toggle" id="menuToggle" aria-label="Menu">☰</button>
    </div>`;

  document.getElementById('menuToggle').addEventListener('click', () => {
    document.getElementById('navLinks').classList.toggle('open');
  });

  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) logoutBtn.addEventListener('click', logout);
})();