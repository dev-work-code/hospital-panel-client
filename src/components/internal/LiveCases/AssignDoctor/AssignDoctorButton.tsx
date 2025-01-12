import React from 'react';
import { Button } from '@/components/ui/button';

interface AssignHospitalButtonProps {
    handleAssignDoctor: () => void;
    selectedDoctor: any;
}

const AssignHospitalButton: React.FC<AssignHospitalButtonProps> = ({ handleAssignDoctor, selectedDoctor }) => {
    return (
        <Button
            variant="primary"
            onClick={handleAssignDoctor}
            disabled={!selectedDoctor}
            className="bg-[#013DBF] text-white font-normal w-40"
        >
            Assign Doctor
        </Button>
    );
};

export default AssignHospitalButton;
