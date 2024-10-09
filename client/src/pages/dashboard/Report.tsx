import React, { useState, useEffect } from 'react';

import api from '../../api';
import DashboardLayout from '../../components/pages/dashboard/DashboardLayout';

interface RevenueReport {
    startDate: string;
    endDate: string;
    totalRevenue: string;
}

interface OccupancyRateReport {
    totalRooms: number;
    occupiedRooms: number;
    occupancyRate: string;
}

interface GuestSatisfactionReport {
    averageRating: string;
    totalFeedbacks: number;
}

const ReportsDashboard: React.FC = () => {
    const [revenueReport, setRevenueReport] = useState<RevenueReport | null>(null);
    const [occupancyRateReport, setOccupancyRateReport] = useState<OccupancyRateReport | null>(null);
    const [guestSatisfactionReport, setGuestSatisfactionReport] = useState<GuestSatisfactionReport | null>(null);

    // For the date range in the revenue report
    const [startDate, setStartDate] = useState<string>('2024-01-01');
    const [endDate, setEndDate] = useState<string>('2024-12-31');

    const fetchReports = async () => {
        try {
            const [occupancyRes, revenueRes, satisfactionRes] = await Promise.all([
                api.get('/reports/occupancy'),
                api.get(`/reports/revenue?startDate=${startDate}&endDate=${endDate}`),
                api.get('/reports/satisfaction'),
            ]);

            setOccupancyRateReport(occupancyRes.data);
            setRevenueReport(revenueRes.data);
            setGuestSatisfactionReport(satisfactionRes.data);
        } catch (error) {
            console.error('Error fetching reports:', error);
        }
    };

    useEffect(() => {
        fetchReports();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [startDate, endDate]);

    return (
        <DashboardLayout title="Reports">
            <div className="p-6">
                <h1 className="text-2xl font-bold mb-6">Reports Dashboard</h1>

                {/* Revenue Report */}
                <div className="mb-8">
                    <h2 className="text-xl font-semibold mb-4">Revenue Report</h2>
                    <div className="flex items-center mb-4">
                        <label className="mr-4">Start Date:</label>
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="p-2 border rounded"
                        />
                    </div>
                    <div className="flex items-center mb-4">
                        <label className="mr-4">End Date:</label>
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="p-2 border rounded"
                        />
                    </div>
                    {revenueReport ? (
                        <div className="p-4 bg-gray-100 rounded">
                            <p>
                                <strong>Total Revenue:</strong> {revenueReport.totalRevenue}
                            </p>
                            <p>
                                <strong>Start Date:</strong> {revenueReport.startDate}
                            </p>
                            <p>
                                <strong>End Date:</strong> {revenueReport.endDate}
                            </p>
                        </div>
                    ) : (
                        <p>Loading revenue report...</p>
                    )}
                </div>

                {/* Occupancy Rate Report */}
                <div className="mb-8">
                    <h2 className="text-xl font-semibold mb-4">Occupancy Rate Report</h2>
                    {occupancyRateReport ? (
                        <div className="p-4 bg-gray-100 rounded">
                            <p>
                                <strong>Total Rooms:</strong> {occupancyRateReport.totalRooms}
                            </p>
                            <p>
                                <strong>Occupied Rooms:</strong> {occupancyRateReport.occupiedRooms}
                            </p>
                            <p>
                                <strong>Occupancy Rate:</strong> {occupancyRateReport.occupancyRate}
                            </p>
                        </div>
                    ) : (
                        <p>Loading occupancy rate report...</p>
                    )}
                </div>

                {/* Guest Satisfaction Report */}
                <div>
                    <h2 className="text-xl font-semibold mb-4">Guest Satisfaction Report</h2>
                    {guestSatisfactionReport ? (
                        <div className="p-4 bg-gray-100 rounded">
                            <p>
                                <strong>Average Rating:</strong> {guestSatisfactionReport.averageRating}
                            </p>
                            <p>
                                <strong>Total Feedbacks:</strong> {guestSatisfactionReport.totalFeedbacks}
                            </p>
                        </div>
                    ) : (
                        <p>Loading guest satisfaction report...</p>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
};

export default ReportsDashboard;
