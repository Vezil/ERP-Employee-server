const ContractsController = require('../controllers/ContractsController');
const ContractValidator = require('../validations/ContractValidator');
const ContractValidatorForUpdate = require('../validations/ContractValidatorForUpdate');
const AuthenticationController = require('../controllers/AuthenticationController');
const isAdmin = require('../middlewares/isAdmin');

module.exports = app => {
    app.get(
        '/contracts',
        AuthenticationController.verifyToken,
        isAdmin.verifyAdmin,
        ContractsController.show
    );

    app.get(
        '/employees/:id/contracts',
        AuthenticationController.verifyToken,
        isAdmin.verifyAdmin,
        ContractsController.showContracts
    );

    app.post(
        '/contracts',
        AuthenticationController.verifyToken,
        isAdmin.verifyAdmin,
        ContractValidator,
        ContractsController.create
    );

    app.put(
        '/contracts/:id',
        AuthenticationController.verifyToken,
        isAdmin.verifyAdmin,
        ContractValidatorForUpdate,
        ContractsController.update
    );

    app.delete(
        '/contracts/:id',
        AuthenticationController.verifyToken,
        isAdmin.verifyAdmin,
        ContractsController.delete
    );
};
