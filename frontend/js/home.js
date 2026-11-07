const grid = document.getElementById('eventsGrid');
const filterBtns = document.querySelectorAll('.filter-btn');

async function loadEvents(category = 'all') {
  grid.innerHTML = '<p class="empty">Loading...</p>';
  try {
    const events = await EventsAPI.getAll(category);
    renderEvents(events, grid);
  } catch (err) {
    grid.innerHTML = `<p class="empty">${escapeHtml(err.message)}</p>`;
  }
}

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    loadEvents(btn.dataset.category);
  });
});

// Search: browse page par bhej do
document.getElementById('searchForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const q = document.getElementById('searchInput').value.trim();
  location.href = 'pages/browse.html' + (q ? '?search=' + encodeURIComponent(q) : '');
});

loadEvents();