const NodeCache = require('node-cache');
const cache = new NodeCache({ stdTTL: 5 }); 

const cacheMiddleware = (req, res, next) => {
    const cacheKey = req.originalUrl;
    const cachedData = cache.get(cacheKey);

    if (cachedData) {
        console.log("Data diambil dari cache");
        return res.json(cachedData);
    }

    // Override res.json untuk menyimpan response ke cache
    const originalJson = res.json;
    res.json = function(data) {
        cache.set(cacheKey, data);
        console.log(`Data untuk ${cacheKey} disimpan ke cache`);
        return originalJson.call(this, data);
    };

    next();
};

module.exports = cacheMiddleware;
