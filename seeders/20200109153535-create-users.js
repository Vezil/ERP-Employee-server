'use strict';

const faker = require('faker');

const bcrypt = require('bcrypt');
const saltRounds = 10;

const users = [];

for (let i = 0; i <= 20; i++) {
    const employee = {
        name: faker.name.firstName(),
        surname: faker.name.lastName(),
        email: faker.internet.email(),
        birthdate: faker.date.past(),
        password: bcrypt.hashSync('password', saltRounds),
        days_left: 26,
        created_at: new Date(),
        updated_at: new Date()
    };

    users.push(employee);
}

const admin = {
    name: faker.name.firstName(),
    surname: faker.name.lastName(),
    email: 'admin@erp.test',
    birthdate: faker.date.past(),
    password: bcrypt.hashSync('password', saltRounds),
    days_left: 0,
    created_at: new Date(),
    updated_at: new Date()
};

users.push(admin);

const user = {
    name: faker.name.firstName(),
    surname: faker.name.lastName(),
    email: 'user@erp.test',
    birthdate: faker.date.past(),
    password: bcrypt.hashSync('password', saltRounds),
    days_left: 26,
    created_at: new Date(),
    updated_at: new Date()
};

users.push(user);

const user2 = {
    name: faker.name.firstName(),
    surname: faker.name.lastName(),
    email: 'user2@erp.test',
    birthdate: faker.date.past(),
    password: bcrypt.hashSync('password', saltRounds),
    days_left: 26,
    created_at: new Date(),
    updated_at: new Date()
};

users.push(user2);

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
        await queryInterface.sequelize.query(
            'SET @@auto_increment_increment=1'
        );
        await queryInterface.sequelize.query('SET @@auto_increment_offset=1');
        await queryInterface.sequelize.query('SET FOREIGN_KEY_CHECKS = 0');

        await queryInterface.bulkInsert('users', users);

        await queryInterface.sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.sequelize.query('SET FOREIGN_KEY_CHECKS = 0');

        await queryInterface.bulkDelete('users');

        await queryInterface.sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
    }
};
