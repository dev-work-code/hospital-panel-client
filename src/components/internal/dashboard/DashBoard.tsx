import React, { useEffect, useState } from "react";
import api from "@/utils/api";

type Overview = {
    totalPatients: number;
    admissionRate: string;
    ongoingCases: number;
};

type Revenue = {
    monthly: { date: string; amount: number }[];
};

type Department = {
    name: string;
    doctorCount: number;
    id: string;
};

type DashboardData = {
    overview: Overview;
    revenue: Revenue;
    departments: Department[];
};

const Dashboard: React.FC = () => {
    const [data, setData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await api.get("/hospital/dashboard");
                if (response.data.success) {
                    setData(response.data.data);
                } else {
                    throw new Error("Data retrieval unsuccessful");
                }
            } catch (err: unknown) {
                if (err instanceof Error) {
                    setError(err.message);
                } else {
                    setError("An unknown error occurred");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return <div className="text-center py-8 text-lg text-blue-500">Loading...</div>;
    }

    if (error) {
        return <div className="text-center py-8 text-lg text-red-500">Error: {error}</div>;
    }

    return (
        <div className="p-8 bg-gray-100 min-h-screen">
            <h1 className="text-3xl font-bold text-center mb-8">Hospital Dashboard</h1>

            {/* Overview Section */}
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                <h2 className="text-2xl font-semibold mb-4">Overview</h2>
                <div className="flex justify-between">
                    <div className="text-center">
                        <p className="text-lg font-medium">Total Patients</p>
                        <p className="text-xl font-bold">{data?.overview.totalPatients}</p>
                    </div>
                    <div className="text-center">
                        <p className="text-lg font-medium">Admission Rate</p>
                        <p className="text-xl font-bold">{data?.overview.admissionRate}%</p>
                    </div>
                    <div className="text-center">
                        <p className="text-lg font-medium">Ongoing Cases</p>
                        <p className="text-xl font-bold">{data?.overview.ongoingCases}</p>
                    </div>
                </div>
            </div>

            {/* Revenue Section */}
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                <h2 className="text-2xl font-semibold mb-4">Monthly Revenue</h2>
                <ul>
                    {data?.revenue.monthly.map((entry, index) => (
                        <li
                            key={index}
                            className="flex justify-between border-b py-2 text-gray-700"
                        >
                            <span>{new Date(entry.date).toLocaleDateString()}</span>
                            <span className="font-bold">${entry.amount}</span>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Departments Section */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-semibold mb-4">Departments</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {data?.departments.map((department) => (
                        <div
                            key={department.id}
                            className="p-4 bg-gray-50 border rounded-lg shadow-sm"
                        >
                            <h3 className="text-xl font-bold mb-2">{department.name}</h3>
                            <p className="text-gray-600">Doctors: {department.doctorCount}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
