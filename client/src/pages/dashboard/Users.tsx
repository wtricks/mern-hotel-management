import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import DashboardLayout from "../../components/pages/dashboard/DashboardLayout";
import UserModal from "../../components/pages/dashboard/UserModal";
import Button from "../../components/common/Button";
import api from "../../api";

interface User {
    _id?: string
    name: string
    email: string
    role: string
    createdAt?: Date
    phone: string
    address: string
    preferences: Record<string, string>
}

const Users = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [sort, setSort] = useState("newest");
    const [loading, setLoading] = useState(true);

    const [pageSize, setPageSize] = useState(10);

    const [editIndex, setEditIndex] = useState(-1);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await api.get("/users", { data: { page, sort, limit: pageSize } });
            setUsers(response.data.data.users);
            setTotalPages(response.data.data.total);
        } catch (error) {
            console.error("Failed to fetch users:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, sort]);

    const handleDeleteUser = async (userId: string) => {
        try {
            await api.delete(`/users/${userId}`);
            fetchUsers(); // Re-fetch users after deleting
        } catch (error) {
            console.error("Failed to delete user:", error);
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

    const onUpdateUser = (user: User) => {
        setLoading(true)
        api.put(`/users/${users[editIndex]._id}`, user)
            .then(() => {
                fetchUsers();
                setEditIndex(-1);
                toast.success("User updated successfully");
            }).finally(() => setLoading(false))
    }

    return (
        <DashboardLayout title="Users">
            <div className="flex justify-between items-center mb-4 px-12 mt-12">
                <h1 className="text-2xl font-bold">Users</h1>
                <div className="flex items-center">
                    <label htmlFor="sort" className="mr-2">Page size:</label>
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
                                <th className="px-4 py-2 border">Email</th>
                                <th className="px-4 py-2 border">Role</th>
                                <th className="px-4 py-2 border">Created At</th>
                                <th className="px-4 py-2 border">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user, index) => (
                                <tr key={user._id}>
                                    <td className="px-4 py-2 border text-center">{user.name}</td>
                                    <td className="px-4 py-2 border text-center">{user.email}</td>
                                    <td className="px-4 py-2 border text-center">{user.role}</td>
                                    <td className="px-4 py-2 border text-center">{new Date(user.createdAt!).toLocaleDateString()}</td>
                                    <td className="px-4 py-2 border text-center">
                                        <Button onClick={() => setEditIndex(index)}>Edit</Button>
                                        <Button onClick={() => handleDeleteUser(user._id!)} className="ml-2 bg-red-500">Delete</Button>
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

            {/* Create?Update Modals */}
            <UserModal isOpen={editIndex != -1} onClose={() => setEditIndex(-1)} onSubmit={onUpdateUser} userData={users[editIndex]} />
        </DashboardLayout>
    );
};

export default Users;
