require('dotenv').config();
const mongoose = require('mongoose');
const Event = require('../models/Event');

const events = [
  // Concerts
  { title: 'Spring Music Festival', category: 'concert', date: '2026-10-12', venue: 'Main Auditorium', price: 500, seatsLeft: 120,
    description: 'An evening of live performances featuring student bands, spoken word, and guest artists. Doors open at 5:30 PM. Food stalls and merchandise available on-site.' },
  { title: 'Battle of the Bands', category: 'concert', date: '2026-10-20', venue: 'Open Air Ground', price: 300, seatsLeft: 200,
    description: 'Top university bands compete for the championship trophy. Come support your favourite band.' },
  { title: 'Sufi Night', category: 'concert', date: '2026-11-05', venue: 'City Hall', price: 400, seatsLeft: 150,
    description: 'A soulful evening of Sufi music and qawwali by renowned artists.' },

  // Seminars
  { title: 'AI in Web Engineering', category: 'seminar', date: '2026-10-18', venue: 'Seminar Hall', price: 0, seatsLeft: 40,
    description: 'Learn how AI tools are changing modern web development, with live demos and Q&A.' },
  { title: 'Career Guidance Workshop', category: 'seminar', date: '2026-10-25', venue: 'Room 204', price: 0, seatsLeft: 60,
    description: 'Industry experts share tips on CVs, interviews and building a career after graduation.' },
  { title: 'Entrepreneurship Talk', category: 'seminar', date: '2026-11-08', venue: 'Auditorium B', price: 100, seatsLeft: 80,
    description: 'Successful founders talk about starting and growing a business from scratch.' },

  // University
  { title: 'Annual Sports Gala', category: 'university', date: '2026-11-02', venue: 'Sports Complex', price: 200, seatsLeft: 300,
    description: 'A full day of inter-department sports competitions, finals and prize distribution.' },
  { title: 'Freshers Orientation', category: 'university', date: '2026-09-30', venue: 'Main Ground', price: 0, seatsLeft: 500,
    description: 'Welcome event for new students: campus tour, society stalls and introductions.' },
  { title: 'Literary Society Debate', category: 'university', date: '2026-11-15', venue: 'Room 101', price: 0, seatsLeft: 70,
    description: 'Inter-university debate competition on current social topics.' }
];

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    await Event.deleteMany({});
    await Event.insertMany(events);
    console.log(`${events.length} events add ho gaye`);
  } catch (err) {
    console.error(err.message);
  } finally {
    await mongoose.disconnect();
  }
})();