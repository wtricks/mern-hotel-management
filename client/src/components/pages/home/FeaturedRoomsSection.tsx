import RoomCard from "../rooms/RoomCard";
import { useEffect, useState } from "react";
import { type Room } from "../dashboard/RoomModal";
import api, { baseUrl } from "../../../api";

const FeaturedRoomsSection = () => {
    const [rooms, setRooms] = useState<Room[]>([])

    useEffect(() => {
        if (!rooms.length) {
            api.get(`/rooms?page=1&limit=3&sort=price&sortBy=desc`).then((res) => setRooms(res.data.data.rooms))
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <section className="w-full flex flex-col py-12 px-6 sm:px-12">
            <h5 className="text-2xl sm:text-3xl font-semibold mb-8 sm:mb-12 text-center">Featured Rooms</h5>

            <div className="w-full max-w-screen-lg mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
                {rooms.map((room) => (
                    <RoomCard
                        key={room._id}
                        id={room._id!}
                        image={baseUrl + room.image as string}
                        name={room.name}
                        price={room.price}
                    />
                ))}
            </div>
        </section>
    );
};

export default FeaturedRoomsSection;
