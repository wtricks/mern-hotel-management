import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';

const { genSalt, hash, compare } = bcryptjs;

import User from '../models/user.model.js';

/**
 * @route   POST /api/auth/register
 * @desc    Register a user
 * @access  Public
 * @param   {Request} req
 * @param   {Response} res
 * @returns {Promise<void>}
 */
export const register = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        // Check if user already exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Create a new user
        user = new User({
            name,
            email,
            password,
            role: 'guest', // Default role is guest
        });

        // Hash the password
        const salt = await genSalt(10);
        user.password = await hash(password, salt);

        // Save the user
        await user.save();

        // Generate a JWT token
        const payload = {
            user: {
                id: user.id,
                role: user.role,
            },
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET, // Store secret in environment variables
            { expiresIn: '1h' }, // Token expires in 1 hour
            (err, token) => {
                if (err) throw err;
                res.json({ data: { token, user: {...user.toJSON(), password: undefined, paymentHistory: undefined} } });
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).send({ message: 'Server error' });
    }
}

/**
 * @route   POST /api/auth/login
 * @desc    Login a user
 * @access  Public
 * @param   {Request} req
 * @param   {Response} res
 * @returns {Promise<void>}
 */
export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if user exists
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Check if password matches
        const isMatch = await compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Generate a JWT token
        const payload = {
            user: {
                id: user.id,
                role: user.role,
            },
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '1h' },
            (err, token) => {
                if (err) throw err;
                res.json({ data: { token, user: {...user.toJSON(), password: undefined, paymentHistory: undefined} } });
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).send({ message: 'Server error' });
    }
}

/**
 * @route   GET /api/auth/me
 * @desc    Get the authenticated user's profile
 * @access  Private
 * @param   {Request} req
 * @param   {Response} res
 * @returns {Promise<void>}
 */
export const getLoggedInUser = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select(['-password', '-paymentHistory']); // Exclude password field
        res.json({ data: user });
    } catch (err) {
        console.error(err.message);
        res.status(500).send({ message: 'Server error' });
    }
};
