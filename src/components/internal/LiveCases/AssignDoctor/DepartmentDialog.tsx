import React, { useState, useEffect } from 'react';
import { AlertDialog, AlertDialogContent } from '@/components/ui/alert-dialog';
import api from '@/utils/api';
import DepartmentSearch from './DepartmentSearch';
import SelectedDepartments from './SelectedDepartments';
import DoctorList from './DoctorList'; // Changed HospitalList to DoctorList
import AssignDoctorButton from './AssignDoctorButton'; // Changed AssignHospitalButton to AssignDoctorButton
import { toast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export const departments = [
    'Internal Medicine',
    'Pediatrics',
    'Dermatology',
    'Cardiology',
    'Neurology',
    'Orthopaedics',
    'Neurosurgery',
    'General Surgery',
    'Gastroenterology',
    'Ophthalmology',
    'ENT',
    'Gynaecology',
    'Surgical Gastroenterology',
    'Pulmonology',
];

interface DepartmentDialogProps {
    isOpen: boolean;
    onClose: () => void;
    caseId: string | null;
}

const DepartmentDialog: React.FC<DepartmentDialogProps> = ({ isOpen, onClose, caseId }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);
    const [doctors, setDoctors] = useState<any[]>([]); // Renamed hospitals to doctors
    const [loading, setLoading] = useState(false);
    const [showDoctors, setShowDoctors] = useState(false); // Renamed showHospitals to showDoctors
    const [selectedDoctor, setSelectedDoctor] = useState<any | null>(null); // Renamed selectedHospital to selectedDoctor

    const filteredDepartments = departments.filter(department =>
        department.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Fetch doctors based on the selected departments
    const fetchDoctors = async () => {
        if (selectedDepartments.length === 0) return; // If no departments are selected, don't fetch doctors
        setLoading(true);
        try {
            const response = await api.get('/hospital/getAvailableDoctors', {
                params: {
                    specialization: selectedDepartments.join(','),
                },
            });
            setDoctors(response.data.data.doctors || []); // Renamed hospitals to doctors
        } catch (error) {
            console.error('Error fetching doctors:', error);
        } finally {
            setLoading(false);
        }
    };

    // Trigger the API call when selectedDepartments change
    useEffect(() => {
        if (selectedDepartments.length > 0) {
            fetchDoctors(); // Call the API when the departments change
        } else {
            setDoctors([]); // Clear doctors if no departments are selected
        }
    }, [selectedDepartments]);

    // Assign selected doctor to the case
    const handleAssignDoctor = async () => {
        if (!selectedDoctor?.doctorId || !caseId) {
            toast({
                description: 'Please select a doctor and ensure the case ID is valid.',
                variant: 'destructive',
                className: 'bg-red-500 text-white',
            });
            return;
        }

        console.log('Sending Doctor ID:', selectedDoctor.doctorId, 'Case ID:', caseId); // Debugging

        setLoading(true);
        try {
            const response = await api.post(`/hospital/assignDoctorToCase?doctorId=${selectedDoctor.doctorId}&caseId=${caseId}`);

            toast({
                description: response.data.message || 'Doctor assigned successfully!',
                variant: 'default',
                className: 'bg-green-500 text-white',
            });

        } catch (error: any) {
            const errorMessage = error.response?.data?.error || 'Something went wrong!';
            toast({
                description: errorMessage,
                variant: 'destructive',
                className: 'bg-red-500 text-white',
            });
            console.error('Error assigning doctor:', error.response || error.message);
        } finally {
            setLoading(false);

            onClose();
        }
    };


    const handleDepartmentSelect = (department: string) => {
        setSelectedDepartments((prev) => {
            if (prev.includes(department)) {
                return prev.filter((dep) => dep !== department); // Remove if already selected
            }
            return [...prev, department]; // Add if not selected
        });
    };

    const handleRemoveDepartment = (department: string) => {
        setSelectedDepartments((prev) => prev.filter((dep) => dep !== department)); // Remove selected department
    };

    const handleSelectDoctor = (doctor: any) => {
        setSelectedDoctor(doctor); // Set the selected doctor
    };

    return (
        <AlertDialog open={isOpen} onOpenChange={onClose}>
            <AlertDialogContent className='rounded-xl max-w-2xl'>
                {!showDoctors ? (
                    <>
                        <DepartmentSearch searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
                        <SelectedDepartments
                            selectedDepartments={selectedDepartments}
                            handleRemoveDepartment={handleRemoveDepartment}
                        />
                        <span className="font-semibold text-[#013DC0] text-base ml-2">Departments </span>
                        <div className="flex flex-wrap gap-1">
                            {filteredDepartments.length > 0 ? (
                                filteredDepartments.map((department, index) => (
                                    <div
                                        key={index}
                                        className={`cursor-pointer ${selectedDepartments.includes(department) ? 'bg-blue-10' : ''
                                            }`}
                                        onClick={() => handleDepartmentSelect(department)}
                                    >
                                        <Badge className="mb-2" variant="primary">
                                            {department} <span className='ml-1'>+</span>
                                        </Badge>
                                    </div>
                                ))
                            ) : (
                                <p>No departments found.</p>
                            )}
                        </div>

                        <div className="mt-4 flex justify-end">
                            <Button
                                variant="primary"
                                onClick={() => setShowDoctors(true)} // Switch to doctor view
                                disabled={selectedDepartments.length === 0}
                                className="bg-[#013DBF] text-white w-40 py-5"
                            >
                                View Doctors
                            </Button>
                        </div>
                    </>
                ) : (
                    <>
                        <DepartmentSearch searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
                        <SelectedDepartments
                            selectedDepartments={selectedDepartments}
                            handleRemoveDepartment={handleRemoveDepartment}
                        />
                        <DoctorList
                            doctors={doctors} // Renamed hospitals to doctors
                            selectedDoctor={selectedDoctor} // Renamed selectedHospital to selectedDoctor
                            handleSelectDoctor={handleSelectDoctor} // Renamed handleSelectHospital to handleSelectDoctor
                            searchQuery={searchQuery}
                            loading={loading}
                        />

                        <div className="mt-4 flex justify-between">
                            <Button variant="primary" onClick={() => setShowDoctors(false)} className='px-4 w-40'>
                                Back
                            </Button>
                            <AssignDoctorButton
                                handleAssignDoctor={handleAssignDoctor} // Renamed handleAssignHospital to handleAssignDoctor
                                selectedDoctor={selectedDoctor} // Renamed selectedHospital to selectedDoctor
                            />
                        </div>
                    </>
                )}
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default DepartmentDialog;
