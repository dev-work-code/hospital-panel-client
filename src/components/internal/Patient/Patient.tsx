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
import { Link } from "react-router-dom";
import { EllipsisVertical } from "lucide-react";
import PaginationComponent from "./PaginationComponent";
import SkeletonLoader from "@/pages/common/SkeletionLoader";
import { Card, CardTitle } from "@/components/ui/card";

interface Doctor {
  doctorName: string;
  doctorMobileNumber: string;
  areaOfSpecialization: string;
}

interface Patient {
  patientId: string;
  patientName: string;
  patientGender: string;
  patientEmail: string;
  patientPhoneNumber: string;
  patientDateOfBirth: string;
  patientBloodGroup: string;
  patientAppointmentType: string;
  doctor: Doctor;
}

const HospitalPatients: React.FC = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [appointmentFilter, setAppointmentFilter] = useState<string>("ALL");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 8; // Number of patients per page
  const totalPages = Math.ceil(filteredPatients.length / itemsPerPage);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await api.get("/hospital/patients/getHospitalPatients");
        setPatients(response.data.data);
        setFilteredPatients(response.data.data);
      } catch (err) {
        setError("Failed to load patient data. Please try again later.");
        console.error("Error fetching patients:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  useEffect(() => {
    if (appointmentFilter === "ALL") {
      setFilteredPatients(patients);
    } else {
      setFilteredPatients(
        patients.filter(
          (patient) => patient.patientAppointmentType === appointmentFilter
        )
      );
    }
  }, [appointmentFilter, patients]);

  const currentData = filteredPatients.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (loading) return <SkeletonLoader fullPage className='rounded-[38px]' />;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <Card className="p-4 space-y-4 max-w-6xl mx-auto shadow-[2px_4px_5px_0px_#E9EBFFB2] rounded-[38px] border">
      <CardTitle className="text-2xl font-normal mb-10 ml-6 text-[#003CBF]">Patients</CardTitle>

      {/* Filter Buttons */}
      <div className="mb-4 flex gap-2">
        <button
          onClick={() => setAppointmentFilter("ALL")}
          className={`w-20 py-1 rounded-full ${appointmentFilter === "ALL"
            ? "bg-[#013DC0] text-white"
            : "bg-white border border-[#013DC0] text-[#013DC0]"
            }`}
        >
          All
        </button>
        <button
          onClick={() => setAppointmentFilter("OFFLINE")}
          className={`w-20 py-1 rounded-full ${appointmentFilter === "OFFLINE"
            ? "bg-[#013DC0] text-white"
            : "bg-white border border-[#013DC0] text-[#013DC0]"
            }`}
        >
          Offline
        </button>
        <button
          onClick={() => setAppointmentFilter("ONLINE")}
          className={`w-20 py-1 rounded-full ${appointmentFilter === "ONLINE"
            ? "bg-[#013DC0] text-white"
            : "bg-white border border-[#013DC0] text-[#013DC0]"
            }`}
        >
          Online
        </button>
      </div>

      {/* Table Section */}
      <div className="rounded-lg border border-[#E8F1FD]">
        <Table className="w-full">
          <TableHeader className="bg-[#E8F1FD] w-full">
            <TableRow>
              <TableHead className="w-1/7 text-left">S.No.</TableHead>
              <TableHead className="w-1/7 text-left">Name</TableHead>
              <TableHead className="w-1/7 text-left">Email</TableHead>
              <TableHead className="w-1/7 text-left">Mobile No.</TableHead>
              <TableHead className="w-1/7 text-left">Gender</TableHead>
              <TableHead className="w-1/7 text-left">Blood Group</TableHead>
              <TableHead className="w-1/7 text-left">Appointment Type</TableHead>
              <TableHead className="w-1/7 text-left">Doctor</TableHead>
              <TableHead className="w-1/7"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentData.map((patient, index) => (
              <TableRow key={patient.patientId} className="cursor-pointer hover:bg-gray-100">
                <TableCell className="w-1/7">{index + 1}</TableCell>
                <TableCell className="w-1/7">{patient.patientName}</TableCell>
                <TableCell className="w-1/7">{patient.patientEmail}</TableCell>
                <TableCell className="w-1/7">{patient.patientPhoneNumber}</TableCell>
                <TableCell className="w-1/7">{patient.patientGender}</TableCell>
                <TableCell className="w-1/7">{patient.patientBloodGroup}</TableCell>
                <TableCell className="w-1/7">{patient.patientAppointmentType}</TableCell>
                <TableCell className="w-1/7">{patient.doctor.doctorName}</TableCell>
                <TableCell className="w-1/7">
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <EllipsisVertical />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem>
                        <Link to={`/patient/${patient.patientId}`} state={{ patient }}>
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
      </div>
      <PaginationComponent
        currentPage={currentPage}
        totalPages={totalPages}
        setCurrentPage={setCurrentPage}
      />
    </Card>
  );
};

export default HospitalPatients;
