import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
    booking: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Booking',
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    paymentDate: {
        type: Date,
        default: Date.now,
    },
    paymentIntentId: {
        type: Number
    },
    paymentMethod: {
        type: String,
        enum: ['online', 'cash'],
        required: true,
    },
    status: {
        type: String,
        enum: ['pending', 'completed', 'refunded'],
        default: 'pending',
    },
});

const Payment = mongoose.model('Payment', paymentSchema);
export default Payment;
