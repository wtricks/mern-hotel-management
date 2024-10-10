import { useEffect, useState } from "react";
import { FaUsers, FaDollarSign, FaDoorClosed, FaCalendarCheck } from 'react-icons/fa'
import { TbMushroom } from "react-icons/tb";

import DashboardLayout from "../../components/pages/dashboard/DashboardLayout";
import DashboardCard from "../../components/pages/dashboard/InfoCard";
import api from "../../api";

const Dashboard = () => {
    const [dashboardData, setDashboardData] = useState({
        totalRooms: 0,
        occupiedRooms: 0,
        totalUsers: 0,
        totalBookings: 0,
        totalAmount: 0
    });

    useEffect(() => {
        // Fetch dashboard data from API (replace with your own API endpoint)
        api.get("/reports/stats").then((res) => {
            setDashboardData(res.data.data);
        });
    }, []);

    return (
        <DashboardLayout title="Dashboard">
            <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <DashboardCard
                    title="Users"
                    count={dashboardData.totalUsers}
                    color="bg-blue-500"
                    icon={<FaUsers className="text-2xl"></FaUsers>}
                />
                <DashboardCard
                    title="Earnings"
                    count={`$${dashboardData.totalAmount}`}
                    color="bg-green-500"
                    icon={<FaDollarSign className="text-2xl"></FaDollarSign>}
                />
                <DashboardCard
                    title="Rooms"
                    count={dashboardData.totalRooms}
                    color="bg-purple-500"
                    icon={<FaDoorClosed className="text-2xl"></FaDoorClosed>}
                />
                <DashboardCard
                    title="Bookings"
                    count={dashboardData.totalBookings}
                    color="bg-yellow-500"
                    icon={<FaCalendarCheck className="text-2xl"></FaCalendarCheck>}
                />
                <DashboardCard
                    title="Occupied Rooms"
                    count={dashboardData.occupiedRooms}
                    color="bg-teal-500"
                    icon={<TbMushroom className="text-2xl"></TbMushroom>}
                />
            </div>
        </DashboardLayout>
    );
};

export default Dashboard;
