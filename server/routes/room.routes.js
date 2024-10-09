import { Router } from "express";

import { authMiddleware } from "../middlewares/auth.middleware.js";
import { adminMiddleware } from "../middlewares/admin.middleware.js";
import { createRoom, deleteRoom, getAllRooms, getRoomById, updateRoom, uploadImage } from "../controllers/room.controller.js";

const roomRoutes = Router();

// @desc    Create a new room (Admin only)
// @route   POST /api/rooms
// @access  Private (Admin)
roomRoutes.post('/', authMiddleware, adminMiddleware, uploadImage, createRoom)

// @desc    Delete a room (Admin only)
// @route   DELETE /api/rooms/:roomId
// @access  Private (Admin)
roomRoutes.delete('/:roomId', authMiddleware, adminMiddleware, deleteRoom)

// @desc    Update a room (Admin only)
// @route   PUT /api/rooms/:roomId
// @access  Private (Admin)
roomRoutes.put('/:roomId', authMiddleware, adminMiddleware, uploadImage, updateRoom)

// @desc    Get room details by ID
// @route   GET /api/rooms/:roomId
// @access  Public
roomRoutes.get('/:roomId', getRoomById)

// @desc    Get all rooms
// @route   GET /api/rooms
// @access  Public
roomRoutes.get('/', getAllRooms)

export default roomRoutes