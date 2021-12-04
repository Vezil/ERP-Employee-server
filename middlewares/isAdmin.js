const { Users } = require('../models');

module.exports = {
    async verifyAdmin(req, res, next) {
        try {
            if (!req.loggedUser) {
                return res.status(401).json({ error: 'Unauthorized' });
            }

            const adminLogged = await Users.findByPk(req.loggedUser.id);

            if (!(await adminLogged.isAdmin())) {
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
