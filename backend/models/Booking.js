const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    bookingId: { type: String, required: true, unique: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
    tickets: { type: Number, required: true, min: 1 },
    totalPaid: { type: Number, required: true, min: 0 },
    qrCode: { type: String, required: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Booking', bookingSchema);