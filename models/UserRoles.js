'use strict';

module.exports = (sequelize, DataTypes) => {
    const UserRoles = sequelize.define(
        'UserRoles',
        {},
        {
            tableName: 'user_roles',
            underscored: true
        }
    );

    return UserRoles;
};
