import Booking from '../models/booking.model.js';
import Room from '../models/room.model.js';
import Payment from '../models/payment.model.js';
import GuestFeedback from '../models/feedback.model.js';
import User from '../models/user.model.js';

/**
 * @route   GET /api/reports/occupancy-rate
 * @desc    Get the occupancy rate report
 * @access  Private (Admin)
 * @param   {Request} req
 * @param   {Response} res
 * @returns {Promise<void>}
 * @header  {String} Authorization - The JWT token
 * @response {Object} - The occupancy rate report
 * @response {Number} totalRooms - The total number of rooms
 * @response {Number} occupiedRooms - The number of occupied rooms
 * @response {String} occupancyRate - The occupancy rate in percentage
 */
export const getOccupancyRateReport = async (req, res) => {
    try {
        const totalRooms = await Room.countDocuments();
        const occupiedRooms = await Booking.countDocuments({
            status: 'booked',
            checkInDate: { $lte: new Date() },
            checkOutDate: { $gte: new Date() },
        });

        const occupancyRate = (occupiedRooms / totalRooms) * 100;
        res.status(200).json({
            totalRooms,
            occupiedRooms,
            occupancyRate: `${occupancyRate.toFixed(2)}%`,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error generating occupancy rate report' });
    }
};

/**
 * @route   GET /api/reports/revenue
 * @desc    Get the revenue report
 * @access  Private (Admin)
 * @param   {Request} req
 * @param   {Response} res
 * @returns {Promise<void>}
 * @header  {String} Authorization - The JWT token
 * @query   {String} startDate - The start date of the report
 * @query   {String} endDate - The end date of the report
 * @response {Object} - The revenue report
 * @response {String} startDate - The start date of the report
 * @response {String} endDate - The end date of the report
 * @response {String} totalRevenue - The total revenue
 */
export const getRevenueReport = async (req, res) => {
    const { startDate, endDate } = req.query;

    try {
        const payments = await Payment.aggregate([
            {
                $match: {
                    createdAt: { $gte: new Date(startDate), $lte: new Date(endDate) },
                    status: 'completed',
                },
            },
            {
                $group: {
                    _id: null,
                    totalRevenue: { $sum: '$amount' },
                },
            },
        ]);

        const totalRevenue = payments.length ? payments[0].totalRevenue : 0;
        res.status(200).json({
            startDate,
            endDate,
            totalRevenue: `$${totalRevenue}`,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error generating revenue report' });
    }
};


/**
 * @route   GET /api/reports/guest-satisfaction
 * @desc    Get the guest satisfaction report
 * @access  Private (Admin)
 * @param   {Request} req
 * @param   {Response} res
 * @returns {Promise<void>}
 * @header  {String} Authorization - The JWT token
 * @response {Object} - The guest satisfaction report
 * @response {String} averageRating - The average rating
 * @response {Number} totalFeedbacks - The total number of feedbacks
 */
export const getGuestSatisfactionReport = async (req, res) => {
    try {
        const feedbacks = await GuestFeedback.aggregate([
            {
                $group: {
                    _id: null,
                    averageRating: { $avg: '$rating' },
                    totalFeedbacks: { $sum: 1 },
                },
            },
        ]);

        const averageRating = feedbacks.length ? feedbacks[0].averageRating : 0;
        const totalFeedbacks = feedbacks.length ? feedbacks[0].totalFeedbacks : 0;

        res.status(200).json({
            averageRating: averageRating.toFixed(2),
            totalFeedbacks,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error generating guest satisfaction report' });
    }
};


export const getStats = async (req, res) => {
    try {
        const totalRooms = await Room.countDocuments();
        const occupiedRooms = await Booking.countDocuments({
            status: 'booked',
            checkInDate: { $lte: new Date() },
            checkOutDate: { $gte: new Date() },
        });

        const totalUsers = await User.countDocuments();
        const totalBookings = await Booking.countDocuments();

        const totalPayments = await Payment.aggregate([
            { $match: { status: 'completed' } }, // Filter only 'completed' payments
            { $group: { _id: null, totalAmount: { $sum: "$amount" } } } // Sum the 'amount' field
        ]);

        const totalAmount = totalPayments.length > 0 ? totalPayments[0].totalAmount : 0;

        res.status(200).json({ data: {
            totalRooms,
            occupiedRooms,
            totalUsers,
            totalBookings,
            totalAmount
        }});
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error fetching stats' });
    }
}