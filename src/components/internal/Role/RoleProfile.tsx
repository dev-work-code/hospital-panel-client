import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import api from '@/utils/api';

interface Role {
    roleId: string;
    roleEmail: string;
    rolePhoneNumber: string;
    roleGender: string;
    roleDob: string;
    roleName: string;
    roleCreatedAt: string;
    roleUpdatedAt: string;
}

const RoleProfile: React.FC = () => {
    const { roleId } = useParams<{ roleId: string }>();
    const [role, setRole] = useState<Role | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchRoleDetails = async () => {
            try {
                setLoading(true);
                const response = await api.get(`/hospital/getRoleById`, {
                    params: { roleId },
                });
                if (response.data.success) {
                    setRole(response.data.data);
                } else {
                    setError("Failed to fetch role details.");
                }
            } catch (err: any) {
                setError(err.response?.data?.message || "An error occurred.");
            } finally {
                setLoading(false);
            }
        };

        fetchRoleDetails();
    }, [roleId]);

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p className="text-red-500">{error}</p>;
    }

    if (!role) {
        return <p>No role data available.</p>;
    }

    return (
        <Card className="p-6 space-y-4 max-w-5xl mx-auto shadow-[2px_4px_5px_0px_#E9EBFFB2] rounded-[38px] border border-gray-300 bg-white">
            <CardHeader className="text-2xl font-medium mb-6 ml-6 text-[#003CBF]">Role</CardHeader>
            <CardContent className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <Label>Role Name</Label>
                    <Card className="border-none shadow-none rounded-lg p-2 bg-[#E9F4FF] text-[#013DC0] font-normal text-base">
                        {role.roleName || "N/A"}
                    </Card>
                </div>
                <div>
                    <Label>Email</Label>
                    <Card className="border-none shadow-none rounded-lg p-2 bg-[#E9F4FF] text-[#013DC0] font-normal text-base">
                        {role.roleEmail || "N/A"}
                    </Card>
                </div>
                <div>
                    <Label>Phone Number</Label>
                    <Card className="border-none shadow-none rounded-lg p-2 bg-[#E9F4FF] text-[#013DC0] font-normal text-base">
                        {role.rolePhoneNumber || "N/A"}
                    </Card>
                </div>
                <div>
                    <Label>Gender</Label>
                    <Card className="border-none shadow-none rounded-lg p-2 bg-[#E9F4FF] text-[#013DC0] font-normal text-base">
                        {role.roleGender || "N/A"}
                    </Card>
                </div>
                <div>
                    <Label>Date of Birth</Label>
                    <Card className="border-none shadow-none rounded-lg p-2 bg-[#E9F4FF] text-[#013DC0] font-normal text-base">
                        {role.roleDob ? new Date(role.roleDob).toLocaleDateString() : "N/A"}
                    </Card>
                </div>
                <div>
                    <Label>Created At</Label>
                    <Card className="border-none shadow-none rounded-lg p-2 bg-[#E9F4FF] text-[#013DC0] font-normal text-base">
                        {role.roleCreatedAt ? new Date(role.roleCreatedAt).toLocaleString() : "N/A"}
                    </Card>
                </div>
                <div>
                    <Label>Updated At</Label>
                    <Card className="border-none shadow-none rounded-lg p-2 bg-[#E9F4FF] text-[#013DC0] font-normal text-base">
                        {role.roleUpdatedAt ? new Date(role.roleUpdatedAt).toLocaleString() : "N/A"}
                    </Card>
                </div>
            </CardContent>
        </Card>
    );
};

export default RoleProfile;
