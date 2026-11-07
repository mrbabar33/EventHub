const list = document.getElementById('bookingsList');

async function loadBookings() {
  if (!requireAuth()) return;

  try {
    const bookings = await BookingsAPI.mine();

    if (!bookings.length) {
      list.innerHTML = `<p class="muted">Abhi koi booking nahi. <a href="browse.html" style="color:var(--teal);font-weight:600">Events dekho</a></p>`;
      return;
    }

    list.innerHTML = bookings.map(b => {
      const ev = b.event || {};
      return `
        <div class="booking-item">
          <div>
            <h3>${escapeHtml(ev.title)}</h3>
            <p class="meta">${formatDate(ev.date)} · ${escapeHtml(ev.venue)}</p>
            <p class="meta">${escapeHtml(b.bookingId)} · ${b.tickets} ticket(s)</p>
          </div>
          <div class="booking-right">
            <span class="price">${formatPrice(b.totalPaid)}</span>
            <a href="booking-confirmed.html?id=${b._id}">View ticket →</a>
          </div>
        </div>`;
    }).join('');
  } catch (err) {
    list.innerHTML = `<p class="muted">${escapeHtml(err.message)}</p>`;
  }
}

loadBookings();