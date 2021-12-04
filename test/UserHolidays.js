const app = require('../app');
const request = require('supertest')(app);
const expect = require('chai').expect;
const helpers = require('./Helpers');

let loggedUserId;
let loggedUserToken;
let holidaysId;
let otherLoggedUserToken;

async function loginOtherPerson() {
    const personData = {
        email: 'user2@erp.test',
        password: 'password'
    };

    const response = await request.post(`/login`).send(personData);

    otherLoggedUserToken = response.body.token;
}

loginOtherPerson();

before(async () => {
    const email = 'user@erp.test';
    const password = 'password';

    const credentials = await helpers.login(email, password);

    loggedUserToken = credentials.token;
    loggedUserId = credentials.user.id;
});

describe('userHolidays', () => {
    describe('GET /userHolidays', () => {
        it('getting data of this user', async () => {
            const response = await request
                .get(`/employees/${loggedUserId}/holidays`)
                .set('Authorization', 'Bearer ' + loggedUserToken);

            expect(response.body);
        });

        it('returns 403 when trying to get holidays as other user', async () => {
            const response = await request
                .get(`/employees/${loggedUserId}/holidays`)
                .set('Authorization', 'Bearer ' + otherLoggedUserToken);

            expect(response.statusCode).to.equal(403);
        });
    });

    describe('POST /userHolidays', async () => {
        it('returns 201 when user sending request for holidays to admin', async () => {
            const userHolidays = {
                start_date: '2019-01-12',
                finish_date: '2019-01-13',
                user_id: loggedUserId
            };

            const response = await request
                .post(`/employees/${loggedUserId}/holidays`)
                .set('Authorization', 'Bearer ' + loggedUserToken)
                .send(userHolidays);

            holidaysId = response.body.id;

            expect(response.body).to.have.property('days_taken');
        });

        it('returns an error when trying to add holidays if some required field in this object is blank', async () => {
            const userHolidays = {
                start_date: null,
                finish_date: null,
                user_id: null
            };

            const response = await request
                .post(`/employees/${loggedUserId}/holidays`)
                .set('Authorization', 'Bearer ' + loggedUserToken)
                .send(userHolidays);

            expect(response.body).to.have.property('errors');
            expect(response.body.errors).to.deep.include({
                param: 'start_date',
                message: 'Invalid date format',
                param: 'finish_date',
                message: 'Invalid date format',
                param: 'user_id',
                message: 'Id required'
            });
        });

        it('returns 403 when trying to post request for holidays as other user', async () => {
            const userHolidays = {
                start_date: '2019-01-12',
                finish_date: '2019-01-13',
                user_id: loggedUserId
            };

            const response = await request
                .post(`/employees/${loggedUserId}/holidays/`)
                .set('Authorization', 'Bearer ' + otherLoggedUserToken)
                .send(userHolidays);

            expect(response.statusCode).to.equal(403);
        });
    });

    describe('PUT /userHolidays', async () => {
        it('returns 200 when trying to edit request for holidays as user', async () => {
            const userHolidays = {
                start_date: '2019-01-12',
                finish_date: '2019-01-13',
                user_id: loggedUserId
            };

            const response = await request
                .put(`/employees/${loggedUserId}/holidays/${holidaysId}`)
                .set('Authorization', 'Bearer ' + loggedUserToken)
                .send(userHolidays);

            expect(response.body).to.have.property('days_taken');
        });

        it('returns an error when trying to edit holidays if some required field in this object is blank', async () => {
            const userHolidays = {
                start_date: null,
                finish_date: null,
                user_id: null
            };

            const response = await request
                .put(`/employees/${loggedUserId}/holidays/${holidaysId}`)
                .set('Authorization', 'Bearer ' + loggedUserToken)
                .send(userHolidays);

            expect(response.body).to.have.property('errors');
            expect(response.body.errors).to.deep.include({
                param: 'start_date',
                message: 'Invalid date format',
                param: 'finish_date',
                message: 'Invalid date format',
                param: 'user_id',
                message: 'Id required'
            });
        });

        it('returns 403 when trying to edit request for holidays as other user', async () => {
            const response = await request
                .put(`/employees/${loggedUserId}/holidays/${holidaysId}`)
                .set('Authorization', 'Bearer ' + otherLoggedUserToken);

            expect(response.statusCode).to.equal(403);
        });

        it("returns 404 if holiday hasn't been found", async () => {
            const userHolidays = {
                start_date: '2019-01-12',
                finish_date: '2019-01-13',
                user_id: loggedUserId
            };

            const response = await request
                .put(`/employees/${loggedUserId}/holidays/99999999`)
                .set('Authorization', 'Bearer ' + loggedUserToken)
                .send(userHolidays);

            expect(response.statusCode).to.equal(404);
        });
    });

    describe('DELETE /userHolidays', async () => {
        it('returns 204 when trying to delete request for holidays to admin as user', async () => {
            const response = await request
                .delete(`/employees/${loggedUserId}/holidays/${holidaysId}`)
                .set('Authorization', 'Bearer ' + loggedUserToken);

            expect(response.statusCode).to.equal(204);
        });

        it('returns 403 when trying to delete request for holidays to admin as other user', async () => {
            const response = await request
                .delete(`/employees/${loggedUserId}/holidays/${holidaysId}`)
                .set('Authorization', 'Bearer ' + otherLoggedUserToken);

            expect(response.statusCode).to.equal(403);
        });

        it("returns 404 if holiday hasn't been found", async () => {
            const response = await request
                .delete(`/employees/${loggedUserId}/holidays/99999999`)
                .set('Authorization', 'Bearer ' + loggedUserToken);

            expect(response.statusCode).to.equal(404);
        });
    });
});
