import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '@/utils/api'; // Your API utility
import ChiefComplaintsCard from './ChiefComplaintsCard';
import GeneralDetailsCard from './ GeneralDetailsCard';
import InvoiceTable from './ InvoiceTable';
import { Card } from '@/components/ui/card';
import SkeletonLoader from '@/pages/common/SkeletionLoader';

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

type PatientGeneralDetails = {
    patientId: string;
    patientName: string;
    patientPhoneNumber: string;
    patientBloodGroup: string;
    patientAge: string;
    patientGender: string;
    patientDateOfBirth: string;
};

type InvoiceData = {
    patientGeneralDetails: PatientGeneralDetails;
    patientDetails: PatientDetails[];
};

const InvoiceDetails: React.FC = () => {
    const { invoiceId } = useParams(); // Extract the invoiceId from the URL
    const [data, setData] = useState<InvoiceData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchInvoiceDetails = async () => {
            try {
                const response = await api.get(
                    `/hospital/patients/getInvoiceById?invoiceId=${invoiceId}`
                );
                if (response.data.success) {
                    setData(response.data.data);
                } else {
                    setError("Failed to fetch invoice details.");
                }
            } catch (err) {
                setError("An error occurred while fetching the invoice details.");
            } finally {
                setLoading(false);
            }
        };

        if (invoiceId) {
            fetchInvoiceDetails();
        }
    }, [invoiceId]);

    if (loading) {
        return <SkeletonLoader fullPage className='p-6 rounded-[38px] mt-10' />;
    }

    if (error) {
        return <div className="text-center text-red-500 mt-10">{error}</div>;
    }

    return (
        <Card className="container mt-10 p-6 rounded-[38px] border-[#D2E2F3] shadow-[2px_4px_5px_0px_#E9EBFFB2]">
            {data ? (
                <>
                    {/* Flex Row for General Details and Chief Complaints */}
                    <div className="flex flex-col lg:flex-row gap-6 mb-6">
                        <div className='w-96'>
                            <GeneralDetailsCard details={data.patientGeneralDetails} />
                        </div>
                        <ChiefComplaintsCard details={data.patientDetails} />
                    </div>

                    {/* Invoice Details Table */}
                    <InvoiceTable details={data.patientDetails} />
                </>
            ) : (
                <div className="text-center mt-10">Invoice not found.</div>
            )}
        </Card>
    );
};

export default InvoiceDetails;
