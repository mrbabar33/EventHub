const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    category: { type: String, required: true, enum: ['concert', 'seminar', 'university'] },
    date: { type: Date, required: true },
    venue: { type: String, required: true },
    price: { type: Number, default: 0, min: 0 },
    seatsLeft: { type: Number, required: true, min: 0 },
    description: { type: String, default: '' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Event', eventSchema);