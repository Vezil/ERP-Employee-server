const bcrypt = require('bcrypt');

const { Users, Roles } = require('../models');
const jwt = require('jsonwebtoken');
const config = require('../config');
const { validationResult } = require('express-validator');

const Mail = require('../services/Mail');
const changePasswordMail = require('../emails/ChangePassword');

function jwtSignEmployee(employee) {
    const ONE_DAY = 60 * 60 * 24;

    return jwt.sign(employee, config.authentication.jwtSecret, {
        expiresIn: ONE_DAY
    });
}

module.exports = {
    async login(req, res, next) {
        const validationErrors = validationResult(req);

        if (!validationErrors.isEmpty()) {
            const errors = validationErrors.array().map(e => {
                return { message: e.msg, param: e.param };
            });

            return res.status(422).json({ errors });
        }

        try {
            const { email, password } = req.body;

            const userWithPassword = await Users.findOne({
                attributes: ['password'],
                where: {
                    email
                }
            });

            if (!userWithPassword) {
                return res.status(422).send({
                    error: 'The login information was incorrect'
                });
            }

            const isPasswordValid = await userWithPassword.comparePassword(
                password
            );

            if (!isPasswordValid) {
                return res.status(422).send({
                    errors: [
                        {
                            message:
                                'The login or pass information was incorrect'
                        }
                    ]
                });
            }

            const user = await Users.findOne({
                where: {
                    email
                },
                include: [{ model: Roles }]
            });

            const userJson = user.toJSON();

            return res.send({
                user: userJson,
                token: jwtSignEmployee(userJson)
            });
        } catch (err) {
            return next(err);
        }
    },

    async verifyToken(req, res, next) {
        const bearerHeader = req.headers['authorization'];

        if (typeof bearerHeader === 'undefined') {
            return res.sendStatus(403).json({
                auth: false,
                message: 'Failed to authenticate token.'
            });
        }

        const token = bearerHeader.split(' ')[1];

        jwt.verify(token, config.authentication.jwtSecret, (err, authData) => {
            if (err) {
                return res.sendStatus(401).json({
                    auth: false,
                    message: 'Failed to authenticate token.'
                });
            }

            req.loggedUser = authData;

            next();
        });
    },

    async changePassword(req, res, next) {
        try {
            const oldPassword = req.body.oldPassword;
            const newPassword = req.body.newPassword;
            const newPasswordRepeat = req.body.newPasswordRepeat;

            if (process.env.NODE_ENV === 'production') {
                return res.status(400).json({
                    error:
                        'Sorry! This feature is unavailable for demo purposes.'
                });
            }

            if (newPassword !== newPasswordRepeat) {
                return res.status(422).json({
                    error:
                        "Fields 'New Password' and 'New Password Repeat' doesn't have this same value"
                });
            }

            const person = await Users.findOne({
                attributes: ['password'],

                where: {
                    id: req.loggedUser.id
                }
            });

            if (!person) {
                return res
                    .status(404)
                    .json({ error: 'This employee has not been found' });
            }

            const oldPasswordHash = person.password;
            const compare = await bcrypt.compare(oldPassword, oldPasswordHash);

            if (compare === false) {
                return res.status(422).json({
                    error: 'Old password is incorrect'
                });
            }

            const thisPerson = await Users.findByPk(req.loggedUser.id);

            await thisPerson.update({
                password: newPassword
            });

            const updatedUser = await Users.findByPk(req.loggedUser.id);

            try {
                await new Mail().send(
                    changePasswordMail({
                        email: updatedUser.email,
                        name: updatedUser.name,
                        surname: updatedUser.surname
                    })
                );
            } catch (err) {
                console.error(err);
                return next(err);
            }

            return res.send(updatedUser);
        } catch (err) {
            return next(err);
        }
    }
};
