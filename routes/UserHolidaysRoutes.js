const UserHolidaysController = require('../controllers/UserHolidaysController');
const HolidaysValidator = require('../validations/HolidaysValidator');
const AuthenticationController = require('../controllers/AuthenticationController');
const isUser = require('../middlewares/isUser');

module.exports = app => {
    app.get(
        '/employees/:id/holidays',
        AuthenticationController.verifyToken,
        isUser.verifyUser,
        UserHolidaysController.showHolidays
    );

    app.get(
        '/employees/:id/holidaysRequests',
        AuthenticationController.verifyToken,
        isUser.verifyUser,
        UserHolidaysController.showRequests
    );

    app.post(
        '/employees/:id/holidays',
        AuthenticationController.verifyToken,
        isUser.verifyUser,
        HolidaysValidator,
        UserHolidaysController.create
    );

    app.put(
        '/employees/:id/holidays/:holidayId',
        AuthenticationController.verifyToken,
        isUser.verifyUser,
        HolidaysValidator,
        UserHolidaysController.update
    );

    app.delete(
        '/employees/:id/holidays/:holidays_id',
        AuthenticationController.verifyToken,
        isUser.verifyUser,
        UserHolidaysController.delete
    );
};
