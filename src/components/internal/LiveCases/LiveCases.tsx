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
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent } from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
import { EllipsisVertical } from "lucide-react";
import PaginationComponent from "../Patient/PaginationComponent";
import { Button } from "@/components/ui/button";
import SkeletonLoader from "@/pages/common/SkeletionLoader";
import { Card, CardTitle } from "@/components/ui/card";

interface HospitalCase {
  caseId: string;
  name: string;
  mobileNumber: string;
  gender: string;
  doctorAssigned: string;
  status: string;
}

const HospitalCases: React.FC = () => {
  const [, setCases] = useState<HospitalCase[]>([]);
  const [filteredCases, setFilteredCases] = useState<HospitalCase[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 8; // Number of cases per page
  const totalPages = Math.ceil(filteredCases.length / itemsPerPage);
  const navigate = useNavigate(); // Initialize navigate


  useEffect(() => {
    const fetchHospitalCases = async () => {
      try {
        const response = await api.get("/hospital/get-hospital-cases");
        setCases(response.data.data);
        setFilteredCases(response.data.data);
      } catch (err) {
        setError("Failed to load hospital cases. Please try again later.");
        console.error("Error fetching hospital cases:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHospitalCases();
  }, []);

  const handleViewDetails = async (caseId: string) => {
    try {
      const response = await api.get(`/hospital/getHospitalCaseById?caseId=${caseId}`);
      const caseDetails = response.data?.data;
      console.log('Case Details:', caseDetails); // Replace this with any pre-processing if needed
      // Redirect to the live case profile page
      navigate('/hospital-case-profile', { state: { caseDetails } });
    } catch (error) {
      console.error('Failed to fetch case details:', error);
    }
  };

  const currentData = filteredCases.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (loading) return <SkeletonLoader fullPage className='rounded-[38px]' />;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <Card className="p-6 space-y-4 max-w-6xl mx-auto shadow-[2px_4px_5px_0px_#E9EBFFB2] rounded-[38px] border">
      <CardTitle className="text-2xl font-normal mb-10 ml-6 text-[#003CBF]">Live Cases</CardTitle>

      {/* Table Section */}
      <div className=" border border-[#E8F1FD] rounded-lg">
        <Table className="w-full">
          <TableHeader className="bg-[#E8F1FD]">
            <TableRow>
              <TableHead className="w-1/7 text-left">S.No.</TableHead>
              <TableHead className="w-1/7 text-left">Case ID</TableHead>
              <TableHead className="w-1/7 text-left">Name</TableHead>
              <TableHead className="w-1/7 text-left">Mobile No.</TableHead>
              <TableHead className="w-1/7 text-left">Gender</TableHead>
              <TableHead className="w-1/7 text-left">Doctor Assigned</TableHead>
              <TableHead className="w-1/7 text-left">Status</TableHead>
              <TableHead className="w-1/7"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentData.map((hospitalCase, index) => (
              <TableRow key={hospitalCase.caseId} className="cursor-pointer hover:bg-gray-100">
                <TableCell className="w-1/7">{index + 1}</TableCell>
                <TableCell className="w-1/7">{hospitalCase.caseId}</TableCell>
                <TableCell className="w-1/7">{hospitalCase.name}</TableCell>
                <TableCell className="w-1/7">{hospitalCase.mobileNumber}</TableCell>
                <TableCell className="w-1/7">{hospitalCase.gender}</TableCell>
                <TableCell className="w-1/7">{hospitalCase.doctorAssigned}</TableCell>
                <TableCell className="w-1/7">{hospitalCase.status}</TableCell>
                <TableCell className="w-1/7">
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <EllipsisVertical />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="mr-20 -mt-1 border-none shadow-none">
                      <Button variant="default" className="bg-white border-2 border-[#013DC0] hover:bg-blu p-1 px-4 shadow-none text-black" onClick={() => handleViewDetails(hospitalCase.caseId)}>
                        View Details
                      </Button>
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

export default HospitalCases;
