import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTrigger } from '@/components/ui/dialog';
import React from 'react';

type PatientDetails = {
    patientId: string;
    patientName: string;
    patientGender: string;
    patientEmail: string;
    patientPhoneNumber: string;
    patientDateOfBirth: string;
    patientBloodGroup: string;
    patientAge: string;
    patientChiefComplaints: string;
    billAmount: string;
    billNumber: string;
    billDetails: string;
    createdAt: string;
    doctor: {
        doctorName: string;
        doctorMobileNumber: string;
    };
    paymentMode: string;
};

type ChiefComplaintsCardProps = {
    details: PatientDetails[];
};

const ChiefComplaintsCard: React.FC<ChiefComplaintsCardProps> = ({ details }) => {

    const firstComplaint = details[0]?.patientChiefComplaints;
    const otherComplaints = details.slice(1);

    return (
        <Card className="flex-1 p-6 shadow-[1px_4px_20px_0px_#0D162A33]">
            <h2 className="text-base font-bold mb-4">Chief Complaint</h2>
            <p className='text-sm text-[#979797] font-medium'> {firstComplaint}</p>

            {otherComplaints.length > 0 && (
                <Dialog >
                    <DialogTrigger asChild>
                        <Button variant="primary" className="w-52 font-normal mt-4">
                            View Other Complaints
                        </Button>
                    </DialogTrigger>

                    <DialogContent className="max-w-2xl bg-[#E9F4FF] rounded-xl">
                        <DialogHeader>
                            <DialogDescription>
                                {otherComplaints.map((detail, index) => (
                                    <div key={detail.patientId} className="mb-4">
                                        <p><strong>Complaint {index + 2}:</strong> {detail.patientChiefComplaints}</p>
                                    </div>
                                ))}
                            </DialogDescription>
                        </DialogHeader>
                    </DialogContent>
                </Dialog>
            )}
        </Card>
    );
};

export default ChiefComplaintsCard;
