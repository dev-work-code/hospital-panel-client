import React, { useState, useEffect } from 'react';
import api from '@/utils/api';
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
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Search, Calendar as CalendarIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

type Appointment = {
  type: 'appointment';
  name: string;
  description: string;
  bookingSlotTime: string;
  bookingSlotType: string;
};

type Patient = {
  type: 'patient';
  patientName: string;
  patientEmail: string;
  patientPhoneNumber: string;
};

type CombinedData = Appointment | Patient;

const Appointments: React.FC = () => {
  const [combinedData, setCombinedData] = useState<CombinedData[]>([]);
  const [filteredData, setFilteredData] = useState<CombinedData[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterType, setFilterType] = useState<string>('ALL');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await api.get('/hospital/patients/appointments');
      if (response.status === 200 && response.data?.data) {
        const { appointments, patients } = response.data.data;

        const data: CombinedData[] = [
          ...appointments.map((app: any) => ({ ...app, type: 'appointment' as const })),
          ...patients.map((patient: any) => ({ ...patient, type: 'patient' as const })),
        ];

        setCombinedData(data);
        setFilteredData(data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    filterData(event.target.value, filterType, selectedDate);
  };

  const handleFilterChange = (type: string) => {
    setFilterType(type);
    filterData(searchTerm, type, selectedDate);
  };

  const handleDateChange = (date: Date | undefined) => {
    const newDate = date || null;
    setSelectedDate(newDate);
    filterData(searchTerm, filterType, newDate);
  };

  const filterData = (term: string, type: string, date: Date | null) => {
    let filtered = combinedData;

    if (type === 'ONLINE') {
      filtered = filtered.filter(item => item.type === 'appointment' && (item as Appointment).bookingSlotType === 'ONLINE');
    } else if (type === 'OFFLINE') {
      filtered = filtered.filter(item => item.type === 'appointment' && (item as Appointment).bookingSlotType === 'OFFLINE');
    }

    if (term) {
      filtered = filtered.filter(item =>
        item.type === 'appointment'
          ? (item as Appointment).name.toLowerCase().includes(term.toLowerCase())
          : (item as Patient).patientName.toLowerCase().includes(term.toLowerCase())
      );
    }

    if (date) {
      const formattedDate = date.toLocaleDateString('en-US');
      filtered = filtered.filter(item =>
        item.type === 'appointment' &&
        (item as Appointment).bookingSlotTime === formattedDate
      );
    }

    setFilteredData(filtered);
  };

  return (
    <Card className="p-4">
      <CardHeader>
        <h1 className="text-2xl text-[#013DC0] font-normal mb-4">Appointments</h1>
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
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
          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="relative w-full md:w-72">
              <Input
                type="text"
                placeholder="Search"
                value={searchTerm}
                onChange={handleSearch}
                className="w-full border px-4 py-2 rounded-full pr-12 bg-white"
              />
              <div className="absolute right-0 top-1/2 -translate-y-1/2 bg-[#003CBF] p-2 rounded-full">
                <Search className="text-white" />
              </div>
            </div>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="primary" className="flex items-center gap-2 px-4 py-2">
                  <CalendarIcon className="h-5 w-5" />
                  {selectedDate ? selectedDate.toLocaleDateString('en-US') : ""}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <Card className="p-2">
                  <Calendar
                    mode="single"
                    selected={selectedDate || undefined}
                    onSelect={handleDateChange}
                    className="border rounded-md shadow"
                  />
                </Card>
              </PopoverContent>
            </Popover>
            <Link to="/add-patients">
              <Button variant="primary" className="px-4 py-2">Add Appointment</Button>
            </Link>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="border rounded-md overflow-x-auto">
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
                      {item.type === 'appointment' ? (item as Appointment).name : (item as Patient).patientName}
                    </TableCell>
                    <TableCell className="px-4 py-2">
                      {item.type === 'appointment' ? 'Appointment' : 'Patient'}
                    </TableCell>
                    <TableCell className="px-4 py-2">
                      {item.type === 'appointment' ? (item as Appointment).description : 'N/A'}
                    </TableCell>
                    <TableCell className="px-4 py-2">
                      {item.type === 'appointment'
                        ? (item as Appointment).bookingSlotTime
                        : (item as Patient).patientEmail}
                    </TableCell>
                    <TableCell className="px-4 py-2">
                      {item.type === 'appointment'
                        ? (item as Appointment).bookingSlotType
                        : 'N/A'}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">No appointments found</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default Appointments;
