import Room from "../models/room.model.js";
import { upload } from "../config/multer.js";
import fs from 'fs'

/**
 * @route   POST /api/rooms
 * @desc    Create a new room
 * @access  Private (Admin)
 * @param   {Request} req
 * @param   {Response} res
 * @returns {Promise<void>}
 */
export const createRoom = async (req, res) => {
    const {
        name,
        description,
        roomNumber,
        type,
        price
    } = req.body;

    if (!name || !description || !roomNumber || !type || !price) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        const image =  req.file ? ('/uploads/' + req.file.filename) : ''

        // Create a new room
        const room = new Room({
            name,
            description,
            roomNumber,
            type,
            price,
            image
        });

        // Save the room
        await room.save();

        res.status(201).json({ message: 'Room created successfully', data: room });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Server error' });
    }
};

/**
 * @route   GET /api/rooms
 * @desc    Get all rooms
 * @access  Public
 * @param   {Request} req
 * @param   {Response} res
 * @returns {Promise<void>}
 * @query   {Object} query - The query object to filter rooms
 * @query   {Number} page - The page number to retrieve
 * @query   {Number} limit - The number of rooms to retrieve per page
 * @query   {String} sort - The field to sort rooms by
 * @query   {String} sortBy - The sorting order (asc/desc)
 */
export const getAllRooms = async (req, res) => {
    const { page = 1, limit = 10, sort = 'desc', sortBy, search = '', minPrice, maxPrice, availability, type = 'all' } = req.query;

    // Build the filter object
    const filter = {};

    if (search) {
        filter.name = { $regex: search, $options: 'i' };
    }

    if (minPrice || maxPrice) {
        filter.price = {};
        if (minPrice) filter.price.$gte = minPrice;
        if (maxPrice) filter.price.$lte = maxPrice;
    }

    if (availability !== undefined) {
        filter.availability = availability === 'true';
    }

    if (type && type !== 'all') {
        filter.type = type;
    }

    const options = {
        page: parseInt(page) || 1,
        limit: parseInt(limit) || 10,
        sort: {
            [sortBy || 'createdAt']: sort === 'asc' ? 1 : -1
        }
    };

    try {
        const rooms = await Room.find(filter)
            .skip((options.page - 1) * options.limit)
            .limit(options.limit)
            .sort(options.sort);

        const totalRooms = await Room.countDocuments(filter);

        res.status(200).json({ data: {rooms, total: totalRooms == 0 ? 1 : Math.ceil(totalRooms / options.limit) } });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Server error' });
    }
};

/**
 * @route   GET /api/rooms/:roomId
 * @desc    Get a room by ID
 * @access  Public
 * @param   {Request} req
 * @param   {Response} res
 * @returns {Promise<void>}
 */
export const getRoomById = async (req, res) => {
    try {
        const room = await Room.findById(req.params.roomId);

        if (!room) {
            return res.status(404).json({ message: 'Room not found' });
        }

        res.status(200).json({data:room});
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Server error' });
    }
};

/**
 * @route   PUT /api/rooms/:roomId
 * @desc    Update a room (Admin only)
 * @access  Private (Admin)
 * @param   {Request} req
 * @param   {Response} res
 * @returns {Promise<void>}
 */
export const updateRoom = async (req, res) => {
    try {
        const room = await Room.findById(req.params.roomId);

        if (!room) {
            return res.status(404).json({ message: 'Room not found' });
        }

        room.name = req.body.name || room.name;
        room.description = req.body.description || room.description;
        room.roomNumber = req.body.roomNumber || room.roomNumber;
        room.type = req.body.type || room.type;
        room.price = req.body.price || room.price;
        room.availability = req.body.availability || room.availability;
        room.housekeepingStatus = req.body.housekeepingStatus || room.housekeepingStatus;

        if (req.file) {
            room.image = '/uploads/' + req.file.filename;
        }

        await room.save();
        res.status(200).json({ message: 'Room updated successfully', data: room });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Server error' });
    }
};

/**
 * @route   DELETE /api/rooms/:roomId
 * @desc    Delete a room
 * @access  Private (Admin)
 * @param   {Request} req
 * @param   {Response} res
 * @returns {Promise<void>}
 */
export const deleteRoom = async (req, res) => {
    try {
        const room = await Room.findById(req.params.roomId);

        if (!room) {
            return res.status(404).json({ message: 'Room not found' });
        }

        await room.deleteOne({ roomId: req.params.roomId });
        fs.unlinkSync('../uploads/' + room.image);
        res.status(200).json({ message: 'Room deleted successfully' });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Server error' });
    }
};


export const uploadImage = upload.single('image');