const notFound = (req, res) => {
  res.status(404).json({ msg: `Route not found: ${req.method} ${req.originalUrl}` });
};

// Express 5 forwards rejected promises from async handlers here automatically.
// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  let status = err.status || 500;
  let msg = err.message;

  if (err.name === 'ValidationError' && err.errors) {
    status = 400;
    msg = Object.values(err.errors)
      .map((e) => e.message)
      .join(', ');
  } else if (err.name === 'CastError') {
    status = 400;
    msg = `Invalid value for "${err.path}"`;
  } else if (err.code === 11000) {
    status = 409;
    msg = 'A record with that value already exists';
  } else if (err.type === 'entity.parse.failed') {
    status = 400;
    msg = 'Malformed JSON body';
  }

  if (status >= 500) {
    console.error(err);
    msg = 'Server error';
  }

  res.status(status).json({ msg });
};

module.exports = { notFound, errorHandler };
