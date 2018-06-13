const { validationResult } = require('express-validator/check');

exports.validationErrorsHandler = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    res.status(402).json({
      errors: errors.array()
    });
};