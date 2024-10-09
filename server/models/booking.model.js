import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
    guest: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    room: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Room',
        required: true,
    },
    checkInDate: {
        type: Date,
        required: true,
    },
    checkOutDate: {
        type: Date,
        required: true,
    },
    status: {
        type: String,
        enum: ['booked', 'checked-in', 'checked-out', 'cancelled'],
        default: 'booked',
    },
    totalPrice: {
        type: Number,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    specialRequests: {
        type: String,
    },
    payment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Payment',
    },
    feedback: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'GuestFeedback',
    }
});

const Booking = mongoose.model('Booking', bookingSchema);
export default Booking;
