/* Add ingredient
        - 401 if not Authenticated
        - 403 if not Admin
        - 400 if bad request
        - 200 if succeeded
*/

const request = require('supertest');
const { authHeader } = require('../../../utils/constants');
const { User, Roles } = require('../../../models/user')
const { Ingredient } = require('../../../models/ingredient')

let server;
const prefix = '/api/ingredients';

describe(prefix, () => {
    beforeAll(async() => server = await require('../../../index'))
    afterAll(async() => {
        await server.close();
        await new Promise(resolve => setTimeout(() => resolve(), 500)); // avoid jest open handle error
    })

    describe('Add ingredient', () => {
        let token, ingredient;
        const postIngredient = () => {
            const headers = token ? {
                [authHeader]: token
            } : {};
            return request(server).post(prefix + '/')
                .set(headers).send(ingredient);
        }

        beforeEach(() => {
            token = new User({ roles: [Roles.Admin] }).generateAuthToken();
            ingredient = { name: 'banana', category: 'fruit' };
        })

        afterEach(async(done) => {
            await Ingredient.remove({});
            done();
        })

        it('Should return 401 if user not authorized', async() => {
            token = null;
            const response = await postIngredient();
            expect(response.status).toBe(401);
        })
        it('Should return 403 if user not admin', async() => {
            token = new User({ roles: [Roles.User] }).generateAuthToken();
            const response = await postIngredient();
            expect(response.status).toBe(403);
        })
        describe('Test valid ingredient', () => {
            it('Should return 400 if name is undefined', async() => {
                delete ingredient.name;
                const response = await postIngredient();
                expect(response.status).toBe(400);
            })
            it('Should return 400 if name is already added', async() => {
                let response = await postIngredient();
                expect(response.status).toBe(200)

                response = await postIngredient();
                expect(response.status).toBe(400);
            })
        })
        it('Should return 200 if ingredient is added successfuly', async() => {
            const response = await postIngredient();
            expect(response.status).toBe(200);
            expect(response.body).toMatchObject(ingredient);

        })
    })
})