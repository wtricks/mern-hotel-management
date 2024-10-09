import Request from "../models/request.model.js"
import Room from "../models/room.model.js";

/**
 * @route   POST /api/requests
 * @desc    Create a new request (Guest only)
 * @access  Private (Guest)
 * @param   {Request} req
 * @param   {Response} res
 * @returns {Promise<void>}
 */
export const createRequest = async (req, res) => {
    const { description, roomId } = req.body;

    try {

        // Check if the room is available
        const room = await Room.findById(roomId);
        if (!room) {
            return res.status(404).json({ message: 'Room not found' });
        }

        // Create a new request
        const request = new Request({
            guest: req.user.id,
            room: req.params.id,
            description
        });

        await request.save();

        res.status(200).json({ message: 'Request created successfully', data: request });

    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Server error' });
    }
}

/**
 * @route   GET /api/requests
 * @desc    Get all requests (Admin only)
 * @access  Private (Admin)
 * @param   {Request} req
 * @param   {Response} res
 * @returns {Promise<void>}
 * @query   {Number} page - The page number to retrieve
 * @query   {Number} limit - The number of requests to retrieve per page
 * @query   {String} sort - The sorting order (asc/desc)
 */
export const getAllRequests = async (req, res) => {
    const { page, limit, sort = 'desc' } = req.query;

    const options = {
        page: parseInt(page) || 1,
        limit: parseInt(limit) || 10,
        sort: { createdAt: sort == 'asc' ? 1 : -1 },
    };

    try {
        const requests = await Request.paginate({}, options);
        res.status(200).json({ data: requests });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Server error' });
    }
}

/**
 * @route   PUT /api/requests/:requestId
 * @desc    Update a request's status (Admin only)
 * @access  Private (Admin)
 * @param   {Request} req
 * @param   {Response} res
 * @returns {Promise<void>}
 * @body    {String} status - The status to update the request with
 */
export const updateStatus = async (req, res) => {
    try {
        const request = await Request.findById(req.params.requestId);
        if (!request) {
            return res.status(404).json({ message: 'Request not found' });
        }
        request.status = req.body.status;
        await request.save();
        res.status(200).json({ message: 'Request updated successfully', data: request });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Server error' });
    }
}

/**
 * @route   DELETE /api/requests/:requestId
 * @desc    Delete a request (Admin only)
 * @access  Private (Admin)
 * @param   {Request} req
 * @param   {Response} res
 * @returns {Promise<void>}
 */
export const deleteRequest = async (req, res) => {
    try {
        const request = await Request.findById(req.params.requestId);
        if (!request || request.status === 'pending') {
            return res.status(404).json({ message: 'Request not found' });
        }
        await request.remove();
        res.status(200).json({ message: 'Request deleted successfully', data: request });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Server error' });
    }
}

/**
 * @route   GET /api/requests/user
 * @desc    Get all requests made by the logged-in user (Guest only)
 * @access  Private (Guest)
 * @param   {Request} req
 * @param   {Response} res
 * @returns {Promise<void>}
 * @query   {Number} page - The page number to retrieve
 * @query   {Number} limit - The number of requests to retrieve per page
 * @query   {String} sort - The sorting order (asc/desc)
 */
export const getAllRequestsOfUser = async (req, res) => {
    const { page, limit, sort = 'desc' } = req.query;
    const userId = req.user.id;

    const options = {
        page: parseInt(page) || 1,
        limit: parseInt(limit) || 10,
        sort: { createdAt: sort == 'asc' ? 1 : -1 },
    };

    try {
        const requests = await Request.paginate({ guest: userId }, options);
        res.status(200).json({ data: requests });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Server error' });
    }
}