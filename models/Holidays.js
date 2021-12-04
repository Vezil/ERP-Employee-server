'use strict';

module.exports = (sequelize, DataTypes) => {
    const Holidays = sequelize.define(
        'Holidays',
        {
            days_taken: {
                type: DataTypes.INTEGER
            },
            start_date: {
                type: DataTypes.DATEONLY
            },
            finish_date: {
                type: DataTypes.DATEONLY
            },
            confirmed: {
                type: DataTypes.BOOLEAN
            }
        },
        {
            tableName: 'holidays',
            underscored: true
        }
    );

    Holidays.associate = function(models) {
        Holidays.belongsTo(models.Users, {
            as: 'employee',
            foreignKey: 'user_id'
        });
    };

    return Holidays;
};
