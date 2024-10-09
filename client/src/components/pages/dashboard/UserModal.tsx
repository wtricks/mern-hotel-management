import { useEffect, useState } from "react";
import Modal from "../../common/Modal";
import Button from "../../common/Button";

interface User {
    name: string
    email: string
    phone: string
    address: string
    role: string
    preferences: Record<string, string>
    createdAt?: Date
}

interface UserModalProps {
    isOpen: boolean;
    onClose: () => void;
    userData?: User;
    onSubmit: (data: User) => void;
    loading?: boolean
}

const UserModal = ({ isOpen, onClose, userData, onSubmit, loading }: UserModalProps) => {
    const [name, setName] = useState(userData?.name || "");
    const [email, setEmail] = useState(userData?.email || "");
    const [phone, setPhone] = useState(userData?.phone || "");
    const [address, setAddress] = useState(userData?.address || "");
    const [role, setRole] = useState(userData?.role || "guest");
    const [preference, setPreference] = useState(Object.keys(userData?.preferences || {}).join(","));

    useEffect(() => {
        if (userData) {
            setName(userData?.name || '');
            setEmail(userData?.email || '');
            setPhone(userData?.phone || '');
            setAddress(userData?.address || '');
            setRole(userData?.role || '');
            setPreference(Object.keys(userData?.preferences || {}).join(","));
        }
    }, [userData])


    const handleSubmit = () => {
        const userInfo: User = {
            name,
            email,
            phone,
            address,
            role,
            preferences: preference.split(",").reduce((acc, pref) => ({ ...acc, [pref]: "true" }), {}),
        };
        onSubmit(userInfo);
        onClose(); // Close the modal after submission
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={userData ? "Edit User" : "Create User"}>
            <div className="p-4">
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="border rounded-md p-2 w-full"
                        placeholder="Enter name"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="border rounded-md p-2 w-full"
                        placeholder="Enter email"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">Phone</label>
                    <input
                        type="text"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="border rounded-md p-2 w-full"
                        placeholder="Enter phone number"
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">Address</label>
                    <input
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="border rounded-md p-2 w-full"
                        placeholder="Enter address"
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">Role</label>
                    <select
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        className="border rounded-md p-2 w-full"
                    >
                        <option value="guest">Guest</option>
                        <option value="admin">Admin</option>
                    </select>
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">Preferences</label>
                    <textarea
                        value={preference}
                        onChange={(e) => setPreference(e.target.value)}
                        className="border rounded-md p-2 w-full h-24"
                        placeholder="Enter preferences (comma separated)"
                    ></textarea>
                </div>
            </div>

            <div className="p-4 border-t text-right">
                <Button onClick={handleSubmit} loading={loading}>
                    {userData ? "Update User" : "Create User"}
                </Button>
                <Button onClick={onClose} variant="secondary" className="ml-3">
                    Cancel
                </Button>
            </div>
        </Modal>
    );
};

export default UserModal;
