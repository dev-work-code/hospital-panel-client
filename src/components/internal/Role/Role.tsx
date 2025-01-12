import React, { useEffect, useState } from "react";
import api from "@/utils/api";
import {
    Table,
    TableHeader,
    TableRow,
    TableHead,
    TableBody,
    TableCell,
} from "@/components/ui/table";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { EllipsisVertical } from "lucide-react";
import PaginationComponent from "../Patient/PaginationComponent";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import SkeletonLoader from "@/pages/common/SkeletionLoader";

interface Hospital {
    hospitalName: string;
    hospitalLocation: string;
}

interface Role {
    roleId: string;
    roleEmail: string;
    rolePhoneNumber: string;
    roleGender: string;
    roleDob: string;
    roleName: string;
    roleCreatedAt: string;
    roleUpdatedAt: string;
    hospital: Hospital;
}

const HospitalRoles: React.FC = () => {
    const [, setRoles] = useState<Role[]>([]);
    const [filteredRoles, setFilteredRoles] = useState<Role[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const itemsPerPage = 8; // Number of roles per page
    const totalPages = Math.ceil(filteredRoles.length / itemsPerPage);

    useEffect(() => {
        const fetchRoles = async () => {
            try {
                const response = await api.get("/hospital/getRoles");
                setRoles(response.data.data.roles);
                setFilteredRoles(response.data.data.roles);
            } catch (err) {
                setError("Failed to load roles. Please try again later.");
                console.error("Error fetching roles:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchRoles();
    }, []);

    const currentData = filteredRoles.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    if (loading) return <SkeletonLoader fullPage className="rounded-[38px] p-4" />;
    if (error) return <div className="text-red-500">{error}</div>;

    return (
        <Card className="p-4 space-y-4 max-w-6xl mx-auto shadow-[2px_4px_5px_0px_#E9EBFFB2] rounded-[38px] border">
            <CardTitle className="text-2xl font-normal  ml-6 text-[#003CBF]">Hospital Roles</CardTitle>
            <div className=" flex justify-end p-2">
                <Link to="/add-role">
                    <Button variant="primary">
                        Add Role
                    </Button>
                </Link>
            </div>
            {/* Table Section */}
            <div className="rounded-lg border border-[#D2E2F3] shadow-[2px_4px_5px_0px_#E9EBFFB2]">
                <Table className="w-full">
                    <TableHeader className="bg-[#E8F1FD]">
                        <TableRow>
                            <TableHead className="w-1/7 text-left">S.No.</TableHead>
                            <TableHead className="w-1/7 text-left">Hospital</TableHead>
                            <TableHead className="w-1/7 text-left">Email</TableHead>
                            <TableHead className="w-1/7 text-left">Phone Number</TableHead>
                            <TableHead className="w-1/7 text-left">Gender</TableHead>
                            <TableHead className="w-1/7 text-left">Role Name</TableHead>
                            <TableHead className="w-1/7"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {currentData.map((role, index) => (
                            <TableRow key={role.roleId} className="cursor-pointer hover:bg-gray-100">
                                <TableCell className="w-1/7">{index + 1}</TableCell>

                                <TableCell className="w-1/7">{role.roleEmail}</TableCell>
                                <TableCell className="w-1/7">{role.rolePhoneNumber}</TableCell>
                                <TableCell className="w-1/7">{role.roleGender}</TableCell>
                                <TableCell className="w-1/7">{role.hospital.hospitalName}</TableCell>
                                <TableCell className="w-1/7">
                                    <Badge
                                        variant="primary"
                                        className={`${role.roleName === "CLEANER"
                                            ? "bg-[#FEF4E6] text-[#F9A63A]"
                                            : role.roleName === "NURSING"
                                                ? "bg-[#FEECEB] text-[#F36960]"
                                                : role.roleName === "ACCOUNTANT"
                                                    ? "bg-[#E7F8F0] text-[#41C588]"
                                                    : ""
                                            }`}
                                    >
                                        {role.roleName}
                                    </Badge>
                                </TableCell>

                                <TableCell className="w-1/7">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger>
                                            <EllipsisVertical />
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent>
                                            <DropdownMenuItem>
                                                <Link to={`/role/${role.roleId}`} state={{ role }}>
                                                    View Details
                                                </Link>
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

            </div>
            {/* Pagination Section */}
            <PaginationComponent
                currentPage={currentPage}
                totalPages={totalPages}
                setCurrentPage={setCurrentPage}
            />
        </Card>
    );
};

export default HospitalRoles;
