'use strict';

const faker = require('faker');

const holidays = [];
const randomConfirmed = [true, false];
const randomDays = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];

for (let i = 0; i <= 20; i++) {
    const holiday = {
        days_taken: faker.helpers.randomize(randomDays),
        start_date: faker.date.past(),
        finish_date: faker.date.future(),
        confirmed: faker.helpers.randomize(randomConfirmed),
        user_id: i + 1,
        created_at: new Date(),
        updated_at: new Date()
    };

    holidays.push(holiday);
}

for (let i = 0; i <= 5; i++) {
    const holidayForUser = {
        days_taken: faker.helpers.randomize(randomDays),
        start_date: faker.date.past(),
        finish_date: faker.date.future(),
        confirmed: faker.helpers.randomize(randomConfirmed),
        user_id: 23,
        created_at: new Date(),
        updated_at: new Date()
    };

    holidays.push(holidayForUser);
}

for (let i = 0; i <= 5; i++) {
    const holidayForUser2 = {
        days_taken: faker.helpers.randomize(randomDays),
        start_date: faker.date.past(),
        finish_date: faker.date.future(),
        confirmed: faker.helpers.randomize(randomConfirmed),
        user_id: 24,
        created_at: new Date(),
        updated_at: new Date()
    };

    holidays.push(holidayForUser2);
}

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.bulkInsert('holidays', holidays);
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('holidays');
    }
};
