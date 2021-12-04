const AuthenticationController = require('../controllers/AuthenticationController');
const LoginValidator = require('../validations/LoginValidator');
const ChangePasswordValidator = require('../validations/ChangePasswordValidatior');

module.exports = app => {
    app.post('/login', LoginValidator, AuthenticationController.login);
    app.put(
        '/auth/changePassword',
        ChangePasswordValidator,
        AuthenticationController.verifyToken,
        AuthenticationController.changePassword
    );
};
