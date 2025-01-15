import { FC, useState } from 'react';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface DoctorSelectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  doctorList: any[];
  loading: boolean;
  displayCount: number;
  onDoctorSelect: (doctor: { doctorId: string, doctorName: string }) => void;
  handleLoadMore: () => void;
}

const DoctorSelectionDialog: FC<DoctorSelectionDialogProps> = ({
  open,
  onOpenChange,
  doctorList,
  loading,
  displayCount,
  onDoctorSelect,
  handleLoadMore,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  // Filter doctor list based on search query
  const filteredDoctors = doctorList.filter((doctor) =>
    searchQuery === '' || doctor.doctorSpecialization?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogTrigger asChild>
        <Button
          type="button"
          variant="primary"
          className="w-full lg:w-96 h-[50px] mt-4"
        >
          Assign Doctor
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent className="max-w-4xl w-full max-h-[600px] overflow-y-auto p-10">
        {/* Search Field */}
        <div className="relative w-full shadow-[5px_5px_20px_0px_#61ABEB33] rounded-full">
          <Input
            type="text"
            placeholder="Search by specialization"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full border px-4 py-7 rounded-full pr-12 bg-white h-12"
          />
          <div className="absolute right-0 top-1/2 -translate-y-1/2 bg-[#003CBF] p-4 rounded-full">
            <Search className="text-white" />
          </div>
        </div>

        {/* Scrollable doctor list */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {loading ? (
            <p className="text-center text-gray-500 col-span-full">Loading doctors...</p>
          ) : filteredDoctors.length > 0 ? (
            filteredDoctors.slice(0, displayCount).map((doctor) => (
              <Card
                key={doctor.doctorId}
                className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col items-center justify-center w-44 h-48 border-[#6298FF33]"
              >
                <img
                  src={doctor.doctorPhoto || 'https://via.placeholder.com/150'}
                  alt={doctor.doctorName}
                  className="w-20 h-20 object-cover border rounded-full"
                />
                  <p className="text-sm font-semibold text-gray-800">{doctor.doctorName}</p>
                  <p className="text-sm text-gray-600">
                    {doctor.doctorSpecialization
                      ? doctor.doctorSpecialization.split(', ')[0]
                      : ' not available'}
                  </p>

                  <Button
                    type="button"
                    className='w-36 mt-1 bg-transparent border border-[#013DC0] text-[#013DC0] rounded-md hover:bg-gray-100'
                    onClick={() => onDoctorSelect(doctor)}
                  >
                    Select
                  </Button>
              </Card>
            ))
          ) : (
            <p className="text-center text-gray-500 col-span-full">No doctors found.</p>
          )}
        </div>
        {/* Load More Button */}
        {filteredDoctors.length > displayCount && (
          <div className="text-center mt-4">
            <Button
              type="button"
              variant="primary"
              onClick={handleLoadMore}
              className='p-6 lg:w-96'
            >
              Load More
            </Button>
          </div>
        )}

        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => onOpenChange(false)}>Cancel</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DoctorSelectionDialog;
