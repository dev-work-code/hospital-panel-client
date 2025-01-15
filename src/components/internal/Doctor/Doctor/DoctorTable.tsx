import React, { useEffect, useState } from 'react';
import api from '@/utils/api';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { EllipsisVertical, Filter, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import PaginationComponent from './PaginationComponent';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import SkeletonLoader from '@/pages/common/SkeletionLoader';

interface Doctor {
  doctorId: string;
  doctorName: string;
  doctorEmail: string | null;
  doctorMobileNumber: string;
  doctorGender: string | null;
  doctorPhoto: string;
  doctorSpecialization: string | null; // Nullable
}

interface ApiResponse {
  status: number;
  message: string;
  data: Doctor[];
}

const DoctorsTable: React.FC = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState<string>(''); // State for name search
  const [departmentPopup, setDepartmentPopup] = useState<boolean>(false); // State for department popup
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]); // State for selected departments
  const [departmentSearchQuery, setDepartmentSearchQuery] = useState<string>(''); // State for department search
  const itemsPerPage = 8;

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await api.get<ApiResponse>('/hospital/getAllHospitalDoctors');
        setDoctors(response.data.data);
      } catch (err) {
        setError(
          (err as any)?.response?.data?.message || 'Failed to fetch doctors'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  // Extract unique departments from doctorSpecialization
  const uniqueDepartments = Array.from(
    new Set(
      doctors
        .map(doctor => doctor.doctorSpecialization)
        .filter(Boolean) // Remove null/undefined
    )
  );

  if (loading) return <SkeletonLoader fullPage className='rounded-[38px]' />;
  if (error) return <div className="text-center py-10 text-red-500">Error: {error}</div>;

  // Filter doctors by name
  const filteredDoctorsByName = doctors.filter(doctor =>
    doctor.doctorName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Filter doctors by selected departments
  const filteredDoctorsByDepartment =
    selectedDepartments.length > 0
      ? filteredDoctorsByName.filter(doctor =>
        selectedDepartments.includes(doctor.doctorSpecialization || '')
      )
      : filteredDoctorsByName;

  const totalPages = Math.ceil(filteredDoctorsByDepartment.length / itemsPerPage);
  const currentDoctors = filteredDoctorsByDepartment.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const toggleDepartmentSelection = (department: string) => {
    setSelectedDepartments(prev =>
      prev.includes(department)
        ? prev.filter(dep => dep !== department)
        : [...prev, department]
    );
  };

  return (
    <Card className="border rounded-[38px]">
      <CardHeader>
        <div className="flex flex-col lg:flex-row items-center justify-between">
          <p className="text-2xl text-[#013DC0] font-medium ml-6">DOCTORS</p>
          <div className="flex flex-col lg:flex-row gap-4 items-center mt-10">
            {/* Search Input */}
            <div className="relative w-full md:w-72">
              <Input
                type="text"
                placeholder="Search by name"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full border px-4 py-2 rounded-full pr-12 bg-white"
              />
              <div className="absolute right-0 top-1/2 -translate-y-1/2 bg-[#003CBF] p-2 rounded-full">
                <Search className="text-white" />
              </div>
            </div>
            <Link to="/doctor/add">
              <Button variant="primary">Add Doctor</Button>
            </Link>
            {/* Search by Department Button */}
            <div
              onClick={() => setDepartmentPopup(true)}
              className="cursor-pointer bg-[#003CBF] w-[45px] h-[45px] rounded flex items-center justify-center"
            >
              <Filter className="text-[30px] text-white" />
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="lg:p-6">
          <div className="border rounded-md">
            <Table className="w-full">
              <TableHeader className="bg-[#E8F1FD] w-full">
                <TableRow>
                  <TableHead className="w-1/7 text-left">S.No.</TableHead>
                  <TableHead className="w-1/7 text-center">Doctor Photo</TableHead>
                  <TableHead className="w-1/7 text-left">Name</TableHead>
                  <TableHead className="w-1/7 text-left">Email</TableHead>
                  <TableHead className="w-1/7 text-left">Mobile No.</TableHead>
                  <TableHead className="w-1/7 text-left">Gender</TableHead>
                  <TableHead className="w-1/7 text-left">Department</TableHead>
                  <TableHead className="w-1/7"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentDoctors.map((doctor, index) => (
                  <TableRow key={doctor.doctorId} className="cursor-pointer hover:bg-gray-100">
                    <TableCell className="w-1/7">
                      {(currentPage - 1) * itemsPerPage + index + 1}.
                    </TableCell>
                    <TableCell className="w-1/7 text-center">
                      <img
                        src={doctor.doctorPhoto || '/placeholder.png'}
                        alt={doctor.doctorName}
                        className="w-8 h-8 rounded-full mx-auto"
                      />
                    </TableCell>
                    <TableCell className="w-1/7">
                      <Link
                        to={`/doctor/${doctor.doctorId}`}
                        state={{ doctor }}
                        className="text-blue-500 hover:underline"
                      >
                        {doctor.doctorName}
                      </Link>
                    </TableCell>
                    <TableCell className="w-1/7">{doctor.doctorEmail || 'N/A'}</TableCell>
                    <TableCell className="w-1/7">{doctor.doctorMobileNumber}</TableCell>
                    <TableCell className="w-1/7">{doctor.doctorGender || 'N/A'}</TableCell>
                    <TableCell className="w-1/7">{doctor.doctorSpecialization || 'N/A'}</TableCell>
                    <TableCell className="w-1/7">
                      <DropdownMenu>
                        <DropdownMenuTrigger>
                          <EllipsisVertical />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem>
                            <Link
                              to={`/doctor/${doctor.doctorId}`} state={{ doctor }}>
                              View Profile
                            </Link>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="px-4 pb-4">
              <PaginationComponent
                currentPage={currentPage}
                totalPages={totalPages}
                setCurrentPage={setCurrentPage}
              />
            </div>
          </div>
        </div>
      </CardContent>

      {/* Department Popup */}
      {departmentPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl max-w-xl p-6">
            <h2 className="text-xl font-medium mb-4">Select Departments</h2>
            <div className="flex items-center border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-[5px_5px_20px_0px_#61ABEB33] w-[475px] h-[48px]">
              <input
                type="text"
                placeholder="Search departments"
                value={departmentSearchQuery}
                onChange={(e) => setDepartmentSearchQuery(e.target.value)}
                className="flex-1 p-2 rounded-full ml-4 focus:outline-none h-full"
              />
              <div className="bg-[#003CBF] w-[48px] h-[48px] rounded-full flex items-center justify-center cursor-pointer">
                <Search className="text-white" />
              </div>
            </div>
            <div className="h-64 overflow-y-auto border p-2 rounded-lg mt-4">
              {uniqueDepartments
                .filter(dept => dept && dept.toLowerCase().includes(departmentSearchQuery.toLowerCase()))
                .map(department =>
                  department !== null && ( // Ensure department is not null
                    <div key={department} className="flex items-center mb-2">
                      <input
                        type="checkbox"
                        checked={selectedDepartments.includes(department)} // Type-safe check
                        onChange={() => toggleDepartmentSelection(department)} // Toggle selection
                        className="mr-2"
                      />
                      <label>{department}</label>
                    </div>
                  )
                )}
            </div>
            <div className="mt-4 flex justify-end space-x-2">
              <Button variant="secondary" className='rounded-full px-4 py-2 w-40' onClick={() => setDepartmentPopup(false)}>Cancel</Button>
              <Button variant="primary" className='rounded-full px-4 py-2 w-40' onClick={() => setDepartmentPopup(false)}>Apply</Button>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};

export default DoctorsTable;
