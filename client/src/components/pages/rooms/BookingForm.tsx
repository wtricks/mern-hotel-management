import { useState, useEffect } from 'react';
import Button from '../../common/Button';
import { toast } from 'react-toastify';

interface BookingFormProps {
    roomId: string;
    pricePerNight: number;
    onSubmit: (bookingDetails: {
        checkInDate: string;
        checkOutDate: string;
        specialRequests: string;
        totalPrice: number;
    }) => void;
}

const BookingForm = ({pricePerNight, onSubmit }: BookingFormProps) => {
    const [checkInDate, setCheckInDate] = useState<string>('');
    const [checkOutDate, setCheckOutDate] = useState<string>('');
    const [specialRequests, setSpecialRequests] = useState<string>('');
    const [totalPrice, setTotalPrice] = useState<number>(0);
    const [nights, setNights] = useState<number>(0);

    // Calculate total price whenever dates change
    useEffect(() => {
        if (checkInDate && checkOutDate) {
            const checkIn = new Date(checkInDate);
            const checkOut = new Date(checkOutDate);
            const timeDifference = checkOut.getTime() - checkIn.getTime();
            const numOfNights = timeDifference / (1000 * 3600 * 24);

            const currentDate = new Date();
            currentDate.setHours(0, 0, 0, 0);

            if (checkIn && checkIn < currentDate) {
                toast.error('Check-in date cannot be in the past.');
                return
            }

            if (numOfNights > 0) {
                setNights(numOfNights);
                setTotalPrice(numOfNights * pricePerNight);
            } else {
                setTotalPrice(0);
                toast.error('Check-out date must be after check-in date.');
            }
        }
    }, [checkInDate, checkOutDate, pricePerNight]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (nights <= 0) {
            toast.error('Please select valid check-in and check-out dates.');
            return;
        }

        onSubmit({
            checkInDate,
            checkOutDate,
            specialRequests,
            totalPrice
        });
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-lg mx-auto p-4 bg-white rounded-lg">
            {/* Check-in Date */}
            <div className="mb-4">
                <label className="block text-gray-700">Check-In Date</label>
                <input
                    type="date"
                    value={checkInDate}
                    onChange={(e) => setCheckInDate(e.target.value)}
                    className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                    required
                />
            </div>

            {/* Check-out Date */}
            <div className="mb-4">
                <label className="block text-gray-700">Check-Out Date</label>
                <input
                    type="date"
                    value={checkOutDate}
                    onChange={(e) => setCheckOutDate(e.target.value)}
                    className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                    required
                />
            </div>

            {/* Special Requests */}
            <div className="mb-4">
                <label className="block text-gray-700">Special Requests (Optional)</label>
                <textarea
                    value={specialRequests}
                    onChange={(e) => setSpecialRequests(e.target.value)}
                    className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                    placeholder="Any special requests?"
                />
            </div>

            {/* Total Price */}
            <div className="mb-4">
                <p className="text-lg">
                    <strong>Total Nights:</strong> {nights} night(s)
                </p>
                <p className="text-lg">
                    <strong>Total Price:</strong> ${totalPrice.toFixed(2)}
                </p>
            </div>

            <div className='flex justify-end'>
            <Button
                type="submit"
                className='ml-auto'
            >
                Confirm Booking
            </Button>
            </div>
        </form>
    );
};

export default BookingForm;
