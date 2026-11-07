const PREFIX = location.pathname.includes('/pages/') ? '../' : '';

const CATEGORY_INFO = {
  concert:    { label: 'Concert',    icon: '🎵' },
  seminar:    { label: 'Seminar',    icon: '📚' },
  university: { label: 'University', icon: '🎓' }
};

function formatPrice(price) {
  return Number(price) > 0 ? 'Rs. ' + Number(price).toLocaleString('en-PK') : 'Free';
}

function formatDate(date, withYear = true) {
  const opts = { month: 'short', day: 'numeric' };
  if (withYear) opts.year = 'numeric';
  return new Date(date).toLocaleDateString('en-US', opts);
}

function escapeHtml(str = '') {
  return String(str).replace(/[&<>"']/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[c]));
}

function eventCardHTML(e) {
  const cat = CATEGORY_INFO[e.category] || { label: e.category, icon: '' };
  return `
    <a class="event-card" href="${PREFIX}pages/event-details.html?id=${e._id}">
      <div class="card-banner cat-${e.category}">${cat.icon} ${cat.label}</div>
      <div class="card-body">
        <h3>${escapeHtml(e.title)}</h3>
        <p class="card-meta">${formatDate(e.date)} · ${escapeHtml(e.venue)}</p>
        <div class="card-foot">
          <span class="price">${formatPrice(e.price)}</span>
          <span class="seats">${e.seatsLeft} seats left</span>
        </div>
      </div>
    </a>`;
}

function renderEvents(events, container) {
  container.innerHTML = events.length
    ? events.map(eventCardHTML).join('')
    : '<p class="empty">Koi event nahi mila.</p>';
}