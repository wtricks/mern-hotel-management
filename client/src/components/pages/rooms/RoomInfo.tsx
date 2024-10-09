import { type Room } from "../dashboard/RoomModal";

const RoomDetails = ({ room }: {room: Room}) => {
    return (
        <section className="w-full flex flex-col items-center py-12 px-6 sm:px-12">
            <h2 className="text-2xl sm:text-3xl font-semibold mb-4 text-center">Room Details</h2>
            <div className="max-w-2xl w-full bg-white shadow-md rounded p-6">
                <p className="text-lg mb-4"><strong>Description:</strong> {room.description}</p>
                <p className="text-lg mb-4"><strong>Room Number:</strong> {room.roomNumber}</p>
                <p className="text-lg mb-4"><strong>Type:</strong> {room.type}</p>
                <p className="text-lg mb-4"><strong>Price:</strong> ${room.price}</p>
                <p className="text-lg mb-4"><strong>Availability:</strong> {room.availability ? 'Available' : 'Not Available'}</p>
                <p className="text-lg mb-4"><strong>Housekeeping Status:</strong> {room.housekeepingStatus}</p>
            </div>
        </section>
    );
};

export default RoomDetails;
