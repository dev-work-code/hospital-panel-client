import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardHeader } from '@/components/ui/card';
import { Search } from 'lucide-react';

type Appointment = {
    type: "appointment";
    name: string;
    description: string;
    bookingSlotTime: string;
    bookingSlotType: string;
};

type Patient = {
    type: "patient";
    patientName: string;
    patientGender: string;
    patientEmail: string;
};

type CombinedData = Appointment | Patient;

interface Doctor {
    doctorId: string;
    doctorName: string;
    doctorEmail: string | null;
    doctorMobileNumber: string;
    doctorGender: string | null;
    doctorPhoto: string;
    appointments: Appointment[];
    patients: Patient[];
}

const DoctorDetail: React.FC = () => {
    const { state } = useLocation();
    const doctor = state?.doctor as Doctor;

    const [searchTerm, setSearchTerm] = useState<string>('');
    const [filterType, setFilterType] = useState<string>('ALL');
    const [combinedData, setCombinedData] = useState<CombinedData[]>([]);
    const [filteredData, setFilteredData] = useState<CombinedData[]>([]);

    useEffect(() => {
        if (doctor) {
            const data: CombinedData[] = [
                ...doctor.appointments.map((app) => ({ ...app, type: 'appointment' as const })),
                ...doctor.patients.map((patient) => ({ ...patient, type: 'patient' as const })),
            ];

            setCombinedData(data);
            setFilteredData(data);
        }
    }, [doctor]);

    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
        filterData(event.target.value, filterType);
    };

    const handleFilterChange = (type: string) => {
        setFilterType(type);
        filterData(searchTerm, type);
    };

    const filterData = (term: string, type: string) => {
        let filtered = combinedData;

        if (type === 'ONLINE') {
            filtered = filtered.filter((item) => item.type === 'appointment' && (item as Appointment).bookingSlotType === 'ONLINE');
        } else if (type === 'OFFLINE') {
            filtered = filtered.filter((item) => item.type === 'appointment' && (item as Appointment).bookingSlotType === 'OFFLINE');
        }

        if (term) {
            filtered = filtered.filter((item) =>
                item.type === 'appointment'
                    ? (item as Appointment).name.toLowerCase().includes(term.toLowerCase())
                    : (item as Patient).patientName.toLowerCase().includes(term.toLowerCase())
            );
        }

        setFilteredData(filtered);
    };

    return (
        <Card className="p-4">
            {/* Doctor Profile */}
            <CardHeader className="text-2xl text-[#013DC0] font-medium mb-4">Doctor Profile</CardHeader>
            <Card className="w-full md:w-96 shadow-md mb-8 p-4">
                <div className="flex items-center gap-4">
                    <img
                        src={doctor?.doctorPhoto}
                        alt={doctor?.doctorName}
                        className="w-24 h-24 rounded-full"
                    />
                    <CardDescription>
                        <h1 className="text-xl font-semibold">{doctor?.doctorName}</h1>
                        <p className="text-sm">
                            <strong>Email:</strong> {doctor?.doctorEmail || 'N/A'}
                        </p>
                        <p className="text-sm">
                            <strong>Mobile:</strong> {doctor?.doctorMobileNumber}
                        </p>
                        <p className="text-sm">
                            <strong>Gender:</strong> {doctor?.doctorGender || 'N/A'}
                        </p>
                    </CardDescription>
                </div>
            </Card>

            {/* Appointments and Patients */}
            <div className="bg-[#E9F4FF] rounded-md mb-4 p-2">
                <h2 className="text-xl font-medium text-[#013DC0]">Appointments and Patients</h2>
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-4">
                {/* Search Input */}
                <div className="relative w-full md:w-72">
                    <Input
                        type="text"
                        placeholder="Search"
                        value={searchTerm}
                        onChange={handleSearch}
                        className="w-full border px-4 py-2 rounded-full pr-10"
                    />
                    <div className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-[#003CBF] p-2 rounded-full">
                        <Search className="text-white w-5 h-5" />
                    </div>
                </div>

                {/* Filter Buttons */}
                <div className="flex gap-2">
                    <Button
                        variant={filterType === 'ALL' ? 'primary' : 'outline'}
                        onClick={() => handleFilterChange('ALL')}
                        className="rounded-full px-4 py-2"
                    >
                        All
                    </Button>
                    <Button
                        variant={filterType === 'ONLINE' ? 'primary' : 'outline'}
                        onClick={() => handleFilterChange('ONLINE')}
                        className="rounded-full px-4 py-2"
                    >
                        Online
                    </Button>
                    <Button
                        variant={filterType === 'OFFLINE' ? 'primary' : 'outline'}
                        onClick={() => handleFilterChange('OFFLINE')}
                        className="rounded-full px-4 py-2"
                    >
                        Offline
                    </Button>
                </div>
            </div>

            {/* Table */}
            <div className="border rounded-md overflow-auto">
                <Table className="w-full">
                    <TableHeader className="bg-[#E8F1FD]">
                        <TableRow>
                            <TableHead className="px-4 py-2">S.No.</TableHead>
                            <TableHead className="px-4 py-2">Name</TableHead>
                            <TableHead className="px-4 py-2">Type</TableHead>
                            <TableHead className="px-4 py-2">Description</TableHead>
                            <TableHead className="px-4 py-2">Date/Email</TableHead>
                            <TableHead className="px-4 py-2">Slot Type</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredData.length > 0 ? (
                            filteredData.map((item, index) => (
                                <TableRow key={index}>
                                    <TableCell className="px-4 py-2">{index + 1}</TableCell>
                                    <TableCell className="px-4 py-2">
                                        {item.type === 'appointment' ? item.name : item.patientName}
                                    </TableCell>
                                    <TableCell className="px-4 py-2">
                                        {item.type === 'appointment' ? 'Appointment' : 'Patient'}
                                    </TableCell>
                                    <TableCell className="px-4 py-2">
                                        {item.type === 'appointment' ? item.description : 'N/A'}
                                    </TableCell>
                                    <TableCell className="px-4 py-2">
                                        {item.type === 'appointment' ? item.bookingSlotTime : item.patientEmail}
                                    </TableCell>
                                    <TableCell className="px-4 py-2">
                                        {item.type === 'appointment' ? item.bookingSlotType : 'N/A'}
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-8">
                                    No data found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </Card>
    );
};

export default DoctorDetail;
