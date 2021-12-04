const HolidaysController = require('../controllers/HolidaysController');
const HolidaysValidator = require('../validations/HolidaysValidator');
const ConfirmValidator = require('../validations/ConfirmValidator');
const AuthenticationController = require('../controllers/AuthenticationController');
const isAdmin = require('../middlewares/isAdmin');

module.exports = app => {
    app.get(
        '/holidays',
        AuthenticationController.verifyToken,
        isAdmin.verifyAdmin,
        HolidaysController.show
    );

    app.post(
        '/holidays',
        AuthenticationController.verifyToken,
        isAdmin.verifyAdmin,
        HolidaysValidator,
        HolidaysController.create
    );

    app.put(
        '/holidays/:id',
        AuthenticationController.verifyToken,
        isAdmin.verifyAdmin,
        HolidaysValidator,
        HolidaysController.update
    );

    app.put(
        '/holidays/:id/confirm',
        AuthenticationController.verifyToken,
        isAdmin.verifyAdmin,
        ConfirmValidator,
        HolidaysController.confirm
    );

    app.delete(
        '/holidays/:id',
        AuthenticationController.verifyToken,
        isAdmin.verifyAdmin,
        HolidaysController.delete
    );
};
