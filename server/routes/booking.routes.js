import { Router } from "express";
import { check, param } from "express-validator";

import {
    createBooking,
    getAllBookings,
    getBookingById,
    confirmPayment,
    confirmManualPayment,
    cancelBooking,
    updateBookingStatus,
    addFeedback,
    getUserBookings
} from "../controllers/booking.controller.js";

import { checkValidationResult } from "../utils/helper.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { adminMiddleware } from "../middlewares/admin.middleware.js";

const bookingRoutes = Router();

const bookingValidation = [
    check('roomId')
        .notEmpty()
        .withMessage('Room ID is required')
        .isMongoId()
        .withMessage('Invalid Room ID'),
    check('checkInDate')
        .notEmpty()
        .withMessage('Check-in date is required')
        .isISO8601()
        .withMessage('Invalid date format'),
    check('checkOutDate')
        .notEmpty()
        .withMessage('Check-out date is required')
        .isISO8601()
        .withMessage('Invalid date format'),
    check('specialRequests')
        .optional()
        .isString()
        .withMessage('Special requests must be a string'),
];

// @route   POST /api/bookings
// @desc    Create a new booking
// @access  Private (Guest)
bookingRoutes.post('/', authMiddleware, [bookingValidation, checkValidationResult], createBooking);

// @route   GET /api/bookings
// @desc    Get all bookings
// @access  Private (Admin)
bookingRoutes.get('/all', authMiddleware, adminMiddleware, getAllBookings);

// @route   GET /api/bookings/user
// @desc    Get all requests of a user
// @access  Private (Guest)
bookingRoutes.get('/user', authMiddleware, getUserBookings);

// @route   POST /api/bookings/confirm-payment
// @desc    Confirm payment
// @access  Public (WebHook)
bookingRoutes.post('/confirm-payment', confirmPayment);

// @route   POST /api/bookings/manual-payment
// @desc    Confirm manual payment
// @access  Private (Admin)
bookingRoutes.post('/manual-payment/:bookingId', [
    param('bookingId')
        .isMongoId()
        .withMessage('Invalid booking ID'),
    check('amount')
        .isFloat({ gt: 0 })
        .withMessage('Amount must be a positive number'),
    checkValidationResult
], authMiddleware, adminMiddleware, confirmManualPayment);

// @route   POST /api/bookings/cancel
// @desc    Cancel booking
// @access  Private (Admin)
bookingRoutes.post('/cancel/:id', [
    check('id')
        .isMongoId()
        .withMessage('Invalid booking ID'),
    checkValidationResult
], authMiddleware, adminMiddleware, cancelBooking);

// @route   PATCH /api/bookings/:id/status
// @desc    Update booking status
// @access  Private (Admin)
bookingRoutes.patch('/:id/status', [
    check('id')
        .isMongoId()
        .withMessage('Invalid booking ID'),
    check('status')
        .notEmpty()
        .withMessage('Status is required')
        .isIn(['checked-in', 'checked-out'])
        .withMessage('Invalid status value'),
    checkValidationResult
], authMiddleware, adminMiddleware, updateBookingStatus);

// @route   POST /api/bookings/feeback
// @desc    Add feeback
// @access  Private (GUEST)
bookingRoutes.post('/feedback/:bookingId', authMiddleware, addFeedback)

// @route   GET /api/bookings/:id
// @desc    Get booking by ID
// @access  Private (Admin)
bookingRoutes.get('/:id', [
    check('id')
        .isMongoId()
        .withMessage('Invalid booking ID'),
    checkValidationResult
], getBookingById);

export default bookingRoutes;
