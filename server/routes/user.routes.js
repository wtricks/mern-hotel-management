import { Router } from 'express'

import { getUserById, updateUser, getAllUsers, deleteUser } from '../controllers/user.controller.js'
import { adminMiddleware } from '../middlewares/admin.middleware.js'
import { authMiddleware } from '../middlewares/auth.middleware.js'

const userRoutes = Router()

// @route   PUT /api/users/:userId
// @desc    Update user
// @access  Private (Admin or self)
userRoutes.put('/:userId', authMiddleware, updateUser)

// @route   GET /api/users/:userId
// @desc    Get user by ID
// @access  Private (Admin or self)
userRoutes.get('/:userId', authMiddleware, adminMiddleware, getUserById)

// @route   GET /api/users
// @desc    Get all users
// @access  Private (Admin only)
userRoutes.get('/', authMiddleware, adminMiddleware, getAllUsers)

// @route   DELETE /api/users/:userId
// @desc    Delete user by ID
// @access  Private (Admin only)
userRoutes.delete('/:userId', authMiddleware, adminMiddleware, deleteUser)

export default userRoutes