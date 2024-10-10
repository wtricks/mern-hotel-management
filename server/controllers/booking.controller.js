import stripe from 'stripe';

import Booking from '../models/booking.model.js';
import Payment from '../models/payment.model.js';
import Room from '../models/room.model.js';
import GuestFeedback from '../models/feedback.model.js';
import User from '../models/user.model.js';

// TODO: We don't need a function here:
const stripeClient = () => {
    return stripe(process.env.STRIPE_SECRET_KEY);
}

export const createBooking = async (req, res) => {
    try {
        const { roomId, checkInDate, checkOutDate, specialRequests } = req.body;
        const userId = req.user.id;

        // Check if room exists
        const room = await Room.findById(roomId);
        if (!room) {
            return res.status(404).json({ message: 'Room not found' });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Calculate total price (customize based on your pricing logic)
        const totalPrice = calculateTotalPrice(room.price, checkInDate, checkOutDate);

        // Create a new booking
        const booking = new Booking({
            guest: userId,
            room: roomId,
            checkInDate,
            checkOutDate,
            totalPrice,
            specialRequests
        });

        await booking.save();


        // createa customer if not exist
        let customer;
        if ((user.stripeCustomerId)) {
            customer = user.stripeCustomerId;
        } else {
            const tempCustomer = await stripeClient().customers.create({
                email: user.email,
                name: user.name,

                // TODO: add address from user model
                address: {
                    line1: 'Khurja',
                    city: 'Khurja',
                    state: 'UP',
                    country: 'IN',
                    postal_code: 203131
                }
            });

            customer = tempCustomer.id;

            // store customer id
            user.customerId = tempCustomer.id;
            await user.save();
        }

        // Create a Stripe session for payment
        const session = await stripeClient().checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [{
                price_data: {
                    currency: 'inr',
                    product_data: {
                        name: `Room Booking: ${room.name}`,
                    },
                    unit_amount: totalPrice * 100,
                },
                quantity: 1,
            }],
            mode: 'payment',
            success_url: `${process.env.FRONTEND_URL}/rooms/${roomId}?session_id={CHECKOUT_SESSION_ID}&type=success`,
            cancel_url: `${process.env.FRONTEND_URL}/rooms/${roomId}?session_id={CHECKOUT_SESSION_ID}&type=cancel`,
            metadata: {
                bookingId: booking._id.toString()
            },
            customer_email: user.email,
            customer: customer
        });

        res.status(201).json({ data: { bookingId: booking._id, sessionId: session.id, url: session.url } });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getAllBookings = async (req, res) => {
    const { page, limit, sort = 'desc' } = req.query;
    const options = {
        page: parseInt(page) || 1,
        limit: parseInt(limit) || 10,
        sort: { createdAt: sort == 'asc' ? 1 : -1 },
    };

    try {
        const bookings = await Booking.find()
            .populate("room")
            .populate("payment")
            .populate("guest")
            .populate("feedback")
            .skip((options.page - 1) * options.limit)
            .limit(options.limit)
            .sort(options.sort);

        const total = await Booking.countDocuments();
        res.status(200).json({ data: {bookings, total: bookings == 0 ? 1 : Math.ceil(total / options.limit)} });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getBookingById = async (req, res) => {
    try {
        const { id } = req.params;
        const booking = await Booking.findOne({ _id: id }).populate('room');
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        res.status(200).json({ data: booking });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getUserBookings = async (req, res) => {
    const { page, limit, sort = 'desc' } = req.query;
    const options = {
        page: parseInt(page) || 1,
        limit: parseInt(limit) || 10,
        sort: { createdAt: sort == 'asc' ? 1 : -1 },
    };

    try {
        const bookings = await Booking.find({ guest: req.user.id })
            .populate("payment")
            .populate("room")
            .skip((options.page - 1) * options.limit)
            .limit(options.limit)
            .sort(options.sort);

        const total = await Booking.countDocuments({ guest: req.user.id });
        res.status(200).json({ data: { bookings, total: total == 0 ? 1 : Math.ceil(total / options.limit)  } });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const confirmPayment = async (req, res) => {
    const sig = req.headers['stripe-signature'];

    try {
        const event = stripeClient().webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);

        // Handle successful payment
        if (event.type === 'checkout.session.completed') {
            const session = event.data.object;

            // Find booking by session ID and update payment status
            const booking = await Booking.findOne({ _id: session.metadata.bookingId });
            if (booking) {
                // Create payment record
                const payment = new Payment({
                    booking: booking._id,
                    amount: booking.totalPrice,
                    paymentMethod: 'online',
                    status: 'completed',
                    paymentIntentId: session.payment_intent,
                });

                await payment.save();
                booking.payment = payment._id;
                await booking.save();
            }
        }

        res.status(200).json({ received: true });
    } catch (error) {
        res.status(400).send(`Webhook Error: ${error.message}`);
    }
};

export const confirmManualPayment = async (req, res) => {
    try {
        const { bookingId } = req.params;
        const { amount } = req.body;

        // Find booking
        const booking = await Booking.findById(bookingId).populate('payment');
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        if (booking.payment && booking.payment.status === 'completed') {
            return res.status(400).json({ message: 'Payment already confirmed' });
        }

        // Create manual payment record
        const payment = new Payment({
            booking: booking._id,
            amount,
            paymentIntentId: -1,
            paymentMethod: 'cash',
            status: 'completed',
        });

        await payment.save();

        booking.payment = payment._id;
        await booking.save();

        res.status(200).json({ message: 'Payment confirmed manually' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getPaymentDetails = async (req, res) => {
    try {
        const { id } = req.params;
        const payment = await Payment.findById(id).populate('booking');
        if (!payment) {
            return res.status(404).json({ message: 'Payment not found' });
        }
        res.status(200).json({ data: payment });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const cancelBooking = async (req, res) => {
    try {
        const { id } = req.params;

        // Find booking
        const booking = await Booking.findById(id).populate('payment');
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        // Update booking status to cancelled
        booking.status = 'cancelled';
        await booking.save();

        // If payment exists and is completed, initiate a refund
        if (booking.payment && booking.payment.status === 'completed') {
            const payment = await Payment.findById(booking.payment._id);

            // Refund through Stripe if payment method is online
            if (payment.paymentMethod === 'online') {
                const refund = await stripeClient().refunds.create({
                    payment_intent: payment.paymentIntentId,
                });

                payment.status = 'refunded';
                await payment.save();
                return res.status(200).json({ message: 'Booking cancelled and payment refunded.', refund });
            } else {
                // Handle cash refunds manually if needed
                payment.status = 'refunded';
                await payment.save();
                return res.status(200).json({ message: 'Booking cancelled. Please refund cash manually.' });
            }
        }

        res.status(200).json({ message: 'Booking cancelled successfully.' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateBookingStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (status != 'checked-in' && status != 'checked-out') {
            res.status(400).json({ message: 'Invalid status.' });
            return
        }

        // Find booking
        const booking = await Booking.findById(id).populate('payment');
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        // If payment exists and is completed, initiate a refund
        if (!booking.payment || booking.payment.status !== 'completed') {
            return res.status(404).json({ message: 'Payment was not completed.' });
        }

        // Update booking status
        booking.status = status;
        await booking.save();

        res.status(200).json({ message: 'Booking status updated successfully.' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const calculateTotalPrice = (pricePerNight, checkInDate, checkOutDate) => {
    const diffTime = Math.abs(new Date(checkOutDate) - new Date(checkInDate));
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return pricePerNight * diffDays;
};

export const addFeedback = async (req, res) => {
    const { bookingId } = req.params;
    const { comment, rating } = req.body;

    try {
        const booking = await Booking.findById(bookingId).populate('payment');
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        if (!booking.payment || booking.payment.status !== 'completed') {
            res.status(400).json({ message: 'Payment not completed' });
            return
        }

        const feedback = new GuestFeedback({
            comment,
            rating,
            booking: booking._id,
        });

        await feedback.save();
        res.status(200).json({ message: 'Feedback added successfully' });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Server error' });
    }
}
