import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useSearchParams } from 'react-router-dom';

import Button from '../../common/Button';
import api from '../../../api';
import Modal from '../../common/Modal';
import FeedbackForm from './FeedbackForm';
import { toast } from 'react-toastify';
import { RootState } from '../../../store';
import { setUser as setLocalUser } from '../../../store/slices/UserSlice';

interface Booking {
    _id: string;
    checkInDate: string;
    checkOutDate: string;
    totalPrice: number;
    status: string;
    specialRequests: string
    createdAt: string
    room: {
        _id: string
        name: string
        roomNumber: string
        status: string
    },
    payment: {
        _id: string
        status: string
        paymentMethod: string
    }
}

const BodySection: React.FC = () => {
    const [search, setSearch] = useSearchParams();
    const searchTerm = search.get('tab') || 'profile';

    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);

    const [feedbackModal, setFeedbackModal] = useState('');
    const [infoModal, setInfoModal] = useState(-1);
    const [loading, setLoading] = useState(false);

    const userinfo = useSelector((state: RootState) => state.user)
    const dispatch = useDispatch()

    const [user, setUser] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        preferences: '',
    });

    const [bookings, setBookings] = useState<Booking[]>([]);
    const selectBooking = useMemo(() => bookings[infoModal], [bookings, infoModal]);

    // Fetch profile data
    useEffect(() => {
        if (userinfo.user) {
            setUser({
                name: userinfo.user.name,
                email: userinfo.user.email,
                phone: userinfo.user.phone,
                address: userinfo.user.address,
                preferences: Object.keys(userinfo.user.preferences || {}).join(",")
            })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userinfo.user]);

    useEffect(() => {
        const fetchBookings = async () => {
            api.get('/bookings/user', { params: { page, limit: 10, sort: 'desc' } })
                .then(res => {
                    setBookings(res.data.data.bookings);
                    setTotal(res.data.data.total);
                })
        };
        fetchBookings();
    }, [page]);

    // Update profile handler
    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();

        const data = { ...user, preferences: user.preferences.split(",").reduce((acc, pref) => ({ ...acc, [pref]: "true" }), {}) }

        setLoading(true)
        api.put('/users/' + userinfo.user!._id,data)
            .then(() => {
                toast.success('Profile updated successfully!');
                dispatch(setLocalUser({ ...userinfo.user!, ...data }))
            }).finally(() => {
                setLoading(false);
            })
    };

    const handleFeedback = (data: { comment: string, rating: number }) => {
        setLoading(true);
        api.post('/bookings/feedback/' + feedbackModal, data)
            .then(() => {
                setFeedbackModal('')
                toast.success('Thank you for your feedback!')
            })
            .finally(() => {
                setLoading(false);
            })
    }

    return (
        <div className="w-full max-w-7xl mx-auto p-4 flex">
            <div className="flex flex-col mb-4">
                <Button
                    className='mb-3'
                    onClick={() => setSearch({ tab: 'profile' })}
                    variant={searchTerm !== 'profile' ? 'secondary' : 'primary'}
                >
                    Profile
                </Button>
                <Button
                    onClick={() => setSearch({ tab: 'history' })}
                    variant={searchTerm !== 'history' ? 'secondary' : 'primary'}
                >
                    Bookings History
                </Button>
            </div>

            {searchTerm === 'profile' && (
                <div className="flex-1 ml-12">
                    <form onSubmit={handleUpdateProfile}>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Name</label>
                            <input
                                type="text"
                                value={user.name}
                                onChange={(e) => setUser({ ...user, name: e.target.value })}
                                className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Email</label>
                            <input
                                type="email"
                                value={user.email}
                                onChange={(e) => setUser({ ...user, email: e.target.value })}
                                className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Phone</label>
                            <input
                                type="tel"
                                value={user.phone}
                                onChange={(e) => setUser({ ...user, phone: e.target.value })}
                                className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Address</label>
                            <input
                                type="text"
                                value={user.address}
                                onChange={(e) => setUser({ ...user, address: e.target.value })}
                                className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Preferences</label>
                            <input
                                type="text"
                                value={user.preferences}
                                onChange={(e) => setUser({ ...user, preferences: e.target.value })}
                                placeholder="Enter preferences separated by commas"
                                className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
                            />
                        </div>

                        <Button
                            type="submit"
                            loading={loading}
                        >
                            Update Profile
                        </Button>
                    </form>
                </div>
            )}

            {searchTerm === 'history' && (
                <div className="flex-1 ml-12">
                    <table className="min-w-full divide-y divide-gray-200 table-fixed">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Room
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Check-In Date
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Check-Out Date
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Price
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3">
                                    Action
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {bookings.map((booking, index) => (
                                <tr key={booking._id}>
                                    <td className="px-6 py-4 whitespace-nowrap">{booking.room.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {new Date(booking.checkInDate).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {new Date(booking.checkOutDate).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">${booking.totalPrice.toFixed(2)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{booking.status}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {booking.payment?.status === 'completed' && <Button variant='primary' size="small" className="bg-green-500 text-white px-2 py-1 rounded mr-2" onClick={() => setFeedbackModal(booking._id!)}>Feedback</Button>}
                                        <Button variant='secondary' size="small" className="bg-blue-500 text-white px-2 py-1 rounded" onClick={() => setInfoModal(index!)}>More Info</Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div className="flex justify-between mt-4">
                        <Button
                            onClick={() => setPage(page - 1)}
                            disabled={page === 1}
                        >
                            Previous
                        </Button>
                        <span>Page {page} of {total}</span>
                        <Button
                            onClick={() => setPage(page + 1)}
                            disabled={page === total}
                        >
                            Next
                        </Button>
                    </div>
                </div>
            )}

            <Modal title="Feedback" isOpen={!!feedbackModal} onClose={() => setFeedbackModal('')}>
                <FeedbackForm loading={loading} onSubmit={handleFeedback} />
            </Modal>

            <Modal title="More info" isOpen={infoModal != -1} onClose={() => setInfoModal(-1)}>
                <div className="max-w-2xl w-full bg-white rounded p-6">
                    <p className="text-lg mb-4">
                        <strong>Room name: </strong>
                        {selectBooking?.room.name}
                    </p>
                    <p className="text-lg mb-4">
                        <strong>Room number: </strong>
                        {selectBooking?.room.roomNumber}
                    </p>
                    <p className="text-lg mb-4">
                        <strong>Booking status: </strong>
                        {selectBooking?.status}
                    </p>
                    <p className="text-lg mb-4">
                        <strong>Payment status: </strong>
                        {selectBooking?.payment?.status || 'No payment paid'}
                    </p>
                    <p className="text-lg mb-4">
                        <strong>Payment method: </strong>
                        {selectBooking?.payment?.paymentMethod || 'No payment paid'}
                    </p>

                    <Link to={`/rooms/${selectBooking?.room._id}`} className='mt-12'>
                        <Button>More info about room</Button>
                    </Link>
                </div>
            </Modal>
        </div>
    );
};

export default BodySection;
