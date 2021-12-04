require('dotenv').config();

module.exports = {
    port: process.env.PORT,
    host: process.env.HOST,
    db: {
        url: process.env.DB_URL,
        database: process.env.DB_NAME,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        host: process.env.HOST,
        options: {
            logging: true,
            dialect: process.env.DIALECT,
            dialectModule: process.env.DIALECTMODULE,
            host: process.env.HOST,
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
