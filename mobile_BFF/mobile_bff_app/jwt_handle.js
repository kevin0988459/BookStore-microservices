const jwt = require('jsonwebtoken');
/**
 * JWT middleware
 */
const validateJwtMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).send({ message: 'Authorization token is missing or not provided' });
    }
    const token = authHeader.split(' ')[1];
    try {
        // Decode token (without verifying the signature for this example)
        const decoded = jwt.decode(token);
        // Check the validity of the token
        console.log(decoded)
        if (!decoded) {
            return res.status(401).send({ message: 'Invalid token' });
        }
        const { sub, exp, iss } = decoded;
        if (!decoded || typeof decoded.sub === 'undefined' || typeof decoded.exp === 'undefined' || typeof decoded.iss === 'undefined') {
            return res.status(401).send({ message: 'Invalid token - Missing claims' });
        }
        const currentTime = Math.floor(Date.now() / 1000);
        if (!['starlord', 'gamora', 'drax', 'rocket', 'groot'].includes(sub) ||
            exp < currentTime ||
            iss !== 'cmu.edu') {
            return res.status(401).send({ message: 'Unauthorized - Invalid token claims' });
        }
        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        return res.status(401).send({ message: 'Error validating token' });
    }
};

module.exports = validateJwtMiddleware;
