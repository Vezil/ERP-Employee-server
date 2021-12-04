'use strict';

module.exports = (sequelize, DataTypes) => {
    const Contracts = sequelize.define(
        'Contracts',
        {
            contract_length: DataTypes.INTEGER,
            start_date: DataTypes.DATEONLY,
            finish_date: DataTypes.DATEONLY
        },
        {
            tableName: 'contracts',
            underscored: true
        }
    );

    Contracts.associate = function(models) {
        Contracts.belongsTo(models.Users, {
            as: 'employee',
            foreignKey: 'user_id'
        });
    };

    return Contracts;
};
