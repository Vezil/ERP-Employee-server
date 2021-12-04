const mailer = require('nodemailer');
const config = require('../config');

module.exports = class Mail {
    constructor() {
        const transport = this.getTransport();
        this.service = mailer.createTransport(transport);
    }

    getTransport() {
        return {
            host: config.mailer.host,
            port: config.mailer.port,
            secure: config.mailer.secure,
            auth: config.mailer.auth,
            from: config.mailer.from
        };
    }

    async send(data) {
        return await this.service.sendMail(data);
    }
};
