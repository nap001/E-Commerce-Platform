const mongoose = require('mongoose');
const HttpError = require('../utils/HttpError');

/** Rejects requests whose `:param` is not a valid Mongo ObjectId (instead of a 500). */
const validateObjectId =
  (param = 'id') =>
  (req, res, next) => {
    if (!mongoose.isValidObjectId(req.params[param])) {
      return next(new HttpError(404, 'Resource not found'));
    }
    next();
  };

module.exports = validateObjectId;
