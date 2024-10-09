import { Router } from "express";
import { query } from "express-validator";

import { authMiddleware } from "../middlewares/auth.middleware.js";
import { adminMiddleware } from "../middlewares/admin.middleware.js";
import { checkValidationResult } from "../utils/helper.js";
import { getGuestSatisfactionReport, getOccupancyRateReport, getRevenueReport, getStats } from "../controllers/report.controller.js";

const reportRoutes = Router();

// @desc    Get occupancy rate report
// @route   GET /api/report/occupancy
// @access  Private (Admin)
reportRoutes.get('/occupancy', authMiddleware, adminMiddleware, getOccupancyRateReport);

// @desc    Get revenue report
// @route   GET /api/report/revenue
// @access  Private (Admin)
reportRoutes.get('/revenue', authMiddleware, adminMiddleware, [
    query('startDate', 'Start date is required').not().isEmpty(),
    query('endDate', 'End date is required').not().isEmpty(),
    checkValidationResult
], getRevenueReport);

// @desc    Get guest satisfaction report
// @route   GET /api/report/satisfaction
// @access  Private (Admin)
reportRoutes.get('/satisfaction', authMiddleware, adminMiddleware, getGuestSatisfactionReport)

// @desc    Get stats
// @route   GET /api/report/stats
// @access  Private (Admin)
reportRoutes.get('/stats', authMiddleware, adminMiddleware, getStats)

export default reportRoutes