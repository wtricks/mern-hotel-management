import jwt from 'jsonwebtoken'

/**
 * This middleware verifies the JWT token sent in the Authorization header.
 * If the token is valid, it adds the user's information to the request object.
 * If the token is invalid, it sends a 401 Unauthorized response.
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 * @returns {void}
 */
export const authMiddleware = (req, res, next) => {
    const { authorization } = req.headers;

    if (!authorization) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const token = authorization.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded.user;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
}