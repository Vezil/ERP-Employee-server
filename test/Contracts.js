const app = require('../app');
const request = require('supertest')(app);
const expect = require('chai').expect;
const helpers = require('./Helpers');

let loggedAdminToken;
let contractId;
let contractBadId;
let loggedUserToken;
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

describe('contracts', async () => {
    describe('GET /contracts', () => {
        it('returns 200 when trying to get contracts as admin', async () => {
            const response = await request
                .get(`/contracts`)
                .set('Authorization', 'Bearer ' + loggedAdminToken);

            expect(response.body);
        });

        it('returns 403 when trying to get all contracts as user', async () => {
            const response = await request
                .get(`/contracts`)
                .set('Authorization', 'Bearer ' + loggedUserToken);

            expect(response.statusCode).to.equal(403);
        });
    });

    describe('POST /contracts', async () => {
        it('return 201 when trying to create new contract as admin', async () => {
            const newContract = {
                contract_length: 12,
                start_date: '2019-12-12',
                finish_date: '2020-12-12',
                user_id: userId,
                holidays_per_year: 20
            };

            const response = await request
                .post(`/contracts`)
                .set('Authorization', 'Bearer ' + loggedAdminToken)
                .send(newContract);

            contractId = response.body.id;

            expect(response.body).to.have.property('contract_length');
        });

        it('returns an error when trying to add contract if some required field in this object is blank', async () => {
            const newContract = {
                contract_length: null,
                start_date: null,
                finish_date: null,
                user_id: null,
                holidays_per_year: null
            };

            const response = await request
                .post(`/contracts`)
                .set('Authorization', 'Bearer ' + loggedAdminToken)
                .send(newContract);

            expect(response.body).to.have.property('errors');
            expect(response.body.errors).to.deep.include({
                param: 'contract_length',
                message:
                    'Invalid type of contract. It must be number (1/3/6/12)',
                param: 'start_date',
                message: 'Invalid date format',
                param: 'finish_date',
                message: 'Invalid date format',
                param: 'user_id',
                message: 'Id required',
                param: 'holidays_per_year',
                message: 'Invalid type of holidays. It must be number (20/26)'
            });
        });

        it('returns 403 when trying to create new contract as normal user', async () => {
            const newContract = {
                contract_length: 12,
                start_date: '2019-12-12',
                finish_date: '2020-12-12',
                user_id: userId,
                holidays_per_year: 20
            };

            const response = await request
                .post(`/contracts/`)
                .set('Authorization', 'Bearer ' + loggedUserToken)
                .send(newContract);

            contractBadId = response.body.id;

            expect(response.statusCode).to.equal(403);
        });
    });

    describe('PUT /contracts', async () => {
        it('returns 200 when trying to edit contract as admin', async () => {
            const updateContract = {
                contract_length: 12,
                start_date: '2019-12-12',
                finish_date: '2020-12-12',
                user_id: userId
            };

            const response = await request
                .put(`/contracts/${contractId}`)
                .set('Authorization', 'Bearer ' + loggedAdminToken)
                .send(updateContract);

            expect(response.body).to.have.property('contract_length');
        });

        it('returns an error when trying to edit contract if some required field in this object is blank', async () => {
            const updateContract = {
                contract_length: null,
                start_date: null,
                finish_date: null,
                user_id: null
            };

            const response = await request
                .put(`/contracts/${contractId}`)
                .set('Authorization', 'Bearer ' + loggedAdminToken)
                .send(updateContract);

            expect(response.body).to.have.property('errors');
            expect(response.body.errors).to.deep.include({
                param: 'contract_length',
                message:
                    'Invalid type of contract. It must be number (1/3/6/12)',
                param: 'start_date',
                message: 'Invalid date format',
                param: 'finish_date',
                message: 'Invalid date format',
                param: 'user_id',
                message: 'Id required'
            });
        });

        it('returns 403 when trying to edit as normal user', async () => {
            const updateContract = {
                contract_length: 12,
                start_date: '2019-12-12',
                finish_date: '2020-12-12',
                user_id: userId
            };
            const response = await request
                .put(`/contracts/${contractBadId}`)
                .set('Authorization', 'Bearer ' + loggedUserToken)
                .send(updateContract);

            expect(response.statusCode).to.equal(403);
        });

        it("returns 404 if contract hasn't been found", async () => {
            const updateContract = {
                contract_length: 12,
                start_date: '2019-12-12',
                finish_date: '2020-12-12',
                user_id: userId
            };

            const response = await request
                .put(`/contracts/99999999`)
                .set('Authorization', 'Bearer ' + loggedAdminToken)
                .send(updateContract);

            expect(response.statusCode).to.equal(404);
        });
    });

    describe('DELETE /contracts', async () => {
        it('returns 204 when trying to delete contract as admin', async () => {
            const response = await request
                .delete(`/contracts/${contractId}`)
                .set('Authorization', 'Bearer ' + loggedAdminToken);

            expect(response.statusCode).to.equal(204);
        });

        it('returns 403 when trying to delete as normal user', async () => {
            const response = await request
                .delete(`/contracts/${contractId}`)
                .set('Authorization', 'Bearer ' + loggedUserToken);

            expect(response.statusCode).to.equal(403);
        });

        it("returns 404 if contract hasn't been found", async () => {
            const response = await request
                .delete(`/contracts/9999999`)
                .set('Authorization', 'Bearer ' + loggedAdminToken);

            expect(response.statusCode).to.equal(404);
        });
    });
});
