import { Router } from "express";
import { check } from 'express-validator'

import { authMiddleware } from "../middlewares/auth.middleware.js";
import { checkValidationResult } from "../utils/helper.js";
import { getLoggedInUser, login, register } from "../controllers/auth.controller.js";

const authRoutes = Router();

// @route    POST /api/auth/login
// @desc     Login user
// @access   Public
authRoutes.post('/login', [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 }),
    checkValidationResult
], login)

// @route    POST /api/auth/register
// @desc     Register user
// @access   Public
authRoutes.post('/register', [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 }),
    checkValidationResult
], register)

// @route    GET /api/auth/me
// @desc     Get the authenticated user's profile
// @access   Private
authRoutes.get('/me', authMiddleware, getLoggedInUser)

export default authRoutes