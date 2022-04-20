const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function (req, res, next) { // Get token from header
    const token = req.header('x-auth-token');

    // Check if no token
    if (! token) {
        return res.status(401).json({msg: 'No token, authorization denied'});
    }

    // Verify token if there is one
    try { // decode using 'verify' and then place in decode object
        const decoded = jwt.verify(token, config.get('jwtSecret'));

        // User was previously attached in the payload of the token
        // We can then use this user in our protected routes
        req.user = decoded.user;
        next();
    } catch (err) {
        res.status(401).json({msg: 'Token is not valid'});
    }

}
