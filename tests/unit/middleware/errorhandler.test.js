const request = require('supertest');
const userModel = require('../../../models/user');
const { authHeaderKey } = require('../../../utils/constants')

//const errorhandler = require('../../../middleware/errorhandler');
describe('Error handler middleware', () => {
    let server; //, mockErrorFunc;

    beforeAll(async() => {
        // mockErrorFunc = jest.fn();
        // errorhandler.handle = (error, req, res, next) => {
        //     mockErrorFunc(error, req, res, next);
        //     next();
        // };
        server = await require('../../../index');
    })

    afterAll(async() => {
        await server.close();
        await new Promise(resolve => setTimeout(() => resolve(), 500)); // avoid jest open handle error
    });

    it('Should call error handle middleware when unhandled exception fires', async() => {
        const errorMessage = 'Invalid data to fire exception';
        userModel.validateUser = jest.fn().mockImplementation(() => { throw errorMessage });

        const token = new userModel.User({ roles: [userModel.Roles.Admin] }).generateAuthToken();
        const response = await request(server).post('/api/users')
            .set({
                [authHeaderKey]: token
            })
            .send({});
        expect(response.status).toBe(500);

        // expect(mockErrorFunc).toHaveBeenCalled();
        // expect(mockErrorFunc.mock.calls[0][0]).toBe(errorMessage);
    })
})