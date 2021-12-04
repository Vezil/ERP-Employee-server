const { Users } = require('../models');

module.exports = {
    async verifyUser(req, res, next) {
        try {
            if (!req.loggedUser) {
                return res.status(401).json({ error: 'Unauthorized' });
            }

            const userLogged = await Users.findByPk(req.loggedUser.id);

            if (
                (await userLogged.isUser()) &&
                userLogged.id !== parseInt(req.params.id)
            ) {
                return res.status(403).send({
                    error: 'Forbidden'
                });
            }

            next();
        } catch (err) {
            return next(err);
        }
    }
};
