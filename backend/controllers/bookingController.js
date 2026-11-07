const mongoose = require('mongoose');
const Event = require('../models/Event');
const Booking = require('../models/Booking');
const generateBookingId = require('../utils/generateBookingId');
const generateQR = require('../utils/generateQR');
const sendEmail = require('../utils/sendEmail');

// POST /api/bookings   body: { eventId, tickets }
exports.createBooking = async (req, res, next) => {
  try {
    const { eventId, tickets } = req.body;
    const qty = Number(tickets);

    if (!mongoose.isValidObjectId(eventId)) {
      return res.status(400).json({ message: 'Event ID galat hai' });
    }
    if (!Number.isInteger(qty) || qty < 1 || qty > 10) {
      return res.status(400).json({ message: 'Tickets 1 se 10 ke beech honi chahiye' });
    }

    // Seats ek hi step mein check + kam hoti hain (do log ek sath book karein to bhi safe)
    const event = await Event.findOneAndUpdate(
      { _id: eventId, seatsLeft: { $gte: qty } },
      { $inc: { seatsLeft: -qty } },
      { new: true }
    );

    if (!event) {
      const exists = await Event.exists({ _id: eventId });
      return res.status(exists ? 400 : 404).json({
        message: exists ? 'Itni seats available nahi hain' : 'Event nahi mila'
      });
    }

    try {
      const bookingId = await generateBookingId();
      const qrCode = await generateQR(
        JSON.stringify({ bookingId, event: event.title, tickets: qty })
      );

      const booking = await Booking.create({
        bookingId,
        user: req.user._id,
        event: event._id,
        tickets: qty,
        totalPaid: event.price * qty,
        qrCode
      });

      await booking.populate('event');

      // Email fail ho to booking cancel nahi hoti
      sendEmail({
        to: req.user.email,
        subject: `Booking Confirmed - ${event.title}`,
        html: `
          <h2>Booking Confirmed!</h2>
          <p>Booking ID: <b>${bookingId}</b></p>
          <p>Event: ${event.title}</p>
          <p>Date: ${event.date.toDateString()}</p>
          <p>Tickets: ${qty}</p>
          <p>Total Paid: Rs. ${booking.totalPaid}</p>
          <img src="${qrCode}" alt="QR Code" width="200">`
      }).catch(e => console.error('Email error:', e.message));

      res.status(201).json(booking);
    } catch (err) {
      // Booking na bani to seats wapas kar do
      await Event.findByIdAndUpdate(event._id, { $inc: { seatsLeft: qty } });
      throw err;
    }
  } catch (err) { next(err); }
};

// GET /api/bookings/my
exports.myBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate('event')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) { next(err); }
};

// GET /api/bookings/:id   (_id ya bookingId dono chalta hai)
exports.getBooking = async (req, res, next) => {
  try {
    const { id } = req.params;
    const query = mongoose.isValidObjectId(id)
      ? { _id: id, user: req.user._id }
      : { bookingId: id, user: req.user._id };

    const booking = await Booking.findOne(query).populate('event');
    if (!booking) return res.status(404).json({ message: 'Booking nahi mili' });

    res.json(booking);
  } catch (err) { next(err); }
};