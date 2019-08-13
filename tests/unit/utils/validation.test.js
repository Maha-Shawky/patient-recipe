const validation = require('../../../utils/validation');
const objectid = require('objectid');

describe('Test validation', () => {
    describe('Test isValidId', () => {
        it('Should return false if id is not object Id', () => {
            const result = validation.isValidId('test');
            expect(result).toBe(false);
        })
        it('Should return false if id is valid object Id as string', () => {
            const result = validation.isValidId('5399aba6e4b0ae375bfdca88');
            expect(result).toBe(true);
        })
        it('Should return false if id is valid object Id', () => {
            const result = validation.isValidId(objectid());
            expect(result).toBe(true);
        })
    })

    describe('Test isValidArray', () => {
        it('Should return false if input is null ', () => {
            const result = validation.isValidArray(null);
            expect(result).toBe(false);
        })
        it('Should return false if input is not array ', () => {
            const result = validation.isValidArray('just string');
            expect(result).toBe(false);
        })
        it('Should return true if input is array ', () => {
            const result = validation.isValidArray([]);
            expect(result).toBe(true);
        })
        it('Should return false if input is empty array and hasLength Flag is true', () => {
            const result = validation.isValidArray([], true);
            expect(result).toBe(false);
        })
        it('Should return true if input is array with elements and hasLength Flag is true', () => {
            const result = validation.isValidArray([123]);
            expect(result).toBe(true);
        })
    })
})