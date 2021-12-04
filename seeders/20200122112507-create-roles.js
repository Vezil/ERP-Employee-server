'use strict';

const roles = [];

const adminRole = {
    name: 'admin',
    created_at: new Date(),
    updated_at: new Date()
};

roles.push(adminRole);

const userRole = {
    name: 'user',
    created_at: new Date(),
    updated_at: new Date()
};

roles.push(userRole);

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.sequelize.query('SET FOREIGN_KEY_CHECKS = 0');

        await queryInterface.bulkInsert('roles', roles);

        await queryInterface.sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.sequelize.query('SET FOREIGN_KEY_CHECKS = 0');

        await queryInterface.bulkDelete('roles');

        await queryInterface.sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
    }
};
