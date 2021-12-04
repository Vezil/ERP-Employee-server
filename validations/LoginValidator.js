const { body } = require('express-validator');

module.exports = [
    body(['email'])
        .exists()
        .isLength({ min: 5 })
        .isEmail()
        .withMessage('Email is required and min length is 5 chars'),

    body(['password'])
        .exists()
        .isLength({ min: 8 })
        .withMessage('Password is required and min length is 8 chars')
];
