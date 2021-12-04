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
    up: (queryInterface, Sequelize) => {
        return queryInterface.bulkInsert('roles', roles);
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('roles');
    }
};
