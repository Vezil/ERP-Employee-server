const bcrypt = require('bcrypt');

const saltRounds = 10;

const ROLE_USER = 'user';
const ROLE_ADMIN = 'admin';

async function hashPassword(user, options) {
    if (!user.changed('password')) {
        return;
    }

    const salt = await bcrypt.genSalt(saltRounds);

    user.password = await bcrypt.hash(user.password, salt);

    return user.password;
}

module.exports = (sequelize, DataTypes) => {
    const Users = sequelize.define(
        'Users',
        {
            email: {
                type: DataTypes.STRING,
                unique: true
            },
            name: {
                type: DataTypes.STRING
            },
            surname: {
                type: DataTypes.STRING
            },
            birthdate: {
                type: DataTypes.DATEONLY
            },
            password: {
                type: DataTypes.STRING
            },
            days_left: {
                type: DataTypes.INTEGER
            }
        },
        {
            tableName: 'users',
            underscored: true,
            defaultScope: {
                attributes: { exclude: ['password'] }
            },
            hooks: {
                beforeSave: hashPassword
            }
        }
    );

    Users.associate = models => {
        Users.hasMany(models.Holidays);
        Users.hasMany(models.Contracts);
        Users.belongsToMany(models.Roles, {
            through: models.UserRoles
        });
    };

    Users.prototype.comparePassword = function(password) {
        return bcrypt.compare(password, this.password);
    };

    Users.prototype.isUser = async function() {
        const role = await this.getRoles();

        if (role[0].name === ROLE_USER) {
            return true;
        }

        return false;
    };

    Users.prototype.isAdmin = async function() {
        const role = await this.getRoles();

        if (role[0].name === ROLE_ADMIN) {
            return true;
        }

        return false;
    };

    return Users;
};
