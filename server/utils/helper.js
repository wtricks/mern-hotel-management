import { validationResult } from "express-validator";

/**
 * Checks if there are any validation errors in the request and if so, sends a 400 response with the errors.
 * Otherwise, calls the next middleware function.
 * @param {Request} req - The Express request object
 * @param {Response} res - The Express response object
 * @param {NextFunction} next - The next middleware function to call
 */
export const checkValidationResult = (req, res, next) => {
    const result = validationResult(req);

    if (!result.isEmpty()) {
        return res.status(400).json({ errors: result.array() });
    }

    next();
}