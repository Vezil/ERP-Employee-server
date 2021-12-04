const { body } = require('express-validator');

module.exports = [
    body(['contract_length'])
        .exists()
        .isLength({ min: 1, max: 2 })
        .isInt()
        .isIn(['1', '3', '6', '12'])
        .withMessage('Invalid type of contract. It must be number (1/3/6/12)'),

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
        .withMessage('Id required'),

    body(['holidays_per_year'])
        .exists()
        .isLength({ min: 2, max: 2 })
        .isInt()
        .isIn(['20', '26'])
        .withMessage('Invalid type of holidays. It must be number (20/26)')
];
