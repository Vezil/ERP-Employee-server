const app = require('../app');
const request = require('supertest')(app);
const expect = require('chai').expect;
const bcrypt = require('bcrypt');
const saltRounds = 10;
const helpers = require('./Helpers');

let loggedAdminToken;
let userId;
let loggedUserToken;

async function loginOtherPerson() {
    const personData = {
        email: 'user@erp.test',
        password: 'password'
    };

    const response = await request.post(`/login`).send(personData);

    loggedUserToken = response.body.token;
}

loginOtherPerson();

before(async () => {
    const email = 'admin@erp.test';
    const password = 'password';

    const credentials = await helpers.login(email, password);

    loggedAdminToken = credentials.token;
    loggedUserId = credentials.user.id;
});

describe('employees', async () => {
    describe('GET /employees', () => {
        it('returns 200 when trying to get all employees as admin', async () => {
            const response = await request
                .get(`/employees`)
                .set('Authorization', 'Bearer ' + loggedAdminToken);

            expect(response.body);

            it('returns 403 when trying to get employee as normal user', async () => {
                const response = await request
                    .get(`/employees`)
                    .set('Authorization', 'Bearer ' + loggedUserToken);

                expect(response.statusCode).to.equal(403);
            });
        });
    });

    describe('POST /employees', async () => {
        it('returns 201 when trying to create new employee as admin', async () => {
            const salt = await bcrypt.genSalt(saltRounds);

            const newEmployee = {
                email: 'testEmployee@test.erp',
                name: 'test',
                surname: 'surtest',
                password: await bcrypt.hash('password', salt),
                birthdate: '1997-11-11',
                days_left: 0
            };

            const response = await request
                .post(`/employees`)
                .set('Authorization', 'Bearer ' + loggedAdminToken)
                .send(newEmployee);

            userId = response.body.id;

            expect(response.body).to.have.property('email');
        });

        it('returns an error when trying to add employee if some required field in this object is blank', async () => {
            const newEmployee = {
                email: null,
                name: null,
                surname: null,
                password: null,
                birthdate: null,
                days_left: null
            };

            const response = await request
                .post(`/employees`)
                .set('Authorization', 'Bearer ' + loggedAdminToken)
                .send(newEmployee);

            expect(response.body).to.have.property('errors');
            expect(response.body.errors).to.deep.include({
                param: 'email',
                message: 'Email is required and min length is 5 chars',
                param: 'name',
                message:
                    'Invalid name format. Min length is 3 chars. Max length is 20 chars',
                param: 'surname',
                message:
                    'Invalid surname format. Min length is 3 chars. Max length is 30 chars',
                param: 'password',
                message: 'Password is required and min length is 8 chars',
                param: 'birthdate',
                message: 'Invalid date format',
                param: 'days_left',
                message: 'Invalid days_left format'
            });
        });

        it('returns an error if email is already in use', async () => {
            const salt = await bcrypt.genSalt(saltRounds);

            const newEmployee = {
                email: 'testEmployee@test.erp',
                name: 'test',
                surname: 'surtest',
                password: await bcrypt.hash('password', salt),
                birthdate: '1997-11-11',
                days_left: 0
            };

            const response = await request
                .post(`/employees`)
                .set('Authorization', 'Bearer ' + loggedAdminToken)
                .send(newEmployee);

            expect(response.body).to.have.property('errors');
            expect(response.body.errors).to.deep.include({
                param: 'email',
                message: 'This email is already in use'
            });
        });

        it('returns 403 when trying to add employee as normal user', async () => {
            const salt = await bcrypt.genSalt(saltRounds);

            const newEmployee = {
                email: 'testEmployee@test.erp',
                name: 'test',
                surname: 'surtest',
                password: await bcrypt.hash('password', salt),
                birthdate: '1997-11-11',
                days_left: 0
            };

            const response = await request
                .post(`/employees`)
                .set('Authorization', 'Bearer ' + loggedUserToken)
                .send(newEmployee);

            expect(response.statusCode).to.equal(403);
        });
    });

    describe('PUT /employees', async () => {
        it('returns 200 when trying to get all employees as admin', async () => {
            const updateEmployee = {
                email: 'testEmployee@test.erp',
                name: 'test123',
                surname: 'surtest123',
                birthdate: '1997-11-11',
                days_left: 0
            };

            const response = await request
                .put(`/employees/${userId}`)
                .set('Authorization', 'Bearer ' + loggedAdminToken)
                .send(updateEmployee);

            expect(response.body).to.have.property('email');
        });

        it('returns an error when trying to edit employee if some required field in this object is blank', async () => {
            const updateEmployee = {
                email: null,
                name: null,
                surname: null,
                birthdate: null,
                days_left: null
            };

            const response = await request
                .put(`/employees/${userId}`)
                .set('Authorization', 'Bearer ' + loggedAdminToken)
                .send(updateEmployee);

            expect(response.body).to.have.property('errors');
            expect(response.body.errors).to.deep.include({
                param: 'email',
                message: 'Email is required and min length is 5 chars',
                param: 'name',
                message:
                    'Invalid name format. Min length is 3 chars. Max length is 20 chars',
                param: 'surname',
                message:
                    'Invalid surname format. Min length is 3 chars. Max length is 30 chars',
                param: 'birthdate',
                message: 'Invalid date format',
                param: 'days_left',
                message: 'Invalid days_left format'
            });
        });

        it('returns 403 if trying to update employee as normal user', async () => {
            const updateEmployee = {
                email: 'testEmployee@test.erp',
                name: 'test123',
                surname: 'surtest123',
                birthdate: '1997-11-11',
                days_left: 0
            };

            const response = await request
                .put(`/employees/${userId}`)
                .set('Authorization', 'Bearer ' + loggedUserToken)
                .send(updateEmployee);

            expect(response.statusCode).to.equal(403);
        });

        it("returns 404 if employee hasn't been found", async () => {
            const updateEmployee = {
                email: 'testEmployee@test.erp',
                name: 'test123',
                surname: 'surtest123',
                birthdate: '1997-11-11',
                days_left: 0
            };

            const response = await request
                .put(`/employees/9999999999`)
                .set('Authorization', 'Bearer ' + loggedAdminToken)
                .send(updateEmployee);

            expect(response.statusCode).to.equal(404);
        });
    });

    describe('DELETE /employees', async () => {
        it('deletes a employee', async () => {
            const response = await request
                .delete(`/employees/${userId}`)
                .set('Authorization', 'Bearer ' + loggedAdminToken);

            expect(response.statusCode).to.equal(204);
        });

        it('returns 403 when trying to delete employee as normal user', async () => {
            const response = await request
                .delete(`/employees/${userId}`)
                .set('Authorization', 'Bearer ' + loggedUserToken);

            expect(response.statusCode).to.equal(403);
        });

        it("returns 404 if employee hasn't been found", async () => {
            const response = await request
                .delete(`/employees/${userId}`)
                .set('Authorization', 'Bearer ' + loggedAdminToken);

            expect(response.statusCode).to.equal(404);
        });
    });
});
