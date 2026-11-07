const router = require('express').Router();
const { getEvents, getEvent } = require('../controllers/eventController');

router.get('/', getEvents);
router.get('/:id', getEvent);

module.exports = router;