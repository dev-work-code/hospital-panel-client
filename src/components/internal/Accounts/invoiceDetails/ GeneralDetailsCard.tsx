import { Card } from '@/components/ui/card';
import React from 'react';

type PatientGeneralDetails = {
    patientId: string;
    patientName: string;
    patientPhoneNumber: string;
    patientBloodGroup: string;
    patientAge: string;
    patientGender: string;
    patientDateOfBirth: string;
};

type GeneralDetailsCardProps = {
    details: PatientGeneralDetails;
};

const GeneralDetailsCard: React.FC<GeneralDetailsCardProps> = ({ details }) => {
    return (
        <Card className="flex-1 p-6 shadow-[1px_4px_20px_0px_#0D162A33]">
            <h2 className="text-xl font-bold mb-4">General Details</h2>
            <p><strong>Patient Name:</strong> {details.patientName}</p>
            <p><strong>Phone Number:</strong> {details.patientPhoneNumber}</p>
            <p><strong>Blood Group:</strong> {details.patientBloodGroup}</p>
            <p><strong>Age:</strong> {details.patientAge}</p>
            <p><strong>Gender:</strong> {details.patientGender}</p>
            <p><strong>Date of Birth:</strong> {new Date(details.patientDateOfBirth).toLocaleDateString()}</p>
        </Card>
    );
};

export default GeneralDetailsCard;
