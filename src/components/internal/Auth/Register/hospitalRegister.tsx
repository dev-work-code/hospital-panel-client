import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { hospitalSchema } from '../../types/schema';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

type HospitalFormData = z.infer<typeof hospitalSchema>;

const HospitalRegistrationForm: React.FC = () => {
    const [loading, setLoading] = useState(false); // State to track loading status
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<HospitalFormData>({
        resolver: zodResolver(hospitalSchema),
    });

    const onSubmit = async (data: HospitalFormData) => {
        setLoading(true); // Set loading to true when submitting
        const formData = new FormData();

        // Ensure the phone number has the +91 prefix
        if (data.hospitalPhoneNumber) {
            // Check if the phone number starts with +91, if not, add it
            const formattedPhoneNumber = data.hospitalPhoneNumber.startsWith('+91')
                ? data.hospitalPhoneNumber
                : `+91${data.hospitalPhoneNumber}`;

            // Update the phone number in the data
            data.hospitalPhoneNumber = formattedPhoneNumber;
        }

        Object.entries(data).forEach(([key, value]) => {
            if (key === 'images' && value instanceof FileList) {
                Array.from(value).forEach((file) => formData.append('images', file));
            } else {
                formData.append(key, value as string);
            }
        });

        try {
            const response = await axios.post(
                'https://livapp.elitceler.com/api/v1/hospital/register',
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );

            toast({
                title: 'Success',
                description: response.data.message || 'Operation successful!',
                variant: 'default',
                className: "bg-green-500 text-white",
            });

            console.log('Success:', response.data);
        } catch (error: any) {
            const errorMessage = error.response?.data?.error || 'Something went wrong!';
            toast({
                title: 'Error',
                description: errorMessage,
                variant: 'destructive',
            });

            console.error('Error:', error);
        } finally {
            setLoading(false); // Reset loading state after submission
        }
    };

    return (
        <form
            className='lg:w-[900px]'
            onSubmit={handleSubmit(onSubmit)}
        >
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Hospital Name</label>
                    <input
                        {...register('hospitalName')}
                        type="text"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    />
                    {errors.hospitalName && (
                        <p className="text-red-500 text-sm">{errors.hospitalName.message}</p>
                    )}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Hospital Location</label>
                    <input
                        {...register('hospitalLocation')}
                        type="text"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    />
                    {errors.hospitalLocation && (
                        <p className="text-red-500 text-sm">{errors.hospitalLocation.message}</p>
                    )}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                    <div className="relative">
                        <input
                            {...register('hospitalPhoneNumber')}
                            type="tel"
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 pl-12"
                            placeholder="Enter phone number"
                        />
                        <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500">+91</span>
                    </div>
                    {errors.hospitalPhoneNumber && (
                        <p className="text-red-500 text-sm">{errors.hospitalPhoneNumber.message}</p>
                    )}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Date of Registration</label>
                    <input
                        {...register('hospitalDateOfRegistration')}
                        type="date"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    />
                    {errors.hospitalDateOfRegistration && (
                        <p className="text-red-500 text-sm">{errors.hospitalDateOfRegistration.message}</p>
                    )}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">DMHO Registration</label>
                    <input
                        {...register('hospitalDMHORegistration')}
                        type="text"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    />
                    {errors.hospitalDMHORegistration && (
                        <p className="text-red-500 text-sm">{errors.hospitalDMHORegistration.message}</p>
                    )}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Company Details</label>
                    <textarea
                        {...register('hospitalCompanyDetails')}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    ></textarea>
                    {errors.hospitalCompanyDetails && (
                        <p className="text-red-500 text-sm">{errors.hospitalCompanyDetails.message}</p>
                    )}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Company PAN</label>
                    <input
                        {...register('hospitalCompanyPAN')}
                        type="text"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    />
                    {errors.hospitalCompanyPAN && (
                        <p className="text-red-500 text-sm">{errors.hospitalCompanyPAN.message}</p>
                    )}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Owner Details</label>
                    <textarea
                        {...register('hospitalOwnerDetails')}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    ></textarea>
                    {errors.hospitalOwnerDetails && (
                        <p className="text-red-500 text-sm">{errors.hospitalOwnerDetails.message}</p>
                    )}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Services Offered</label>
                    <textarea
                        {...register('hospitalServicesOffered')}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    ></textarea>
                    {errors.hospitalServicesOffered && (
                        <p className="text-red-500 text-sm">{errors.hospitalServicesOffered.message}</p>
                    )}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Specialist Services</label>
                    <textarea
                        {...register('hospitalSpecialistServices')}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    ></textarea>
                    {errors.hospitalSpecialistServices && (
                        <p className="text-red-500 text-sm">{errors.hospitalSpecialistServices.message}</p>
                    )}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Number of Beds</label>
                    <input
                        {...register('hospitalNumberOfBeds')}
                        type="number"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    />
                    {errors.hospitalNumberOfBeds && (
                        <p className="text-red-500 text-sm">{errors.hospitalNumberOfBeds.message}</p>
                    )}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Areas of Interest</label>
                    <textarea
                        {...register('hospitalAreasOfInterest')}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    ></textarea>
                    {errors.hospitalAreasOfInterest && (
                        <p className="text-red-500 text-sm">{errors.hospitalAreasOfInterest.message}</p>
                    )}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Address</label>
                    <textarea
                        {...register('address')}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    ></textarea>
                    {errors.address && (
                        <p className="text-red-500 text-sm">{errors.address.message}</p>
                    )}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Upload Images</label>
                    <input
                        {...register('images')}
                        type="file"
                        multiple
                        className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                    {errors.images && (
                        <p className="text-red-500 text-sm">{errors.images.message}</p>
                    )}
                </div>
            </div>
            <div className="mt-4 mb-8">
                <Button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-6 px-4 rounded-md hover:bg-blue-700"
                    disabled={loading} // Disable button when loading
                >
                    {loading ? (
                        <Loader2 className="h-5 w-5 animate-spin text-white" />
                    ) : (
                        'Submit'
                    )}
                </Button>
            </div>
        </form>
    );
};

export default HospitalRegistrationForm;
