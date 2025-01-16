import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import React from 'react';

type PatientDetails = {
    patientId: string;
    patientName: string;
    patientGender: string;
    patientEmail: string;
    patientPhoneNumber: string;
    patientDateOfBirth: string;
    patientBloodGroup: string;
    patientAge: string;
    patientChiefComplaints: string;
    billAmount: string;
    billNumber: string;
    billDetails: string;
    createdAt: string;
    doctor: {
        doctorName: string;
        doctorMobileNumber: string;
    };
    paymentMode: string;
};

type InvoiceTableProps = {
    details: PatientDetails[];
};

const InvoiceTable: React.FC<InvoiceTableProps> = ({ details }) => {
    return (
        <div className="border border-[#E8F1FD] rounded-lg">
            <Table className="w-full">
                <TableHeader className="bg-[#E8F1FD]">
                    <TableRow>
                        <TableHead className="w-1/7 text-left">S.No.</TableHead>
                        <TableHead className="w-1/7 text-left">Bill Number</TableHead>
                        <TableHead className="w-1/7 text-left">Payment Mode</TableHead>
                        <TableHead className="w-1/7 text-left">Created At</TableHead>
                        <TableHead className="w-1/7 text-left">Doctor Assigned</TableHead>
                        <TableHead className="w-1/7 text-left">View Bill</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {details.map((detail, index) => (
                        <TableRow key={detail.patientId} className="cursor-pointer hover:bg-gray-100">
                            <TableCell className="w-1/7">{index + 1}</TableCell>
                            <TableCell className="w-1/7">{detail.billNumber}</TableCell>
                            <TableCell className="w-1/7">{detail.paymentMode}</TableCell>
                            <TableCell className="w-1/7">{new Date(detail.createdAt).toLocaleDateString()}</TableCell>
                            <TableCell className="w-1/7">{detail.doctor.doctorName}</TableCell>
                            <TableCell className="w-1/7 h-14">
                                <a
                                    href={detail.billDetails}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="bg-[#013DC0] text-white px-4 py-2 rounded-md"
                                >
                                    View Bill
                                </a>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
};

export default InvoiceTable;
