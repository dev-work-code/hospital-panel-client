import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import DepartmentDialog from '../AssignDoctor/DepartmentDialog';
import { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from '@/components/ui/dropdown-menu';
import { Star } from 'lucide-react';

interface DoctorInfo {
  doctorPhoto: string;
  doctorName: string;
  areaOfSpecialization: string;
  experience: string;
  doctorRating: string;
}

interface ChiefComplaintsProps {
  caseHistoryChiefComplaints: string;
  selectedCaseId: string | null; // Make sure to pass selectedCaseId as prop
  caseStatus: string;
  doctor: DoctorInfo | null; // Allow for a null value in case no doctor is assigned
}

const ChiefComplaintsCard = ({
  caseHistoryChiefComplaints,
  selectedCaseId,
  caseStatus,
  doctor,
}: ChiefComplaintsProps) => {
  const [isDepartmentDialogOpen, setIsDepartmentDialogOpen] = useState(false);

  const handleAssignDoctorClick = () => {
    setIsDepartmentDialogOpen(true); // Open the dialog when button is clicked
  };

  return (
    <Card className="p-6 border border-gray-200 shadow-md lg:col-span-2">
      <h2 className="text-lg font-semibold mb-2">Chief Complaints</h2>
      <p className="text-xs text-[#979797] leading-6">
        {caseHistoryChiefComplaints || 'No complaints specified'}
      </p>
      <div className="flex justify-end mt-2">
        {caseStatus === 'DOCTOR_ASSIGNED' && doctor ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="primary" className="w-80">
                View Doctor
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="max-w-xl p-4 border border-gray-200 shadow-lg rounded-xl mr-[120px]">
              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <img
                    src={doctor.doctorPhoto}
                    alt={`${doctor.doctorName}'s photo`}
                    className="w-24 h-24 rounded-full"
                  />
                  <p
                    className="-mt-1 text-sm text-gray-600 flex items-center justify-center gap-1 bg-[#DEF1FF] p-1 px-2 rounded-md"
                    aria-label={`Doctor rating: ${doctor.doctorRating} stars`}
                  >
                    <Star
                      size={16}
                      className="text-[#013DC0]"
                      fill="#013DC0" // Set the inside color
                      stroke="#013DC0" // Ensure the border matches
                    />
                    <span className="text-[#013DC0] text-xs">{doctor.doctorRating}</span>
                  </p>
                </div>
                <div className='mt-2'>
                  <p className="font-medium text-lg">{doctor.doctorName}</p>
                  <p className="text-base font-normal"> Specialist in <p className=''>{doctor.areaOfSpecialization}</p> </p>
                  <p className="text-sm text-[#838993] font-normal mt-4">{doctor.experience} experience overall</p>
                </div>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button
            variant="primary"
            className="w-80"
            onClick={handleAssignDoctorClick}>
            Assign Doctor
          </Button>
        )}
      </div>

      <DepartmentDialog
        isOpen={isDepartmentDialogOpen}
        onClose={() => setIsDepartmentDialogOpen(false)}
        caseId={selectedCaseId}
      />
    </Card>
  );
};

export default ChiefComplaintsCard;
