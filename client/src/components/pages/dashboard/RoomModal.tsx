import { useEffect, useState } from "react";
import { FiX } from "react-icons/fi";

import Modal from "../../common/Modal";
import Button from "../../common/Button";

import { baseUrl } from "../../../api";

export interface Room {
    _id?: string;
    name: string;
    description: string;
    roomNumber: string;
    type: "single" | "double" | "triple";
    image: string | File;
    price: number;
    availability: boolean;
    housekeepingStatus: "clean" | "dirty" | "maintenance";
}

interface Props {
    isOpen: boolean;
    onClose: () => void;
    roomData?: Room;
    onSubmit: (data: Room) => void;
    loading?: boolean;
}

const RoomModal = ({ isOpen, onClose, roomData, onSubmit, loading }: Props) => {
    const [name, setName] = useState(roomData?.name || "");
    const [description, setDescription] = useState(roomData?.description || "");
    const [roomNumber, setRoomNumber] = useState(roomData?.roomNumber || "");
    const [image, setImage] = useState(roomData?.image || "");
    const [imageFile, setImageFile] = useState<File | null>(null); // For uploaded image file
    const [type, setType] = useState(roomData?.type || "single");
    const [price, setPrice] = useState(roomData?.price || 0);
    const [availability, setAvailability] = useState<boolean>(roomData?.availability || true);
    const [housekeepingStatus, setHousekeepingStatus] = useState(roomData?.housekeepingStatus || "clean");

    const handleSubmit = () => {
        const roomInfo = {
            name,
            description,
            roomNumber,
            image: imageFile || image, // Set image URL from file if exists
            type,
            price,
            availability,
            housekeepingStatus,
        };
        onSubmit(roomInfo);
        onClose();
    };

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            setImageFile(event.target.files[0]);
            setImage(""); // Clear the image URL if a new file is selected
        }
    };

    const handleEditImage = () => {
        setImageFile(null); // Reset the image file to allow file input
        setImage(""); // Clear the URL for a new upload
    };

    useEffect(() => {
        if (roomData) {
            setName(roomData.name);
            setDescription(roomData.description);
            setRoomNumber(roomData.roomNumber);
            setImage(roomData.image);
            setType(roomData.type);
            setPrice(roomData.price);
            setAvailability(roomData.availability);
            setHousekeepingStatus(roomData.housekeepingStatus);
            setImageFile(null); // Reset file input on load
        }
    }, [roomData]);

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={roomData ? "Edit Room" : "Create Room"}>
            <div className="p-4">
                {/* Room Name */}
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">Room Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="border rounded-md p-2 w-full"
                        placeholder="Enter room name"
                        required
                    />
                </div>

                {/* Description */}
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">Description</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="border rounded-md p-2 w-full"
                        placeholder="Enter room description"
                    />
                </div>

                {/* Room Number */}
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">Room Number</label>
                    <input
                        type="text"
                        value={roomNumber}
                        onChange={(e) => setRoomNumber(e.target.value)}
                        className="border rounded-md p-2 w-full"
                        placeholder="Enter room number"
                        required
                    />
                </div>

                {/* Image Preview or Input */}
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">Image</label>
                    {imageFile || image ? (
                        <div className="relative mb-2">
                            <img src={imageFile ? URL.createObjectURL(imageFile) : (baseUrl + image) as string} alt="Room Preview" className="w-full h-48 object-cover rounded-md" />
                            <Button variant="secondary" onClick={handleEditImage} className="absolute top-2 right-2">
                                <FiX size={24} />
                            </Button>
                        </div>
                    ) : (
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="border rounded-md p-2 w-full"
                            required
                        />
                    )}
                </div>

                {/* Room Type */}
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">Room Type</label>
                    <select
                        value={type}
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        onChange={(e) => setType(e.target.value as any)}
                        className="border rounded-md p-2 w-full"
                    >
                        <option value="single">Single</option>
                        <option value="double">Double</option>
                        <option value="triple">Triple</option>
                    </select>
                </div>

                {/* Price */}
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">Price (per night)</label>
                    <input
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(parseFloat(e.target.value))}
                        className="border rounded-md p-2 w-full"
                        placeholder="Enter price"
                        required
                    />
                </div>

                {/* Availability */}
                {roomData && <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">Availability</label>
                    <select
                        value={availability ? "available" : "unavailable"}
                        onChange={(e) => setAvailability(e.target.value === "available")}
                        className="border rounded-md p-2 w-full"
                    >
                        <option value="available">Available</option>
                        <option value="unavailable">Unavailable</option>
                    </select>
                </div>}

                {/* Housekeeping Status */}
                {roomData && <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">Housekeeping Status</label>
                    <select
                        value={housekeepingStatus}
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        onChange={(e) => setHousekeepingStatus(e.target.value as any)}
                        className="border rounded-md p-2 w-full"
                    >
                        <option value="clean">Clean</option>
                        <option value="dirty">Dirty</option>
                        <option value="maintenance">Maintenance</option>
                    </select>
                </div>}
            </div>

            <div className="p-4 border-t text-right">
                <Button onClick={handleSubmit} loading={loading}>
                    {roomData ? "Update Room" : "Create Room"}
                </Button>
                <Button onClick={onClose} variant="secondary" className="ml-3">
                    Cancel
                </Button>
            </div>
        </Modal>
    );
};

export default RoomModal;
