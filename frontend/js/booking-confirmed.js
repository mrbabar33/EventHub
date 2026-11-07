const ticket = document.getElementById('ticket');
const bookingId = new URLSearchParams(location.search).get('id');

function renderTicket(b) {
  const ev = b.event || {};
  ticket.innerHTML = `
    <div class="qr-box">
      <img id="qrImg" src="${b.qrCode}" alt="QR Code">
      <small>Scan this QR code at entry</small>
    </div>
    <div class="ticket-rows">
      <div class="ticket-row"><span>Booking ID</span><strong>${escapeHtml(b.bookingId)}</strong></div>
      <div class="ticket-row"><span>Event</span><strong>${escapeHtml(ev.title)}</strong></div>
      <div class="ticket-row"><span>Date</span><strong>${formatDate(ev.date)}</strong></div>
      <div class="ticket-row"><span>Tickets</span><strong>${b.tickets} × Standard</strong></div>
      <div class="ticket-row"><span>Total Paid</span><strong>${formatPrice(b.totalPaid)}</strong></div>
    </div>
    <div class="ticket-actions">
      <button class="btn btn-outline" id="downloadBtn">Download</button>
      <button class="btn btn-primary" id="printBtn">Print</button>
    </div>`;

  document.getElementById('printBtn').addEventListener('click', () => window.print());

  document.getElementById('downloadBtn').addEventListener('click', () => {
    const a = document.createElement('a');
    a.href = b.qrCode;
    a.download = `ticket-${b.bookingId}.png`;
    a.click();
  });
}

async function init() {
  if (!requireAuth()) return;

  // Pehle sessionStorage se try karo, warna server se lo
  const saved = JSON.parse(sessionStorage.getItem('lastBooking') || 'null');
  if (saved && (saved._id === bookingId || saved.bookingId === bookingId)) {
    return renderTicket(saved);
  }

  try {
    renderTicket(await BookingsAPI.getOne(bookingId));
  } catch (err) {
    ticket.innerHTML = `<p class="muted center">${escapeHtml(err.message)}</p>`;
  }
}

init();