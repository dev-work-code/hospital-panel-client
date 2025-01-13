import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '@/utils/api'; // Your API utility

type Invoice = {
    patientId: string;
    patientName: string;
    patientGender: string;
    billAmount: string;
    billDetails: string;
    billNumber: string;
    createdAt: string;
    doctor: {
        doctorName: string;
        doctorMobileNumber: string;
    };
    paymentMode: string;
};

const InvoiceDetails: React.FC = () => {
    const { invoiceId } = useParams(); // Extract the invoiceId from the URL
    const [invoice, setInvoice] = useState<Invoice | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchInvoiceDetails = async () => {
            try {
                const response = await api.get(
                    `/hospital/patients/getInvoiceById?invoiceId=${invoiceId}`
                );
                if (response.data.success) {
                    setInvoice(response.data.data);
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
        return <div className="text-center mt-10">Loading...</div>;
    }

    if (error) {
        return <div className="text-center text-red-500 mt-10">{error}</div>;
    }

    return (
        <div className="container mx-auto px-4 mt-10">
            {invoice ? (
                <>
                    <h1 className="text-2xl font-bold mb-6 text-center">Invoice Details</h1>
                    <div className="p-4 border rounded shadow">
                        <p><strong>Patient Name:</strong> {invoice.patientName}</p>
                        <p><strong>Gender:</strong> {invoice.patientGender}</p>
                        <p><strong>Bill Amount:</strong> ₹{invoice.billAmount}</p>
                        <p><strong>Bill Number:</strong> {invoice.billNumber}</p>
                        <p><strong>Doctor:</strong> {invoice.doctor.doctorName}</p>
                        <p><strong>Doctor's Mobile:</strong> {invoice.doctor.doctorMobileNumber}</p>
                        <p><strong>Payment Mode:</strong> {invoice.paymentMode}</p>
                        <p><strong>Created At:</strong> {new Date(invoice.createdAt).toLocaleDateString()}</p>
                        <p><strong>Bill Details:</strong> 
                            <a
                                href={invoice.billDetails}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-500 hover:underline"
                            >
                                View Bill
                            </a>
                        </p>
                    </div>
                </>
            ) : (
                <div className="text-center mt-10">Invoice not found.</div>
            )}
        </div>
    );
};

export default InvoiceDetails;
