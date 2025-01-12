import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "@/utils/api";
import { Card } from "@/components/ui/card"; // Assuming you have a Card component
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label"; // Import Label from your custom UI components
import { Separator } from "@/components/ui/separator";
import { CalendarDays, Clock } from "lucide-react";

interface Hospital {
    hospitalId: string;
    hospitalName: string;
    hospitalLocation: string;
    hospitalPhoneNumber: string;
}

interface Doctor {
    doctorId: string;
    doctorName: string;
    doctorMobileNumber: string;
    doctorEmail: string | null;
    doctorQualification: string;
    areaOfSpecialization: string;
    hospital: Hospital;
}

interface Appointment {
    patientId: string;
    patientName: string;
    patientGender: string;
    patientEmail: string;
    patientPhoneNumber: string;
    patientDateOfBirth: string;
    patientBloodGroup: string;
    patientAge: string;
    patientAppointmentType: string;
    patientChiefComplaints: string;
    createdAt: string;
    updatedAt: string;
    doctor: Doctor;
    hospital: Hospital | null;
    patientAppointmentTime: string;
}

interface PatientData {
    currentAppointment: Appointment;
    appointmentHistory: Appointment[];
    totalVisits: number;
}

const PatientProfile: React.FC = () => {
    const { patientId } = useParams<{ patientId: string }>();
    const [patientData, setPatientData] = useState<PatientData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPatient = async () => {
            try {
                const response = await api.get(`/hospital/patients/getPatientById`, {
                    params: { patientId },
                });
                if (response.data.data) {
                    setPatientData(response.data.data);
                } else {
                    setError("No patient data found.");
                }
            } catch (err) {
                setError("Failed to fetch patient data. Please try again later.");
                console.error("Error fetching patient:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchPatient();
    }, [patientId]);

    const getValue = (value: any) => (value ? value : "N/A");

    if (loading) return <div>Loading...</div>;
    if (error) return <div className="text-red-500">{error}</div>;
    if (!patientData) return <div>No patient data available.</div>;

    const { currentAppointment, appointmentHistory } = patientData;

    return (
        <div className="p-6">
            {/* First row with Personal Info and Chief Complaints cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 ">
                {/* Personal Info Card */}
                <Card className="bg-white shadow-lg p-6">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                        {/* Row 1: Name, Gender, Age */}
                        <div className="flex flex-col">
                            <p><Label>Name:</Label></p>
                            <p className="text-[#013DC0]">{getValue(currentAppointment.patientName)}</p>
                        </div>
                        <div className="flex flex-col">
                            <p><Label>Gender:</Label></p>
                            <p className="text-[#013DC0]">{getValue(currentAppointment.patientGender)}</p>
                        </div>
                        <div className="flex flex-col">
                            <p><Label>Age:</Label></p>
                            <p className="text-[#013DC0]">{getValue(currentAppointment.patientAge)}</p>
                        </div>

                        {/* Row 2: Weight, Height, Blood Type */}
                        <div className="flex flex-col">
                            <p><Label>Weight:</Label></p>
                            <p className="text-[#013DC0]">{getValue("N/A")}</p>
                        </div>
                        <div className="flex flex-col">
                            <p><Label>Blood Type:</Label></p>
                            <p className="text-[#013DC0]">{getValue(currentAppointment.patientBloodGroup)}</p>
                        </div>

                        {/* Row 3: Contact No */}
                        <div className="flex flex-col">
                            <p><Label>Contact No:</Label></p>
                            <p className="text-[#013DC0]">{getValue(currentAppointment.patientPhoneNumber)}</p>
                        </div>
                    </div>
                </Card>

                {/* Chief Complaints Card */}
                <Card className="bg-white shadow-md p-6">
                    <h2 className="text-base font-semibold">Chief Complaints</h2>
                    <span className="text-sm text-[#979797]">{getValue(currentAppointment.patientChiefComplaints)}</span>
                </Card>
            </div>

            {/* Appointments Card */}
            <Card className="bg-white shadow-md">
                <div className="bg-[#E9F4FF] p-4 mb-4 rounded-t-lg">
                    <h2 className="text-xl font-semibold text-[#013DC0]">Previous Records</h2>
                </div>
                <div className="p-1">
                    {appointmentHistory.length > 0 ? (
                        appointmentHistory.map((appointment) => (
                            <div key={appointment.patientId}>
                                <div className="flex items-center justify-between p-6">
                                    <div className="mb-4 flex items-center gap-20 justify-center">
                                        {/* Appointment Date */}
                                        <div className="flex flex-row gap-2 items-center justify-center">
                                            <CalendarDays className="text-[#013DC0]" size={16} />
                                            <p className="text-sm font-normal">
                                                {new Intl.DateTimeFormat("en-US", {
                                                    weekday: "long",
                                                    month: "short",
                                                    day: "2-digit",
                                                    year: "numeric",
                                                }).format(new Date(appointment.createdAt))}
                                            </p>
                                        </div>

                                        {/* Appointment Time */}
                                        <div className="flex flex-row gap-2 items-center justify-center">
                                            <Clock className="text-[#013DC0]" size={16} />
                                            <p className="text-sm font-normal">
                                                {getValue(currentAppointment.patientAppointmentTime)}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Details Button and Dialog */}
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Button className="bg-[#013DC0] py-4 w-72" variant="primary">
                                                Details
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent className="sm:max-w-[425px] bg-[#E9F4FF] rounded-xl">
                                            <DialogHeader>
                                                <DialogDescription className="flex items-center justify-center">
                                                    Download Prescription and Bill
                                                </DialogDescription>
                                            </DialogHeader>
                                            <div className="grid gap-4 py-4">
                                                <Button className="bg-[#013DC0] py-6 w-full" variant="primary">
                                                    Prescription
                                                </Button>
                                                <Button className="bg-[#013DC0] py-6 w-full" variant="primary">
                                                    Bill
                                                </Button>
                                            </div>
                                        </DialogContent>
                                    </Dialog>
                                </div>

                                {/* Separator */}
                                <Separator className="w-full bg-[#E9F4FF]" />
                            </div>
                        ))
                    ) : (
                        <p>No appointment history available.</p>
                    )}
                </div>

            </Card>

        </div>
    );
};

export default PatientProfile;
