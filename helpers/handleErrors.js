const { validationResult } = require('express-validator/check');

exports.isValidRequest = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(402).json({
      errors: errors.array()
    });
  }
  return true;
};