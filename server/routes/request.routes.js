import { Router } from "express";
import { check } from "express-validator";

import { authMiddleware } from "../middlewares/auth.middleware.js";
import { adminMiddleware } from "../middlewares/admin.middleware.js";
import { createRequest, deleteRequest, getAllRequests, getAllRequestsOfUser, updateStatus } from "../controllers/request.controller.js";
import { checkValidationResult } from "../utils/helper.js";

const requestRoutes = Router();

// @desc    Create a new request (Guest only)
// @route   POST /api/requests
// @access  Private (Guest)
requestRoutes.post('/', authMiddleware, adminMiddleware, [
    check('roomId', 'Room Id is required').not().isEmpty(),
    check('description', 'Description is required').not().isEmpty(),
    checkValidationResult
], createRequest)

// @desc    Delete a request (Admin only)
// @route   DELETE /api/requests/:requestId
// @access  Private (Admin)
requestRoutes.delete('/:requestId', authMiddleware, adminMiddleware, deleteRequest)

// @desc    Update a request (Admin only)
// @route   PUT /api/requests/:requestId
// @access  Private (Admin)
requestRoutes.put('/:requestId', authMiddleware, adminMiddleware, [
    check('status', 'Status is required').not().isEmpty(),
    checkValidationResult
], updateStatus)

// @desc    Get all requests
// @route   GET /api/requests
// @access  Private (Admin)
requestRoutes.get('/', authMiddleware, adminMiddleware, [
    check('page', 'Page is required').not().isEmpty(),
    check('limit', 'Limit is required').not().isEmpty(),
    check('sort', 'Sort is required').not().isEmpty(),
    checkValidationResult
], getAllRequests)

// @desc    Get all requests of a user
// @route   GET /api/requests/user
// @access  Private (Guest)
requestRoutes.get('/user', authMiddleware, [
    check('page', 'Page is required').not().isEmpty(),
    check('limit', 'Limit is required').not().isEmpty(),
    check('sort', 'Sort is required').not().isEmpty(),
    checkValidationResult
], getAllRequestsOfUser)

export default requestRoutes