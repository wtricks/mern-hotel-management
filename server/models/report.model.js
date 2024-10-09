import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['occupancy', 'revenue', 'guest-satisfaction'],
        required: true,
    },
    dateRange: {
        start: Date,
        end: Date,
    },
    data: {
        type: Map,
        of: Number, // Can store key-value pairs like room occupancy, revenue, etc.
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Report = mongoose.model('Report', reportSchema);
export default Report;
