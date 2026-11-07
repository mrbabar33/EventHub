const box = document.getElementById('eventDetails');
const eventId = new URLSearchParams(location.search).get('id');

async function loadEvent() {
  if (!eventId) { box.innerHTML = '<p class="muted">Event nahi mila.</p>'; return; }

  try {
    const e = await EventsAPI.getOne(eventId);
    const cat = CATEGORY_INFO[e.category] || { label: e.category, icon: '' };
    const soldOut = e.seatsLeft <= 0;

    box.innerHTML = `
      <div class="detail-main">
        <div class="detail-banner cat-${e.category}">
          <small>${cat.icon} ${cat.label}</small>
          <h1>${escapeHtml(e.title)}</h1>
        </div>
        <div class="detail-content">
          <ul class="detail-info">
            <li>📅 ${formatDate(e.date)}</li>
            <li>📍 ${escapeHtml(e.venue)}</li>
            <li>💺 ${e.seatsLeft} seats left</li>
          </ul>
          <h3>About this event</h3>
          <p>${escapeHtml(e.description || 'Details jald aayengi.')}</p>
        </div>
      </div>

      <aside class="booking-box">
        <h3>Book tickets</h3>
        <p class="booking-price">${formatPrice(e.price)}</p>
        <p id="bookError" class="error" hidden></p>

        <label for="qty">Tickets</label>
        <select id="qty" ${soldOut ? 'disabled' : ''}>
          ${Array.from({ length: Math.min(10, Math.max(e.seatsLeft, 1)) }, (_, i) =>
            `<option value="${i + 1}">${i + 1}</option>`).join('')}
        </select>

        <div class="total-row"><span>Total</span><span id="total">${formatPrice(e.price)}</span></div>
        <button id="bookBtn" class="btn btn-primary btn-block" ${soldOut ? 'disabled' : ''}>
          ${soldOut ? 'Sold Out' : 'Book Now'}
        </button>
      </aside>`;

    const qty = document.getElementById('qty');
    const total = document.getElementById('total');
    const bookBtn = document.getElementById('bookBtn');
    const errBox = document.getElementById('bookError');

    qty.addEventListener('change', () => {
      total.textContent = formatPrice(e.price * Number(qty.value));
    });

    bookBtn.addEventListener('click', async () => {
      bookBtn.disabled = true;
      bookBtn.textContent = 'Booking...';
      errBox.hidden = true;
      try {
        await bookEvent(e._id, Number(qty.value));
      } catch (err) {
        errBox.textContent = err.message;
        errBox.hidden = false;
        bookBtn.disabled = false;
        bookBtn.textContent = 'Book Now';
      }
    });
  } catch (err) {
    box.innerHTML = `<p class="muted">${escapeHtml(err.message)}</p>`;
  }
}

loadEvent();