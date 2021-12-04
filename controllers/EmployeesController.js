const { Users, Roles, UserRoles, Holidays, Contracts } = require('../models');
const { validationResult } = require('express-validator');
const bcrypt = require('bcrypt');

const saltRounds = 10;

module.exports = {
    async show(req, res, next) {
        try {
            const employees = await Users.findAll({
                include: [
                    {
                        model: Roles,
                        where: { name: 'user' }
                    }
                ]
            });

            return res.send(employees);
        } catch (err) {
            return next(err);
        }
    },

    async create(req, res, next) {
        const validationErrors = validationResult(req);

        if (!validationErrors.isEmpty()) {
            const errors = validationErrors.array().map(e => {
                return { message: e.msg, param: e.param };
            });

            return res.status(422).json({ errors });
        }

        try {
            const user = await Users.findOne({
                where: {
                    email: req.body.email
                }
            });

            if (user) {
                const errors = [
                    {
                        param: 'email',
                        message: 'This email is already in use'
                    }
                ];

                return res.status(422).json({ errors });
            }

            const employee = await Users.create(req.body);

            await UserRoles.create({
                UserId: employee.id,
                RoleId: Roles.ROLE_USER
            });

            return res.send(employee.toJSON());
        } catch (err) {
            return next(err);
        }
    },

    async update(req, res, next) {
        const validationErrors = validationResult(req);

        if (!validationErrors.isEmpty()) {
            const errors = validationErrors.array().map(e => {
                return { message: e.msg, param: e.param };
            });

            return res.status(422).json({ errors });
        }
        try {
            const employee = await Users.findByPk(req.params.id);

            if (!employee) {
                return res
                    .status(404)
                    .json({ error: 'This employee has not been found' });
            }

            if (req.body.password) {
                const salt = await bcrypt.genSalt(saltRounds);

                req.body.password = await bcrypt.hash(req.body.password, salt);

                Users.update(req.body, {
                    where: {
                        id: req.params.id
                    }
                });

                const employeeUpdated = Users.findByPk(req.params.id);

                return res.send(employeeUpdated);
            } else {
                await Users.update(req.body, {
                    where: {
                        id: req.params.id
                    }
                });

                const employeeUpdated = await Users.findByPk(req.params.id);

                return res.send(employeeUpdated);
            }
        } catch (err) {
            return next(err);
        }
    },

    async delete(req, res, next) {
        try {
            const user = await Users.findByPk(req.params.id);

            if (!user) {
                return res
                    .status(404)
                    .json({ error: 'This employee has not been found' });
            }

            const userRole = await UserRoles.findOne({
                where: {
                    user_id: req.params.id
                }
            });

            const contracts = await Contracts.findAll({
                where: {
                    user_id: req.params.id
                }
            });

            const holidays = await Holidays.findAll({
                where: {
                    user_id: req.params.id
                }
            });

            if (userRole) {
                await UserRoles.destroy({
                    where: {
                        user_id: req.params.id
                    }
                });
            }

            if (contracts) {
                await Contracts.destroy({
                    where: {
                        user_id: req.params.id
                    }
                });
            }

            if (holidays) {
                await Holidays.destroy({
                    where: {
                        user_id: req.params.id
                    }
                });
            }

            await Users.destroy({
                where: {
                    id: req.params.id
                }
            });

            return res.sendStatus(204);
        } catch (err) {
            return next(err);
        }
    },

    async getOne(req, res, next) {
        try {
            const employee = await Users.findByPk(req.params.id);

            if (!employee) {
                return res
                    .status(404)
                    .json({ error: 'This employee has not been found' });
            }

            return res.send(employee);
        } catch (err) {
            return next(err);
        }
    }
};
