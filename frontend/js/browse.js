const grid = document.getElementById('eventsGrid');
const filterBtns = document.querySelectorAll('.filter-btn');
const params = new URLSearchParams(location.search);
const searchTerm = params.get('search') || '';
let currentCategory = params.get('category') || 'all';

async function loadEvents() {
  grid.innerHTML = '<p class="empty">Loading...</p>';
  try {
    const events = await EventsAPI.getAll(currentCategory, searchTerm);
    renderEvents(events, grid);
  } catch (err) {
    grid.innerHTML = `<p class="empty">${escapeHtml(err.message)}</p>`;
  }
}

function setActive(category) {
  filterBtns.forEach(b => b.classList.toggle('active', b.dataset.category === category));
}

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    currentCategory = btn.dataset.category;
    setActive(currentCategory);
    loadEvents();
  });
});

if (searchTerm) {
  const note = document.createElement('p');
  note.className = 'search-note';
  note.textContent = `Search results for "${searchTerm}"`;
  document.querySelector('.filters').after(note);
}

setActive(currentCategory);
loadEvents();