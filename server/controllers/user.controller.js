import User from "../models/user.model.js";

/**
 * @route   GET /api/users
 * @desc    Get all users (Admin only)
 * @access  Private
 * @query   {Number} page - The page number to retrieve
 * @query   {Number} limit - The number of users to retrieve per page
 * @query   {String} sort - The sorting order (asc/desc)
 * @returns {Promise<void>}
 */
export const getAllUsers = async (req, res) => {
    const { page = 1, limit = 10, sort = 'desc' } = req.query;

    const options = {
        page: parseInt(page) || 1,
        limit: parseInt(limit) || 10,
        sort: { createdAt: sort === 'asc' ? 1 : -1 }
    }

    try {
        const users = await User.find().select(['-password', '-paymentHistory'])
            .sort({ createdAt: sort === 'asc' ? 1 : -1 })
            .skip((options.page - 1) * options.limit)
            .limit(options.limit);

        const totalUser = await User.countDocuments();

        res.status(200).json({
            data: {
                users,
                total: totalUser == 0 ? 1 : Math.ceil(totalUser / options.limit),
                page: options.page,
            }
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Server error' });
    }
}

/**
 * @route   GET /api/users/:userId
 * @desc    Get a user by ID (Admin only)
 * @access  Private
 * @param   {Request} req
 * @param   {Response} res
 * @returns {Promise<void>}
 */
export const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.userId).select(['-password', '-paymentHistory'])
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ data: user });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Server error' });
    }
}

/**
 * @route   PUT /api/users/:userId
 * @desc    Update a user (Admin or self)
 * @access  Private
 * @param   {Request} req
 * @param   {Response} res
 * @returns {Promise<void>}
 * @body    {String} name - The new name of the user
 * @body    {String} phone - The new phone of the user
 * @body    {String} address - The new address of the user
 * @body    {Object} preferences - The new preferences of the user
 */
export const updateUser = async (req, res) => {
    const { userId } = req.params;
    const { name, phone, address, state, country, postalCode, preferences } = req.body;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (userId !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied' });
        }

        user.name = name || user.name;
        user.phone = phone || user.phone;
        user.address = address || user.address;
        user.state = state || user.state;
        user.country = country || user.country;
        user.postalCode = postalCode || user.postalCode;
        user.preferences = preferences || user.preferences;

        await user.save();

        res.status(200).json({ message: 'User updated successfully' });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Server error' });
    }
}

/**
 * @route   DELETE /api/users/:userId
 * @desc    Delete a user by ID (Admin only)
 * @access  Private
 * @param   {Request} req
 * @param   {Response} res
 * @returns {Promise<void>}
 */
export const deleteUser = async (req, res) => {
    const { userId } = req.params;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.role === 'admin') {
            return res.status(403).json({ message: 'Admin user cannot be deleted' });
        }

        await user.deleteOne()
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Server error' });
    }
}