const EmployeesController = require('../controllers/EmployeesController');
const EmployeeValidator = require('../validations/EmployeeValidator');
const EmployeeValidatorForUpdate = require('../validations/EmployeeValidatorForUpdate');
const AuthenticationController = require('../controllers/AuthenticationController');
const isAdmin = require('../middlewares/isAdmin');
const isUser = require('../middlewares/isUser');

module.exports = app => {
    app.get(
        '/employees',
        AuthenticationController.verifyToken,
        isAdmin.verifyAdmin,
        EmployeesController.show
    );

    app.get(
        '/employees/:id',
        AuthenticationController.verifyToken,
        isUser.verifyUser,
        EmployeesController.getOne
    );

    app.post(
        '/employees',
        AuthenticationController.verifyToken,
        isAdmin.verifyAdmin,
        EmployeeValidator,
        EmployeesController.create
    );

    app.put(
        '/employees/:id',
        AuthenticationController.verifyToken,
        isAdmin.verifyAdmin,
        EmployeeValidatorForUpdate,
        EmployeesController.update
    );

    app.delete(
        '/employees/:id',
        AuthenticationController.verifyToken,
        isAdmin.verifyAdmin,
        EmployeesController.delete
    );
};
