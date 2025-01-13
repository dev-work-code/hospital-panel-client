import React, { useEffect, useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
    TableHead,
} from "@/components/ui/table";
import api from "@/utils/api";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { EllipsisVertical, Search } from "lucide-react";
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import { Card, CardTitle } from "@/components/ui/card";

type Invoice = {
    patientId: string;
    patientName: string;
    patientGender: string;
    billAmount: string;
    billDetails: string;
    billNumber: string;
    createdAt: string;
    doctor: {
        doctorName: string;
        doctorMobileNumber: string;
    };
    paymentMode: string;
};

const Invoices: React.FC = () => {
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [filteredInvoices, setFilteredInvoices] = useState<Invoice[]>([]);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchInvoices = async () => {
            try {
                const response = await api.get(
                    "https://livapp.elitceler.com/api/v1/hospital/patients/getInvoices"
                );
                if (response.data.success) {
                    setInvoices(response.data.data);
                    setFilteredInvoices(response.data.data);
                } else {
                    setError("Failed to fetch invoices.");
                }
            } catch (err) {
                setError("An error occurred while fetching data.");
            } finally {
                setLoading(false);
            }
        };

        fetchInvoices();
    }, []);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    };

    useEffect(() => {
        if (searchQuery === "") {
            setFilteredInvoices(invoices);
        } else {
            const filtered = invoices.filter(invoice =>
                invoice.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                invoice.billNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                invoice.doctor.doctorName.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setFilteredInvoices(filtered);
        }
    }, [searchQuery, invoices]);

    if (loading) {
        return <div className="text-center mt-10">Loading...</div>;
    }

    if (error) {
        return <div className="text-center text-red-500 mt-10">{error}</div>;
    }

    return (
        <div className="container mx-auto px-4 mt-10">
            <Card className="p-4 space-y-4 max-w-6xl mx-auto shadow-[2px_4px_5px_0px_#E9EBFFB2] rounded-[38px] border">
                <CardTitle className="text-2xl font-normal ml-6 text-[#003CBF]">Patient Invoices</CardTitle>

                {/* Search Input */}
                <div className="flex justify-end mr-10">
                    <div className="relative w-full md:w-80 shadow-[5px_5px_20px_0px_#61ABEB33] rounded-full">
                        <input
                            type="text"
                            placeholder="Search invoices..."
                            value={searchQuery}
                            onChange={handleSearchChange}
                            className="w-full border px-4 py-3 rounded-full pr-12 bg-white"
                        />
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 bg-[#003CBF] p-3 rounded-full">
                            <Search className="text-white" />
                        </div>
                    </div>
                </div>
                {/* Table Section */}
                <div className="rounded-lg border border-[#D2E2F3] shadow-[2px_4px_5px_0px_#E9EBFFB2]">
                    <Table className="w-full">
                        <TableHeader className="bg-[#E8F1FD]">
                            <TableRow>
                                <TableHead className="w-1/7 text-left">S. No</TableHead>
                                <TableHead className="w-1/7 text-left">Patient Name</TableHead>
                                <TableHead className="w-1/7 text-left">Gender</TableHead>
                                <TableHead className="w-1/7 text-left">Bill Amount</TableHead>
                                <TableHead className="w-1/7 text-left">    Doctor Assigned</TableHead>
                                <TableHead className="w-1/7 text-left">Payment Mode</TableHead>
                                <TableHead className="w-1/7 text-left">Created At</TableHead>
                                <TableHead className="w-1/7"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredInvoices.map((invoice, index) => (
                                <TableRow key={invoice.patientId} className="cursor-pointer hover:bg-gray-100">
                                    {/* Serial Number Column */}
                                    <TableCell className="w-1/7">{index + 1}</TableCell> {/* Serial number starts from 1 */}
                                    <TableCell className="w-1/7">{invoice.patientName}</TableCell>
                                    <TableCell className="w-1/7">{invoice.patientGender}</TableCell>
                                    <TableCell className="w-1/7">₹{invoice.billAmount}</TableCell>
                                    <TableCell className="w-1/7">
                                        {invoice.doctor.doctorName}
                                    </TableCell>
                                    <TableCell className="w-1/7">{invoice.paymentMode}</TableCell>
                                    <TableCell className="w-1/7">
                                        {new Date(invoice.createdAt).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell className="w-1/7">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger>
                                                <EllipsisVertical />
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent>
                                                <DropdownMenuItem>
                                                    <Link to={`/invoice/${invoice.patientId}`} className="text-blue-500 hover:underline">
                                                        View Details
                                                    </Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem>
                                                    <a
                                                        href={invoice.billDetails}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-blue-500 hover:underline"
                                                    >
                                                        View Bill
                                                    </a>
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>

                    </Table>
                </div>
            </Card>
        </div>
    );
};

export default Invoices;
