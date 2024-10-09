import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import DashboardLayout from "../../components/pages/dashboard/DashboardLayout";
import Button from "../../components/common/Button";
import api from "../../api";
import Modal from "../../components/common/Modal";

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
    },
    guest: {
        _id: string
        name: string
        email: string
    }
}

const Bookings = () => {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [sort] = useState("desc");
    const [loading, setLoading] = useState(true);
    const [pageSize] = useState(10);

    // modals
    const [statusModal, setStatusModal] = useState('');
    const [paymentModal, setPaymentModal] = useState('');

    // modal states
    const [status, setStatus] = useState('checked-in')
    const [amount, setAmount] = useState('')

    // Fetch bookings
    const fetchBookings = async () => {
        setLoading(true);
        try {
            const response = await api.get("/bookings/all", { params: { page, sort, limit: pageSize } });
            setBookings(response.data.data.bookings);
            setTotalPages(response.data.data.total);
        } catch (error) {
            console.error("Failed to fetch bookings:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBookings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, sort, pageSize]);

    // Update booking status (e.g., confirm, cancel)
    const handleUpdateBookingStatus = async (bookingId: string, newStatus: string) => {
        setLoading(true)
        api.patch(`/bookings/${bookingId}/status`, { status: newStatus })
            .then(() => {
                toast.success(`Booking ${newStatus} successfully`);
                fetchBookings();
                setStatus('checked-in')
                setStatusModal('')
            }).finally(() => {
                setLoading(false)
            })
    };

    const handleCancelBooking = async (bookingId: string) => {
        if (!confirm('Are you sure you want to cancel this booking?') || loading) {
            return;
        }

        const booking = bookings.find((b) => b._id === bookingId);
        if (booking?.status === 'cancelled') {
            toast.error('Booking already cancelled');
            return;
        }

        setLoading(true)
        api.post(`/bookings/cancel/${bookingId}`)
            .then(() => {
                toast.success('Booking canceled successfully');
                fetchBookings();
            }).finally(() => {
                setLoading(false)
            })
    };

    const handleManualPayment = (bookingId: string, amount: string) => {
        setLoading(true)
        api.post('/bookings/manual-payment/' + bookingId, { amount })
            .then(() => {
                setPaymentModal('')
                setAmount('')
                toast.success('Payment added successfully')
                fetchBookings()
            })
            .finally(() => setLoading(false))
    }

    // UI for listing bookings
    return (
        <DashboardLayout title="Bookings">
            {loading ? (
                <p>Loading...</p>
            ) : (
                <div className="overflow-x-auto mt-12">
                    <table className="min-w-full bg-white border">
                        <thead>
                            <tr>
                                <th className="px-4 py-2 border">Room Name</th>
                                <th className="px-4 py-2 border">Guest</th>
                                <th className="px-4 py-2 border">Check-In</th>
                                <th className="px-4 py-2 border">Check-Out</th>
                                <th className="px-4 py-2 border">Total Price</th>
                                <th className="px-4 py-2 border">Status</th>
                                <th className="px-4 py-2 border">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {bookings.map((booking) => (
                                <tr key={booking._id}>
                                    <td className="px-4 py-2 border text-center">{booking.room.name}</td>
                                    <td className="px-4 py-2 border text-center">{booking.guest.name}</td>
                                    <td className="px-4 py-2 border text-center">{booking.checkInDate}</td>
                                    <td className="px-4 py-2 border text-center">{booking.checkOutDate}</td>
                                    <td className="px-4 py-2 border text-center">${booking.totalPrice}</td>
                                    <td className="px-4 py-2 border text-center">{booking.status}</td>
                                    <td className="px-4 py-2 border text-center">
                                        <Button size="small" onClick={() => setPaymentModal(booking._id)} className="ml-2 bg-green-500">Cash payment</Button>
                                        <Button size="small" onClick={() => setStatusModal(booking._id)} className="ml-2 bg-red-500">Update Status</Button>
                                        <Button size="small" onClick={() => handleCancelBooking(booking._id)} className="ml-2 bg-yellow-500">Cancel</Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <div className="flex justify-between mt-4">
                <Button
                    onClick={() => setPage(page - 1)}
                    disabled={page === 1}
                >
                    Previous
                </Button>
                <span>Page {page} of {totalPages}</span>
                <Button
                    onClick={() => setPage(page + 1)}
                    disabled={page === totalPages}
                >
                    Next
                </Button>
            </div>

            {/* Update booking status modal */}
            <Modal isOpen={!!statusModal} onClose={() => setStatusModal('')} title="Update status">
                <select value={status} onChange={(e) => setStatus(e.target.value)} className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring">
                    <option value="checked-in">Checked-In</option>
                    <option value="checked-out">Checked-Out</option>
                </select>

                <Button loading={loading} onClick={() => handleUpdateBookingStatus(statusModal, status)} className="mt-12">Update</Button>
            </Modal>

            {/* Cash payment status modal */}
            <Modal isOpen={!!paymentModal} onClose={() => setPaymentModal('')} title="Update status">
                <input value={amount} placeholder="Amount" type="number" onChange={(e) => setAmount(e.target.value as string)} className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring" />

                <Button loading={loading} onClick={() => handleManualPayment(paymentModal, amount)} className="mt-12">Manual payment</Button>
            </Modal>
        </DashboardLayout>
    );
};

export default Bookings;
