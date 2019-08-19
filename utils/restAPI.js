const { URL, URLSearchParams } = require('url');
const { isValidArray } = require('./validation');


getReqUrl = req => {
    return `${req.protocol}://${req.get('host')}${req.originalUrl}`;
}

const getNextUrl = (urlStr, pageIndex) => {
    const url = new URL(urlStr);
    const queryString = url.search;
    const searchParams = new URLSearchParams(queryString);
    searchParams.set('pageIndex', pageIndex + 1);
    url.search = searchParams.toString();

    return url.toString();
}
const isLastPage = (dataSize, pageSize) => {
    return (!pageSize || dataSize === 0 || dataSize < pageSize);
}

const getPaginated = async(req, model, filterCallBack = null) => {
    const pageIndex = parseInt(req.query.pageIndex) || 0;
    const pageSize = parseInt(req.query.pageSize);
    filterCallBack = filterCallBack || function(obj) {
        const { __v, ...rest } = obj;
        return rest;
    }
    const offset = pageIndex * pageSize;

    const query = model.find().skip(offset);
    if (pageSize)
        query.limit(pageSize);

    let result = await query;
    result = result.map(obj => filterCallBack(obj._doc));

    if (isLastPage(result.length, pageSize))
        return { result }

    const nextUrl = getNextUrl(getReqUrl(req), pageIndex)
    return {
        nextUrl,
        result
    }
}
module.exports = {
    getReqUrl,
    getPaginated
}