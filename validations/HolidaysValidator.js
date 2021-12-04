const { body } = require('express-validator');

module.exports = [
    body(['start_date'])
        .exists()
        .isISO8601()
        .toDate()
        .withMessage('Invalid date format'),

    body(['finish_date'])
        .exists()
        .isISO8601()
        .toDate()
        .withMessage('Invalid date format'),

    body(['user_id'])
        .exists()
        .isLength({ min: 1 })
        .isInt()
        .withMessage('Id required')
];
