function notFound(req, res, next) {
  res.status(404).json({ message: 'Route nahi mila: ' + req.originalUrl });
}

function errorHandler(err, req, res, next) {
  console.error(err);

  // Galat MongoDB id
  if (err.name === 'CastError') {
    return res.status(404).json({ message: 'Record nahi mila' });
  }
  if (err.name === 'ValidationError') {
    return res.status(400).json({ message: Object.values(err.errors)[0].message });
  }

  res.status(err.status || 500).json({ message: err.message || 'Server error' });
}

module.exports = { notFound, errorHandler };