const app = require('../app');
const request = require('supertest')(app);
const expect = require('chai').expect;
const helpers = require('./Helpers');

let loggedUserToken = require('./Authentication');
let holidaysId = require('./Authentication');
let userId = 1;

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
});

describe('adminHolidays', () => {
    describe('GET /holidays', () => {
        it('returns 200 when trying to get all holidays as admin', async () => {
            const response = await request
                .get(`/holidays`)
                .set('Authorization', 'Bearer ' + loggedAdminToken);

            expect(response.body);
        });

        it('returns 403 when trying to get holidays as normal user', async () => {
            const response = await request
                .get(`/holidays`)
                .set('Authorization', 'Bearer ' + loggedUserToken);

            expect(response.statusCode).to.equal(403);
        });
    });

    describe('POST /holidays', async () => {
        it('returns 201 when trying to create new holiday as admin', async () => {
            const newHolidays = {
                start_date: '2019-01-12',
                finish_date: '2019-01-13',
                user_id: userId
            };

            const response = await request
                .post(`/holidays`)
                .set('Authorization', 'Bearer ' + loggedAdminToken)
                .send(newHolidays);

            holidaysId = response.body.id;

            expect(response.body).to.have.property('days_taken');
        });

        it('returns an error when trying to add holidays request if some required field in this object is blank', async () => {
            const userHolidays = {
                start_date: null,
                finish_date: null,
                user_id: null
            };

            const response = await request
                .post(`/holidays`)
                .set('Authorization', 'Bearer ' + loggedAdminToken)
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

        it('returns 403 when trying to add holidays as normal user', async () => {
            const newHolidays = {
                start_date: '2019-01-12',
                finish_date: '2019-01-13',
                user_id: userId
            };

            const response = await request
                .put(`/holidays/${holidaysId}`)
                .set('Authorization', 'Bearer ' + loggedUserToken)
                .send(newHolidays);

            expect(response.statusCode).to.equal(403);
        });
    });

    describe('PUT /holidays', async () => {
        it('returns 200 when holidays has been updated as admin', async () => {
            const userHolidays = {
                start_date: '2019-01-12',
                finish_date: '2019-01-13',
                user_id: userId
            };

            const response = await request
                .put(`/holidays/${holidaysId}`)
                .set('Authorization', 'Bearer ' + loggedAdminToken)
                .send(userHolidays);

            expect(response.body).to.have.property('days_taken');
        });

        it('returns an error when trying to add holidays request if some required field in this object is blank', async () => {
            const userHolidays = {
                start_date: null,
                finish_date: null,
                user_id: null
            };

            const response = await request
                .put(`/holidays/${holidaysId}`)
                .set('Authorization', 'Bearer ' + loggedAdminToken)
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

        it('returns 403 when trying to change holidays as normal user', async () => {
            const userHolidays = {
                start_date: '2019-01-12',
                finish_date: '2019-01-13',
                user_id: userId
            };

            const response = await request
                .put(`/holidays/${holidaysId}`)
                .set('Authorization', 'Bearer ' + loggedUserToken)
                .send(userHolidays);

            expect(response.statusCode).to.equal(403);
        });

        it("returns 404 if holiday hasn't been found", async () => {
            const userHolidays = {
                start_date: '2019-01-12',
                finish_date: '2019-01-13',
                user_id: userId
            };

            const response = await request
                .put(`/holidays/99999999`)
                .set('Authorization', 'Bearer ' + loggedAdminToken)
                .send(userHolidays);

            expect(response.statusCode).to.equal(404);
        });
    });

    describe('PUT /holidays/:id/confirm', async () => {
        it('returns 200 when admin toggle confirm of holidays', async () => {
            const dataConfirmed = {
                confirmed: true
            };

            const response = await request
                .put(`/holidays/${holidaysId}/confirm`)
                .set('Authorization', 'Bearer ' + loggedAdminToken)
                .send(dataConfirmed);

            expect(response.body).to.have.property('confirmed');
        });

        it('returns an error if confirmed is blank', async () => {
            const dataConfirmed = {
                confirmed: null
            };

            const response = await request
                .put(`/holidays/${holidaysId}/confirm`)
                .set('Authorization', 'Bearer ' + loggedAdminToken)
                .send(dataConfirmed);

            expect(response.body).to.have.property('errors');
            expect(response.body.errors).to.deep.include({
                param: 'confirmed',
                message: 'Something wrong with confirm'
            });
        });

        it('returns 403 when trying to confirm as normal user', async () => {
            const dataConfirmed = {
                confirmed: true
            };

            const response = await request
                .put(`/holidays/${holidaysId}/confirm`)
                .set('Authorization', 'Bearer ' + loggedUserToken)
                .send(dataConfirmed);

            expect(response.statusCode).to.equal(403);
        });

        it("returns 404 if holiday hasn't been found", async () => {
            const response = await request
                .delete(`/holidays/99999999`)
                .set('Authorization', 'Bearer ' + loggedAdminToken);

            expect(response.statusCode).to.equal(404);
        });
    });

    describe('DELETE /holidays', async () => {
        it('returns 204 when holidays was been removed as admin', async () => {
            const response = await request
                .delete(`/holidays/${holidaysId}`)
                .set('Authorization', 'Bearer ' + loggedAdminToken);

            expect(response.statusCode).to.equal(204);
        });

        it('returns 403 when trying to delete as normal user', async () => {
            const response = await request
                .delete(`/holidays/${holidaysId}`)
                .set('Authorization', 'Bearer ' + loggedUserToken);

            expect(response.statusCode).to.equal(403);
        });

        it("returns 404 if holiday hasn't been found", async () => {
            const response = await request
                .delete(`/holidays/99999999`)
                .set('Authorization', 'Bearer ' + loggedAdminToken);

            expect(response.statusCode).to.equal(404);
        });
    });
});
