import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['guest', 'admin'],
        default: 'guest', // Default role is guest
    },
    phone: {
        type: String,
    },
    address: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    preferences: {
        type: Map,
        of: String, // Any preferences the user (guest) might have (e.g., room type, etc.)
    },
    paymentHistory: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Payment',
    }],
});

const User = mongoose.model('User', userSchema);
export default User;
