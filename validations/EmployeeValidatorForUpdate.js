const { body } = require('express-validator');

module.exports = [
    body(['email'])
        .exists()
        .isLength({ min: 5 })
        .isEmail()
        .withMessage('Email is required and min length is 5 chars'),

    body(['name'])
        .exists()
        .isString()
        .isLength({ min: 3, max: 20 })
        .withMessage(
            'Invalid name format. Min length is 3 chars. Max length is 20 chars'
        ),

    body(['surname'])
        .exists()
        .isString()
        .isLength({ min: 3, max: 30 })
        .withMessage(
            'Invalid surname format. Min length is 3 chars. Max length is 30 chars'
        ),

    body(['birthdate'])
        .exists()
        .isISO8601()
        .toDate()
        .withMessage('Invalid date format'),

    body(['days_left'])
        .exists()
        .isInt()
        .withMessage('Invalid days_left format')
];
