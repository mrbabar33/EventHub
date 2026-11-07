const Event = require('../models/Event');

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// GET /api/events?category=concert&search=music
exports.getEvents = async (req, res, next) => {
  try {
    const { category, search } = req.query;
    const filter = {};

    if (category && category !== 'all') filter.category = category;

    if (search) {
      const rx = new RegExp(escapeRegex(search), 'i');
      filter.$or = [{ title: rx }, { venue: rx }, { description: rx }];
    }

    const events = await Event.find(filter).sort({ date: 1 });
    res.json(events);
  } catch (err) { next(err); }
};

// GET /api/events/:id
exports.getEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event nahi mila' });
    res.json(event);
  } catch (err) { next(err); }
};