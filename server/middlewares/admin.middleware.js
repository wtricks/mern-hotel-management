/**
 * @function adminMiddleware
 * @description This middleware checks if the user is an admin. If not, it returns a 403 response.
 * @param {Request} req - The request object
 * @param {Response} res - The response object
 * @param {NextFunction} next - The next middleware function
 * @returns {void}
 */
export const adminMiddleware = (req, res, next) => {
    const { id, role } = req.user || {};

    if (role !== 'admin') {
        return res.status(403).json({ message: 'Access denied' });
    }

    next();
}