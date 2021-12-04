const { Users, Holidays } = require('../models');
const { validationResult } = require('express-validator');
const moment = require('moment');

module.exports = {
    async show(req, res, next) {
        try {
            const allHolidays = await Holidays.findAll({
                include: [{ model: Users, as: 'employee' }]
            });

            return res.send(allHolidays);
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

        const start = moment(req.body.start_date);
        const finish = moment(req.body.finish_date);

        const daysTaken =
            Math.abs(moment.duration(start.diff(finish)).asDays()) + 1;

        const employee = await Users.findByPk(req.body.user_id);

        if (!employee) {
            return res
                .status(404)
                .json({ error: 'This user has not been found' });
        }
        const newDaysLeft = employee.days_left - daysTaken;

        try {
            req.body.days_taken = daysTaken;

            const newHolidays = await Holidays.create(req.body);
            await employee.update({ days_left: newDaysLeft });

            return res.send(newHolidays);
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

        const start = moment(req.body.start_date);
        const finish = moment(req.body.finish_date);

        const newDaysTaken =
            Math.abs(moment.duration(start.diff(finish)).asDays()) + 1;

        try {
            req.body.days_taken = newDaysTaken;

            const holiday = await Holidays.findByPk(req.params.id);

            if (!holiday) {
                return res
                    .status(404)
                    .json({ error: 'This holiday has not been found' });
            }

            if (holiday.confirmed === true) {
                const employee = await Users.findByPk(req.body.user_id);

                const oldDaysLeft = employee.days_left;

                const newDaysLeft =
                    oldDaysLeft - (newDaysTaken - holiday.days_taken);

                await employee.update({ days_left: newDaysLeft });
            }

            await Holidays.update(req.body, {
                where: {
                    id: req.params.id
                }
            });

            const updatedHoliday = await Holidays.findByPk(req.params.id);

            return res.send(updatedHoliday);
        } catch (err) {
            return next(err);
        }
    },

    async confirm(req, res, next) {
        const validationErrors = validationResult(req);

        if (!validationErrors.isEmpty()) {
            const errors = validationErrors.array().map(e => {
                return { message: e.msg, param: e.param };
            });

            return res.status(422).json({ errors });
        }

        try {
            let newDaysLeft;
            const holiday = await Holidays.findByPk(req.params.id);

            if (!holiday) {
                return res
                    .status(404)
                    .json({ error: 'This holiday has not been found' });
            }

            await Holidays.update(req.body, {
                where: {
                    id: req.params.id
                }
            });

            const employee = await Users.findByPk(holiday.user_id);

            if (!employee) {
                return res
                    .status(404)
                    .json({ error: 'This employee has not been found' });
            }

            if (req.body.confirmed === true) {
                newDaysLeft = employee.days_left - holiday.days_taken;
            } else {
                newDaysLeft = employee.days_left + holiday.days_taken;
            }

            await employee.update({ days_left: newDaysLeft });

            return res.send(holiday);
        } catch (err) {
            return next(err);
        }
    },

    async delete(req, res, next) {
        try {
            const holidayToDelete = await Holidays.findByPk(req.params.id);

            if (!holidayToDelete) {
                return res
                    .status(404)
                    .json({ error: 'This holiday has not been found' });
            }

            if (holidayToDelete.confirmed === true) {
                const employee = await Users.findOne({
                    where: {
                        id: holidayToDelete.user_id
                    }
                });

                const oldDaysLeft = employee.days_left;

                const oldDaysTaken = holidayToDelete.days_taken;

                const newDaysLeft = oldDaysTaken + oldDaysLeft;

                await employee.update({ days_left: newDaysLeft });
            }

            await holidayToDelete.destroy();

            return res.sendStatus(204);
        } catch (err) {
            return next(err);
        }
    }
};
