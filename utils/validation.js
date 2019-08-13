const objectid = require('objectid');
module.exports = {
    isValidId: (id) => {
        return objectid.isValid(id);
    },
    /**
     * hasLength: if true check if array has length or empty and if empty return false
     */
    isValidArray: (arr, hasLength = false) => {
        if (!arr || !Array.isArray(arr))
            return false;

        if (hasLength && arr.length === 0)
            return false;

        return true;
    }
}