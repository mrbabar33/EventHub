const router = require('express').Router();
const { protect } = require('../middleware/authMiddleware');
const { createBooking, myBookings, getBooking } = require('../controllers/bookingController');

router.post('/', protect, createBooking);
router.get('/my', protect, myBookings);   // /:id se pehle hona zaroori hai
router.get('/:id', protect, getBooking);

module.exports = router;