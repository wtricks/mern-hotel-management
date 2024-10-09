import mongoose from 'mongoose';

const roomSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    roomNumber: {
        type: String,
        required: true,
        unique: true,
    },
    image: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        enum: ['single', 'double', 'triple'],
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    availability: {
        type: Boolean,
        default: true,
    },
    housekeepingStatus: {
        type: String,
        enum: ['clean', 'dirty', 'maintenance'],
        default: 'clean',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Room = mongoose.model('Room', roomSchema);
export default Room;
