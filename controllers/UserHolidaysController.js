const { Holidays, Users } = require('../models');
const { validationResult } = require('express-validator');
const moment = require('moment');

module.exports = {
    async showHolidays(req, res, next) {
        try {
            const holidays = await Holidays.findAll({
                where: {
                    user_Id: req.params.id,
                    confirmed: 1
                }
            });

            return res.send(holidays);
        } catch (err) {
            return next(err);
        }
    },

    async showRequests(req, res, next) {
        try {
            const holidays = await Holidays.findAll({
                where: {
                    user_Id: req.params.id,
                    confirmed: 0
                }
            });

            return res.send(holidays);
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

        const holidayDaysTaken =
            Math.abs(moment.duration(start.diff(finish)).asDays()) + 1;

        try {
            const holiday = await Holidays.create({
                ...req.body,
                days_taken: holidayDaysTaken
            });

            return res.send(holiday);
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
            const holiday = await Holidays.findByPk(req.params.holidayId);

            if (!holiday) {
                return res
                    .status(404)
                    .json({ error: 'This holiday has not been found' });
            }

            const start = moment(req.body.start_date);
            const finish = moment(req.body.finish_date);

            const holidayDaysTaken =
                Math.abs(moment.duration(start.diff(finish)).asDays()) + 1;

            await Holidays.update(
                { ...req.body, days_taken: holidayDaysTaken },
                {
                    where: {
                        user_id: req.params.id,
                        id: req.params.holidayId
                    }
                }
            );

            const holidayUpdated = await Holidays.findByPk(holiday.id);

            return res.send(holidayUpdated);
        } catch (err) {
            return next(err);
        }
    },

    async delete(req, res, next) {
        try {
            const holiday = await Holidays.findOne({
                where: {
                    user_id: req.params.id,
                    id: req.params.holidays_id
                }
            });

            if (!holiday) {
                return res
                    .status(404)
                    .json({ error: 'This holiday has not been found' });
            }

            await holiday.destroy();

            return res.sendStatus(204);
        } catch (err) {
            return next(err);
        }
    }
};
