// Booking banane ka kaam: event-details.js isko call karta hai
async function bookEvent(eventId, tickets) {
  if (!requireAuth()) return;

  const booking = await BookingsAPI.create(eventId, tickets);

  // Confirmed page ke liye save kar lo
  sessionStorage.setItem('lastBooking', JSON.stringify(booking));
  location.href = 'booking-confirmed.html?id=' + (booking._id || booking.bookingId);
}