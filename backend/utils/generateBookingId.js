const Booking = require('../models/Booking');

// BK-2026-4521 jaisa unique ID
async function generateBookingId() {
  const year = new Date().getFullYear();

  for (let i = 0; i < 10; i++) {
    const id = `BK-${year}-${Math.floor(1000 + Math.random() * 9000)}`;
    const exists = await Booking.exists({ bookingId: id });
    if (!exists) return id;
  }
  // Bohat zyada bookings hon to lamba ID
  return `BK-${year}-${Date.now().toString().slice(-8)}`;
}

module.exports = generateBookingId;