'use strict';

const userRoles = [];

for (let i = 0; i <= 20; i++) {
    const role = {
        user_id: i + 1,
        role_id: 2,
        created_at: new Date(),
        updated_at: new Date()
    };

    userRoles.push(role);
}

const adminRole = {
    user_id: 22,
    role_id: 1,
    created_at: new Date(),
    updated_at: new Date()
};

userRoles.push(adminRole);

const userRole = {
    user_id: 23,
    role_id: 2,
    created_at: new Date(),
    updated_at: new Date()
};

userRoles.push(userRole);

const user2Role = {
    user_id: 24,
    role_id: 2,
    created_at: new Date(),
    updated_at: new Date()
};

userRoles.push(user2Role);

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.bulkInsert('user_roles', userRoles);
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('user_roles');
    }
};
