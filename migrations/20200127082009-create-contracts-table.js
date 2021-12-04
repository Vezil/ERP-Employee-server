'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('contracts', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            contract_length: {
                type: Sequelize.STRING
            },
            start_date: {
                allowNull: false,
                type: Sequelize.DATEONLY
            },
            finish_date: {
                allowNull: false,
                type: Sequelize.DATEONLY
            },
            created_at: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updated_at: {
                allowNull: false,
                type: Sequelize.DATE
            },
            user_id: {
                type: Sequelize.INTEGER,
                onDelete: 'cascade',
                references: {
                    model: 'users',
                    key: 'id'
                }
            }
        });
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.sequelize.query('SET FOREIGN_KEY_CHECKS = 0');

        return queryInterface.dropTable('contracts');
    }
};
