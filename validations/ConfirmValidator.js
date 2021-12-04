const { body } = require('express-validator');

module.exports = [
    body(['confirmed'])
        .exists()
        .isBoolean()
        .withMessage('Something wrong with confirm')
];
