const app = require('../app');
const request = require('supertest')(app);
const expect = require('chai').expect;

describe('POST /login', () => {
    it('returns 200 when trying to login as admin with valid data', async () => {
        const loginData = {
            email: 'admin@erp.test',
            password: 'password'
        };

        const response = await request.post(`/login`).send(loginData);

        expect(response.body).to.have.property('token');
    });

    it('returns 422 when trying login with invalid data', async () => {
        const adminData = {
            email: null,
            password: null
        };

        const response = await request.post(`/login`).send(adminData);

        expect(response.body).to.have.property('errors');
        expect(response.body.errors).to.deep.include({
            param: 'email',
            message: 'Email is required and min length is 5 chars',
            param: 'password',
            message: 'Password is required and min length is 8 chars'
        });
    });

    it('returns an error if password contains less than 8 character', async () => {
        const adminData = {
            password: 12345
        };
        const response = await request.post(`/login`).send(adminData);

        expect(response.body).to.have.property('errors');
        expect(response.body.errors).to.deep.include({
            param: 'password',
            message: 'Password is required and min length is 8 chars'
        });
    });
});
