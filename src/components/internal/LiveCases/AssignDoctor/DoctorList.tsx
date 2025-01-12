import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import React from 'react';

interface Doctor {
    doctorPhoto: string;
    doctorId: string;
    doctorName: string;
    doctorMobileNumber: string;
    doctorEmail: string | null;
    doctorGender: string;
    doctorRating: number;
    doctorCharges: number;
    doctorQualification: string;
    experience: string;
    specializations: string[];
    hospital: {
        hospitalName: string;
        hospitalLocation: string;
    };
}

interface DoctorListProps {
    doctors: Doctor[];
    selectedDoctor: Doctor | null;
    handleSelectDoctor: (doctor: Doctor | null) => void; // Update to allow null
    searchQuery: string;
    loading: boolean;
}

const DoctorList: React.FC<DoctorListProps> = ({
    doctors,
    selectedDoctor,
    handleSelectDoctor,
    searchQuery,
    loading,
}) => {
    return (
        <div className="mt-2">
            {loading ? (
                <p>Loading...</p>
            ) : doctors.length > 0 ? (
                <div className="grid grid-cols-3 gap-4">
                    {doctors
                        .filter((doctor) =>
                            doctor.doctorName.toLowerCase().includes(searchQuery.toLowerCase())
                        )
                        .map((doctor) => (
                            <Card
                                key={doctor.doctorId}
                                onClick={() =>
                                    handleSelectDoctor(
                                        selectedDoctor?.doctorId === doctor.doctorId
                                            ? null // Deselect if the same doctor is clicked
                                            : doctor
                                    )
                                }
                                className={`cursor-pointer p-2 shadow-xl rounded-lg h-48 w-44 ${selectedDoctor?.doctorId === doctor.doctorId
                                    ? 'border border-[#003CBF]'
                                    : 'border'
                                    }`}
                            >
                                <div className="flex items-center flex-col justify-center gap-2">
                                    <img
                                        src={doctor.doctorPhoto}
                                        alt={`${doctor.doctorName} photo`}
                                        className="w-16 h-16 object-cover rounded-full mr-4"
                                    />
                                    <div className="flex flex-col flex-grow">
                                        <p className="font-medium text-sm">{doctor.doctorName}</p>
                                        <p className="text-sm">
                                            Experience: {doctor.experience}
                                        </p>
                                    </div>
                                    <div>
                                        <Button
                                            variant="primary"
                                            className="bg-white text-[#013DC0]  border border-[#013DC0] py-2 px-6 w-40 mt-4"
                                        >
                                            {selectedDoctor?.doctorId === doctor.doctorId
                                                ? 'Deselect'
                                                : 'Select'}
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        ))}
                </div>
            ) : (
                <p>No doctors available for the selected departments.</p>
            )}
        </div>
    );
};

export default DoctorList;
