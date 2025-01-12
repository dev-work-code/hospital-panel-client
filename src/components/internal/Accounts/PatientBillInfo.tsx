// PatientInfo.tsx
import React from "react";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

interface PatientInfoProps {
    patientDetails: {
        name: string;
        phoneNumber: string;
        email: string;
        gender: string;
        bloodGroup: string;
        age: string;
        dateOfBirth: string;
    };
}

const PatientInfo: React.FC<PatientInfoProps> = ({ patientDetails }) => {
    return (
        <div className="px-4">
            <Separator className="my-6 bg-black" />
            <div className="mb-4 grid grid-cols-2 gap-4 ">
                <span className="flex flex-row items-center gap-2">
                    <Label className="text-sm font-bold">Name:</Label>
                    <p className="text-xs">{patientDetails.name}</p>
                </span>
                <span className="flex flex-row items-center gap-2">
                    <Label className="text-sm font-bold">Mobile no:</Label>
                    <p className="text-xs">{patientDetails.phoneNumber}</p>
                </span>
                <span className="flex flex-row items-center gap-2">
                    <Label className="text-sm font-bold">Email:</Label>
                    <p className="text-xs">{patientDetails.email}</p>
                </span>
                <span className="flex flex-row items-center gap-2">
                    <Label className="text-sm font-bold">Gender:</Label>
                    <p className="text-xs">{patientDetails.gender}</p>
                </span>
                <span className="flex flex-row items-center gap-2">
                    <Label className="text-sm font-bold">Blood Group:</Label>
                    <p className="text-xs">{patientDetails.bloodGroup}</p>
                </span>
                <span className="flex flex-row items-center gap-2">
                    <Label className="text-sm font-bold">Age:</Label>
                    <p className="text-xs">{patientDetails.age}</p>
                </span>
                <span className="flex flex-row items-center gap-2">
                    <Label className="text-sm font-bold">Date of Birth:</Label>
                    <p className="text-xs">{patientDetails.dateOfBirth}</p>
                </span>
            </div>
            <Separator className="my-6 bg-black" />
        </div>
    );
};

export default PatientInfo;
