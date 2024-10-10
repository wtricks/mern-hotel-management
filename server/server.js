import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import rateLimit from 'express-rate-limit'

import authRoutes from './routes/auth.routes.js'
import requestRoutes from './routes/request.routes.js'
import roomRoutes from './routes/room.routes.js'
import userRoutes from './routes/user.routes.js'
import reportRoutes from './routes/report.routes.js'
import bookingRoutes from './routes/booking.routes.js'

import { connectDB } from './config/db.js'
// import {multer} from './config/multer.js'

dotenv.config() // Load environment variables from .env file

const app = express()

app.use(express.json({ verify: (req, _res, buffer) => {
    if (req.originalUrl.startsWith('/api/bookings/confirm-payment')) {
        req.rawBody = buffer // store raw request body
    }
}}))

app.use(express.urlencoded({ extended: true }))
app.use(cors())
app.use('/uploads', express.static('uploads'))
app.use(rateLimit({
	windowMs: 15 * 60 * 1000,
	limit: 100,
	legacyHeaders: false,
    message: 'Too many requests from this IP, please try again in an hour!',
}))

const PORT = process.env.PORT || 5000

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/requests', requestRoutes)
app.use('/api/rooms', roomRoutes)
app.use('/api/users', userRoutes)
app.use('/api/reports', reportRoutes)
app.use('/api/bookings', bookingRoutes)

// app.post('/api/upload', multer.single('file'), (req, res) => {
//     res.status(200).json({ ok: true })
// })

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`)
    })
})