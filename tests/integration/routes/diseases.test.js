const request = require('supertest');
const objectid = require('objectid');
const { authHeaderKey } = require('../../../utils/constants');
const { User, Roles } = require('../../../models/user')
const { Ingredient } = require('../../../models/ingredient')
const { Disease } = require('../../../models/disease')

let server;
const prefix = '/api/diseases';

describe(prefix, () => {
    const addIngredient = async(obj) => {
        const ingredient = await new Ingredient(obj).save();
        return ingredient._id.toString();
    }

    let token, disease;
    const postDisease = () => {
        const headers = token ? {
            [authHeaderKey]: token
        } : {};
        return request(server).post(prefix + '/')
            .set(headers).send(disease);
    }

    beforeEach(() => {
        token = new User({ roles: [Roles.Admin] }).generateAuthToken();
        disease = { name: 'high blood pressure', forbiddenFood: [], recommendedFood: [] };
    })

    afterEach(async(done) => {
        await Ingredient.remove({});
        await Disease.remove({});
        done();
    })


    beforeAll(async() => server = await require('../../../index'))
    afterAll(async() => {
        await server.close();
        await new Promise(resolve => setTimeout(() => resolve(), 500)); // avoid jest open handle error
    })

    describe('Add disease: Post /', () => {
        it('Should return 401 if user not authorized', async() => {
            token = null;
            const response = await postDisease();
            expect(response.status).toBe(401);
        })
        it('Should return 403 if user not admin', async() => {
            token = new User({ roles: [Roles.User] }).generateAuthToken();
            const response = await postDisease();
            expect(response.status).toBe(403);
        })
        describe('Test valid disease', () => {
            it('Should return 400 if name is undefined', async() => {
                delete disease.name;
                const response = await postDisease();
                expect(response.status).toBe(400);
            })
            it('Should return 400 if forbiddenFood is not array of mongo ids', async() => {
                disease.forbiddenFood = ['1234'];
                const response = await postDisease();
                expect(response.status).toBe(400);
            })
            it('Should return 400 if recommendedFood is not array of mongo ids', async() => {
                disease.recommendedFood = ['1234'];
                const response = await postDisease();
                expect(response.status).toBe(400);
            })
        })
        it('Should return 200 if disease is added successfully', async() => {

                const forbiddenId1 = await addIngredient({ name: 'salt', category: 'spices' });
                const forbiddenId2 = await addIngredient({ name: 'butter', category: 'Fats and oils' });

                const recommendedId1 = await addIngredient({ name: 'blueberry', category: 'fruits' });
                const recommendedId2 = await addIngredient({ name: 'beet', category: 'vegetables' });

                disease.forbiddenFood = [forbiddenId1, forbiddenId2];
                disease.recommendedFood = [recommendedId1, recommendedId2];

                const response = await postDisease();
                expect(response.status).toBe(200);
                expect(response.body.forbiddenFood[1]).toMatchObject({ name: 'butter', category: 'Fats and oils' });
                expect(response.body.recommendedFood[1]).toMatchObject({ name: 'beet', category: 'vegetables' });

            })
            //TODO test merging disease with new data
    })

    describe('Check which diseases from a given list disallow this ingredient: Get /ingredients/:ingredientId/forbidden', () => {

        const getRoute = (ingredientId) => `${prefix}/ingredients/${ingredientId}/forbidden`
        const setup = async() => {
            //Add blood pressure disease with one forbidden ingredient
            const forbiddenId1 = await addIngredient({ name: 'butter', category: 'Fats and oils' });
            disease.forbiddenFood = [forbiddenId1];
            let response = await postDisease();
            const diseaseId1 = response.body._id;
            expect(response.status).toBe(200);

            //Add Diabetes disease with no forbidden ingredient
            disease = { name: 'Diabetes', recommendedFood: [], forbiddenFood: [] };
            response = await postDisease();
            const diseaseId2 = response.body._id;
            expect(response.status).toBe(200);
            return {
                forbiddenId1,
                diseaseId1,
                diseaseId2
            }

        }
        it('Should return 401 if user not authorized', async() => {
            const response = await request(server).get(getRoute('anyId'));
            expect(response.status).toBe(401);
        })

        it('Should return 400 if invalid ingredient id', async() => {
            const response = await request(server).get(getRoute('anyId'))
                .set({
                    [authHeaderKey]: token
                }).query({ diseases: [objectid().toString(), objectid().toString()] });

            expect(response.status).toBe(400);
            expect(response.text).toContain('ingredient');
        })
        it('Should return 400 if  diseases is not valid array ', async() => {
            const response = await request(server).get(getRoute(objectid().toString()))
                .set({
                    [authHeaderKey]: token
                }).query({ diseases: [] });

            expect(response.status).toBe(400);
            expect(response.text).toContain('disease');
        })

        it('Should return 400 if invalid diseases ids ', async() => {;
            const response = await request(server).get(getRoute(objectid().toString()))
                .set({
                    [authHeaderKey]: token
                }).query({ diseases: [objectid().toString(), 'invalid mongo object id'] });

            expect(response.status).toBe(400);
            expect(response.text).toContain('invalid mongo object id');
        })

        it('Should return 200 and list of diseases which ingredient is forbidden from the the list of input diseases', async() => {
            const { forbiddenId1, diseaseId1, diseaseId2 } = await setup();

            response = await request(server).get(getRoute(forbiddenId1))
                .set({
                    [authHeaderKey]: token
                })
                .query({ diseases: [diseaseId1, diseaseId2] });

            expect(response.status).toBe(200);
            expect(response.body.diseases).toEqual([diseaseId1]);
        })
    })
    describe('Future work (not implemented):', () => {

        const notify = (test) => {
            console.warn(`${test.description} Test not implemented`);
        }

        //Could use graphql for different output
        const t1 = it('List diseases : Get /', () => {
            //(pageIndex, pageSize) : diseases<id,name>[], nexturl
            notify(t1);
        })

        const t2 = it('Get disease : Get /:diseaseId', () => {
            //():disease
            notify(t2);
        })

        //Elastic search
        const t3 = it('Auto complete diseases : Get /AutoComplete/:syllable', () => {
            //():disease<id,name>[] limit by n
            notify(t3);
        })
        const t4 = it('Get recommended ingredients : Get /recommended', () => {
            //(diseases<id>[]) -> ingredient<id,name>[]
            notify(t4);
        })
        const t5 = it('Get forbidden ingredients : Get /forbidden', () => {
            //(diseases<id>[]) -> ingredient<id,name>[]
            notify(t5);
        })
        const t6 = it('Get recommended ingredients in specific category: Get /categories/:categoryId/recommended', () => {
            //(diseases<id>[]) -> ingredient<id,name>[]
            notify(t6);
        })
        const t7 = it('delete disease: delete /:diseaseId', () => {
            //() -> succeeded or not
            //Admin only
            notify(t7);
        })
        const t8 = it('Update disease: put /:diseaseId', () => {
            //(updateBatch) -> updated disease
            //Admin only
            notify(t8);
        })
    })

})