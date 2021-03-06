require('dotenv').config();

module.exports = {
    port: process.env.PORT || 80,
    host: process.env.HOST,
    db: {
        url: process.env.DB_URL,
        database: process.env.DB_NAME,
        username: process.env.DB_USER,
        password: process.env.DB_PASS,
        host: process.env.DB_HOST,
        dialect: process.env.DIALECT,
        port: process.env.DB_PORT,
        options: {
            logging: true,
            dialect: process.env.DIALECT,
            host: process.env.DB_HOST,
            port: process.env.DB_PORT
        }
    },
    mailer: {
        host: process.env.MAILER_HOST,
        port: process.env.MAILER_PORT,
        secure: false,
        auth: {
            user: process.env.MAILER_AUTH_USERNAME,
            pass: process.env.MAILER_AUTH_PASSWORD
        },
        from: {
            name: process.env.EMAIL_FROM,
            address: process.env.EMAIL_FROM_ADDRESS
        }
    },
    authentication: {
        jwtSecret: process.env.JWT_SECRET
    }
};
