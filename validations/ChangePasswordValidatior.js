const { body } = require('express-validator');

module.exports = [
    body(['oldPassword'])
        .exists()
        .isLength({ min: 8 })
        .withMessage('Old password is required and min length is 8 chars'),

    body(['newPassword'])
        .exists()
        .isLength({ min: 8 })
        .withMessage('New password is required and min length is 8 chars'),

    body(['newPasswordRepeat'])
        .exists()
        .isLength({ min: 8 })
        .withMessage(
            'New password repeat is required and min length is 8 chars'
        )
];
