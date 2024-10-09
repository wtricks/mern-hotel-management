import { useState, useEffect } from 'react';
import RoomCard from '../rooms/RoomCard';
import api, { baseUrl } from '../../../api';

interface Room {
    _id: string;
    name: string;
    price: number;
    image: string;
    availability: boolean;
    type: 'single' | 'double' | 'triple';
}


let timeoutId: number;
const debounce = (fn: () => void, time: number) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(fn, time)
}

const RoomSection = () => {
    const [rooms, setRooms] = useState<Room[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [roomsPerPage] = useState(10);
    const [sortOption, setSortOption] = useState('price-asc');
    const [searchTerm, setSearchTerm] = useState('');
    const [isAvailable, setIsAvailable] = useState(false);
    const [roomType, setRoomType] = useState('');
    const [priceRange, setPriceRange] = useState([200, 9000]);
    const [totalPages, setTotalPages] = useState(1);

    // Fetch rooms from the backend API
    useEffect(() => {
        const fetchRooms = async () => {
            try {
                const response = await api.get('/rooms', {
                    params: {
                        page: currentPage,
                        limit: roomsPerPage,
                        sort: sortOption.includes('asc') ? 'asc' : 'desc',
                        sortBy: sortOption.includes('price') ? 'price' : 'name',
                        search: searchTerm,
                        minPrice: priceRange[0],
                        maxPrice: priceRange[1],
                        availability: isAvailable ? 'true' : undefined,
                        type: roomType || 'all',
                    },
                });

                const { data } = response.data;
                setRooms(data.rooms);
                setTotalPages(data.total); // Update total pages based on response
            } catch (error) {
                console.error('Error fetching rooms:', error);
            }
        };

        debounce(fetchRooms, 50)
    }, [currentPage, sortOption, searchTerm, isAvailable, roomType, priceRange, roomsPerPage]);

    // Pagination logic
    const indexOfLastRoom = currentPage * roomsPerPage;
    const indexOfFirstRoom = indexOfLastRoom - roomsPerPage;
    const currentRooms = rooms.slice(indexOfFirstRoom, indexOfLastRoom);

    const handlePageChange = (page: number) => setCurrentPage(page);

    return (
        <section className="w-full py-12 px-6 sm:px-12">
            <h5 className="text-2xl sm:text-3xl font-semibold mb-8 sm:mb-12 text-center">Search Rooms</h5>

            <div className="mb-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="flex-1 flex items-center">
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search by room name"
                        className="p-4 w-full border border-gray-300 rounded-md h-12 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div className="flex-1 flex items-center">
                    <input
                        type="checkbox"
                        checked={isAvailable}
                        onChange={(e) => setIsAvailable(e.target.checked)}
                        className="h-5 w-5 mr-2"
                    />
                    <label className="text-gray-700">Available Only</label>
                </div>

                <div className="flex-1 flex items-center">
                    <select
                        value={roomType}
                        onChange={(e) => setRoomType(e.target.value)}
                        className="p-2 w-full border border-gray-300 rounded-md h-12 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">All Types</option>
                        <option value="single">Single</option>
                        <option value="double">Double</option>
                        <option value="triple">Triple</option>
                    </select>
                </div>

                <div className="w-full lg:w-64">
                    <label className="block mb-1 text-gray-700">Price Range</label>
                    <div className="flex flex-col space-y-2">
                        <input
                            type="range"
                            min="200"
                            max="5000"
                            value={priceRange[0]}
                            onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                            className="w-full"
                        />
                        <input
                            type="range"
                            min="500"
                            max="10000"
                            value={priceRange[1]}
                            onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                            className="w-full"
                        />
                        <p className="text-sm text-gray-600">
                            ${priceRange[0]} - ${priceRange[1]}
                        </p>
                    </div>
                </div>
            </div>

            <div className="flex justify-center mb-6">
                <select
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value)}
                    className="p-2 border rounded"
                >
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="name-asc">Name: A to Z</option>
                    <option value="name-desc">Name: Z to A</option>
                </select>
            </div>

            <div className="w-full max-w-screen-lg mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
                {currentRooms.map((room) => (
                    <RoomCard
                        key={room._id}
                        id={room._id}
                        image={baseUrl + room.image}
                        name={room.name}
                        price={room.price}
                    />
                ))}
            </div>

            <div className="flex justify-center mt-8">
                {Array.from({ length: totalPages }, (_, index) => (
                    <button
                        key={index}
                        onClick={() => handlePageChange(index + 1)}
                        className={`px-4 py-2 mx-1 border rounded ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-white text-black'}`}
                    >
                        {index + 1}
                    </button>
                ))}
            </div>
        </section>
    );
};

export default RoomSection;
