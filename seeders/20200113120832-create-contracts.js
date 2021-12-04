'use strict';

const faker = require('faker');

const contracts = [];
const randomContractLength = [1, 3, 6, 12];

for (let i = 0; i <= 20; i++) {
    const contract = {
        contract_length: faker.helpers.randomize(randomContractLength),
        start_date: faker.date.past(),
        finish_date: faker.date.future(),
        user_id: i + 1,
        created_at: new Date(),
        updated_at: new Date()
    };

    contracts.push(contract);
}

for (let i = 0; i <= 5; i++) {
    const contractForUser = {
        contract_length: faker.helpers.randomize(randomContractLength),
        start_date: faker.date.past(),
        finish_date: faker.date.future(),
        user_id: 23,
        created_at: new Date(),
        updated_at: new Date()
    };

    contracts.push(contractForUser);
}

for (let i = 0; i <= 5; i++) {
    const contractForUser2 = {
        contract_length: faker.helpers.randomize(randomContractLength),
        start_date: faker.date.past(),
        finish_date: faker.date.future(),
        user_id: 24,
        created_at: new Date(),
        updated_at: new Date()
    };

    contracts.push(contractForUser2);
}

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.sequelize.query('SET FOREIGN_KEY_CHECKS = 0');

        await queryInterface.bulkInsert('contracts', contracts);

        await queryInterface.sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.sequelize.query('SET FOREIGN_KEY_CHECKS = 0');

        await queryInterface.bulkDelete('contracts');

        await queryInterface.sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
    }
};
