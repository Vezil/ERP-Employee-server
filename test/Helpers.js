const app = require('../app');
const request = require('supertest')(app);

const login = async (email, password) => {
    const { body } = await request.post(`/login`).send({
        email,
        password
    });

    return body;
};

exports.login = login;
