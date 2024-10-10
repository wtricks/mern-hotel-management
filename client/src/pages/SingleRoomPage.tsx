import { useParams, useSearchParams } from "react-router-dom";
import Footer from "../components/common/Footer"
import Header from "../components/common/Header"
import HeroSection from "../components/pages/rooms/HeroSection"

import RoomInfo from "../components/pages/rooms/RoomInfo";
import { useEffect, useState } from "react";
import { type Room } from "../components/pages/dashboard/RoomModal";
import api, { baseUrl } from "../api";
import Modal from "../components/common/Modal";
import BookingForm from "../components/pages/rooms/BookingForm";
import { toast } from "react-toastify";

const SingleRoomPage = () => {
    const [room, setRoom] = useState<Partial<Room>>({})
    const params = useParams()
    const [loading, setLoading] = useState(false)
    const [showModal, setShowModal] = useState(false)

    const [search] = useSearchParams()

    useEffect(() => {
        api.get(`/rooms/${params.roomId}`).then((res) => setRoom(res.data.data))
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const onBookRoom = () => {
        setShowModal(true)
    }

    const onSubmit = (data: {
        checkInDate: string;
        checkOutDate: string;
        specialRequests: string;
        totalPrice: number;
    }) => {
        setLoading(true)

        api.post('/bookings', {...data, roomId: room._id})
            .then((res) => {
                window.location.href =  res.data.data.url
            }).finally(() => setLoading(false))
    }

    useEffect(() => {
        const type = search.get('type');

        if (type == 'success') {
            toast.success('Booking successful!, You can now check-in to the room');
        } else if (type == 'cancel') {
            toast.error('Booking cancelled!, Please try again');
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <>
            <Header />
            <HeroSection
                image={baseUrl + room.image}
                name="Dealux Room"
                onButtonClick={onBookRoom}
                buttontext="Book now"
                loading={loading}
            />

            {room._id && (<RoomInfo room={room as Room} /> )}
            <Footer />

            <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Book you room">
                <BookingForm
                    roomId={room._id!}
                    onSubmit={onSubmit}
                    pricePerNight={room.price!}
                />
            </Modal>
        </>
    )
}

export default SingleRoomPage