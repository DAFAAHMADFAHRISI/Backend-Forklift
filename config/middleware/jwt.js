var jwt = require('jsonwebtoken')

function verifyToken(req, res, next) {
    const token = req.header('Authorization')?.replace('Bearer', '');
if (!token) {
    return req.status(403).json({message: 'No token provided'});
}

jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
        return res.status(403).json({message: 'Invalid or expired token' });
    }
    req.user = decoded;
    next();
});
}

module.exports = verifyToken;