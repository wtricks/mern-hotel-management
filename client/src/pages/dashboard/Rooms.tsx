import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import DashboardLayout from "../../components/pages/dashboard/DashboardLayout";
import RoomModal, { type Room } from "../../components/pages/dashboard/RoomModal";
import Button from "../../components/common/Button";
import api from "../../api";

const Rooms = () => {
    const [rooms, setRooms] = useState<Room[]>([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [sort, setSort] = useState("newest");
    const [loading, setLoading] = useState(true);
    const [pageSize, setPageSize] = useState(10);
    const [editIndex, setEditIndex] = useState(-1);

    const [modal, setModal] = useState(false)

    const fetchRooms = async () => {
        setLoading(true);
        try {
            const response = await api.get("/rooms", { data: { page, sort, limit: pageSize } });
            setRooms(response.data.data.rooms);
            setTotalPages(response.data.data.total);
        } catch (error) {
            console.error("Failed to fetch rooms:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRooms();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, sort]);

    const handleDeleteRoom = async (roomId: string) => {
        try {
            await api.delete(`/rooms/${roomId}`);
            toast.success("Room deleted successfully");
            fetchRooms(); // Re-fetch rooms after deleting
        } catch (error) {
            console.error("Failed to delete room:", error);
        }
    };

    const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSort(event.target.value);
    };

    const handlePageChange = (newPage: number) => {
        if (newPage > 0 && newPage <= totalPages) {
            setPage(newPage);
        }
    };

    const onUpdateRoom = (room: Room) => {
        const formData = new FormData();

        Object.entries(room).forEach(([key, value]) => { formData.append(key, value) })

        setLoading(true);
        api[modal ? 'post' : 'put'](modal ? '/rooms' : `/rooms/${rooms[editIndex]._id}`, formData)
            .then(() => {
                fetchRooms();
                setEditIndex(-1);
                setModal(false)

                if (modal) {
                    toast.success("Room is updated successfully");
                } else {
                    toast.success("Room is created successfully");
                }
            })
            .finally(() => setLoading(false));
    };

    const onClose = () => {
        setEditIndex(-1);
        setModal(false);
    }

    return (
        <DashboardLayout title="Rooms">
            <div className="flex justify-end w-full mt-5">
                <Button onClick={() => setModal(true)}>
                    Create Room
                </Button>
            </div>
            <div className="flex justify-between items-center mb-4 px-12 mt-12">

                <h1 className="text-2xl font-bold">Rooms</h1>
                <div className="flex items-center">
                    <label htmlFor="pageSize" className="mr-2">Page size:</label>
                    <input
                        type="number"
                        value={pageSize}
                        onChange={(e) => setPageSize(Number(e.target.value))}
                        min={1}
                        max={50}
                        className="p-2 border rounded mr-5"
                    />

                    <label htmlFor="sort" className="mr-2">Sort by:</label>
                    <select
                        id="sort"
                        value={sort}
                        onChange={handleSortChange}
                        className="p-2 border rounded"
                    >
                        <option value="newest">Newest</option>
                        <option value="oldest">Oldest</option>
                    </select>
                </div>
            </div>

            {loading ? (
                <p>Loading...</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border">
                        <thead>
                            <tr>
                                <th className="px-4 py-2 border">Name</th>
                                <th className="px-4 py-2 border">Room Number</th>
                                <th className="px-4 py-2 border">Type</th>
                                <th className="px-4 py-2 border">Price</th>
                                <th className="px-4 py-2 border">Availability</th>
                                <th className="px-4 py-2 border">Housekeeping Status</th>
                                <th className="px-4 py-2 border">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rooms.map((room, index) => (
                                <tr key={room._id}>
                                    <td className="px-4 py-2 border text-center">{room.name}</td>
                                    <td className="px-4 py-2 border text-center">{room.roomNumber}</td>
                                    <td className="px-4 py-2 border text-center">{room.type}</td>
                                    <td className="px-4 py-2 border text-center">${room.price}</td>
                                    <td className="px-4 py-2 border text-center">{room.availability ? "Available" : "Unavailable"}</td>
                                    <td className="px-4 py-2 border text-center">{room.housekeepingStatus}</td>
                                    <td className="px-4 py-2 border text-center">
                                        <Button onClick={() => setEditIndex(index)}>Edit</Button>
                                        <Button onClick={() => handleDeleteRoom(room._id!)} className="ml-2 bg-red-500">Delete</Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <div className="flex justify-between mt-4">
                <Button
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page === 1}
                >
                    Previous
                </Button>
                <span>Page {page} of {totalPages}</span>
                <Button
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page === totalPages}
                >
                    Next
                </Button>
            </div>

            {/* Create/Update Modal */}
            {(editIndex != -1 || modal) && <RoomModal isOpen={true} onClose={onClose} onSubmit={onUpdateRoom} roomData={rooms[editIndex]} />}
        </DashboardLayout>
    );
};

export default Rooms;
