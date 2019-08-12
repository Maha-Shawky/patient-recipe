const request = require('supertest');
const { User, Roles } = require('../../../models/user');
const config = require('config');
const jwt = require('jsonwebtoken');

let server;
const prefix = '/api/users';
describe(prefix, () => {
    beforeAll(() => {
        server = require('../../../index');
    })

    afterAll(async() => {
        await server.close();
        await new Promise(resolve => setTimeout(() => resolve(), 500)); // avoid jest open handle error
    });

    describe('Create new user', () => {
        let name, password, roles, email;
        beforeEach(() => {
            name = 'testName';
            password = 'testPassword';
            roles = [Roles.User];
            email = 'test@gmail.com';
        })
        afterEach(async() => {
            await User.remove({});
        })
        const postUser = () => {
            return request(server).post(prefix + '/register')
                .send({ name, password, roles, email });
        }
        it('Should return 400 if name is undefined', async() => {
            name = undefined;
            const result = await postUser();
            expect(result.status).toBe(400);
        })
        it('Should return 400 if name is less than 2', async() => {
            name = 'a';
            const result = await postUser();
            expect(result.status, result.text).toBe(400);
        })
        it('Should return 400 if name is greater than 50', async() => {
            name = new Array(52).join('a');
            const result = await postUser();
            expect(result.status).toBe(400);
        })
        it('Should return 400 if password is undefined', async() => {
            password = undefined;
            let result = await postUser();
            expect(result.status).toBe(400);
        })
        it('Should return 400 if password is less than 5', async() => {
            password = 'x';
            let result = await postUser();
            expect(result.status).toBe(400);
        })
        it('Should return 400 if password is greater than 255', async() => {
            password = new Array(280).join('x')
            let result = await postUser();
            expect(result.status).toBe(400);
        })
        it('Should return 400 if email is undefined', async() => {
            email = undefined;
            let result = await postUser();
            expect(result.status).toBe(400);
        })
        it('Should return 400 if email is incorrect', async() => {
            email = 'bad format';
            let result = await postUser();
            expect(result.status).toBe(400);
        })
        it('Should return 400 if email is greater than 64', async() => {
                email = new Array(60).join('x') + '@yahoo.com';
                let result = await postUser();
                expect(result.status).toBe(400);
            })
            //TODO test roles

        // it('Should return 401 if non admin user is calling the endpoint', async() => {
        //     roles = ['user']
        //     result = await postUser();
        //     expect(result.status).toBe(401);

        // })
        it('Should return 200 if valid user', async() => {
            let result = await postUser();
            expect(result.status).toBe(200);
            expect(result.body).toMatchObject({ name, email, roles })

        })
        it('Should return 400 if user already exist', async() => {
            let result = await postUser();
            result = await postUser();
            expect(result.status).toBe(400);

        })
    })
    describe('Login user', () => {
        //async issue => https://github.com/facebook/jest/issues/1256
        let registeredUser = { name: 'testName', password: 'testPassword', roles: [Roles.User], email: 'user@gmail.com' };
        beforeAll(async(done) => {
            await request(server).post(prefix + '/register')
                .send(registeredUser);
            done();
        })
        afterAll(async(done) => {
            await User.remove({});
            done();
        })
        it('Should return 400 if undefined email', async() => {
            let response = await request(server).post(prefix + '/login')
                .send({ password: 'testPassword' });
            expect(response.status).toBe(400);
        })
        it('Should return 404 if  email not found', async() => {
            let response = await request(server).post(prefix + '/login')
                .send({ email: 'fake@gmail.com', password: 'testPassword' });
            expect(response.status).toBe(404);
        })
        it('Should return 400 if undefined password', async() => {
            let response = await request(server).post(prefix + '/login')
                .send({ email: 'user@gmail.com' });
            expect(response.status).toBe(400);
        })
        it('Should return 404 if  password doesn\'t match', async() => {
            let response = await request(server).post(prefix + '/login')
                .send({ email: 'user@gmail.com', password: 'fakePassword' });
            expect(response.status).toBe(404);
        })
        it('Should return 200 and valid token if login is succeeded', async() => {
            const loginUser = { email: 'user@gmail.com', password: 'testPassword' };

            let response = await request(server).post(prefix + '/login').send(loginUser);
            expect(response.status, response.text).toBe(200);

            const { password, ...expected } = registeredUser;
            expect(response.body).toMatchObject(expected)

            const token = response.header['x-auth-token'];
            const decoded = jwt.verify(token, config.get('jwtSecret'));
            expect(decoded.email, 'Invalid token').toBe(loginUser.email);
        })

    })
})