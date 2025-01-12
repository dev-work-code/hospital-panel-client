import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import api from '@/utils/api';
import DoctorSelectionDialog from './DoctorSelectionDialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Droplet, Mail, Phone, User } from 'lucide-react';
import { Card, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { z } from 'zod';
import { Patientsschema } from '@/components/internal/types/schema';
import { toast } from '@/hooks/use-toast';

// Type inferred from the schema
type FormData = z.infer<typeof Patientsschema>;

const DoctorRegistrationForm: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(Patientsschema),
  });

  const [open, setOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<{ doctorId: string, doctorName: string } | null>(null);
  const [doctorList, setDoctorList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [displayCount, setDisplayCount] = useState(8);

  useEffect(() => {
    if (open) {
      setLoading(true);
      api.get('/hospital/getAllHospitalDoctors')
        .then((response) => {
          setDoctorList(response.data.data);
          setLoading(false);
        })
        .catch((_error) => {
          toast({
            title: "Error",
            description: "Failed to fetch doctors. Please try again later.",
            variant: "destructive",
          });
          setLoading(false);
        });
    }
  }, [open]);

  const onSubmit = async (data: FormData) => {
    if (!selectedDoctor) {
      toast({
        title: "Error",
        description: "Please select a doctor before submitting.",
        variant: "destructive",
      });
      return;
    }

    const payload = {
      ...data,
      doctorId: selectedDoctor.doctorId,
    };

    try {
      const response = await api.post('/hospital/patients/add', payload);
      toast({
        title: "Success",
        description: response.data.message,
        variant: "default",
        className: "bg-green-500 text-white",
      });
      // Optionally reset the form or take other actions
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || "An error occurred. Please try again.";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const handleDoctorSelect = (doctor: { doctorId: string, doctorName: string }) => {
    setSelectedDoctor(doctor);
    setOpen(false);
  };

  const handleLoadMore = () => {
    setDisplayCount((prevCount) => prevCount + 8);
  };

  const handleFormSubmit = () => {
    handleSubmit(onSubmit)();
  };

  return (
    <div>
      <Card className="max-w-5xl lg:h-[650px] mx-auto p-4 space-y-4 bg-white shadow-md rounded-[38px]">
        <CardHeader className="text-[#013DC0] text-2xl font-medium">Add Patient</CardHeader>
        <form className="px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Name */}
            <div className="relative">
              <Label className="block text-sm font-medium text-gray-700 mb-2">Name</Label>
              <div className="mt-1 flex items-center">
                <User className="absolute left-3 text-gray-400" />
                <Input
                  type="text"
                  {...register('name')}
                  className="bg-[#E9F4FF] pl-10 py-3"
                />
              </div>
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
            </div>

            {/* Gender */}
            <div>
              <Label className="block text-sm font-medium text-gray-700 mb-2">Gender</Label>
              <select
                {...register('gender')}
                className="mt-1 block w-full px-4 py-3 border border-gray-300 bg-[#E9F4FF] rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
              {errors.gender && <p className="text-red-500 text-xs mt-1">{errors.gender.message}</p>}
            </div>

            {/* Email */}
            <div className="relative">
              <Label className="block text-sm font-medium text-gray-700 mb-2">Email</Label>
              <div className="mt-1 flex items-center">
                <Mail className="absolute left-3 text-gray-400" />
                <Input
                  type="email"
                  {...register('email')}
                  className="bg-[#E9F4FF] pl-10 py-3"
                />
              </div>
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>

            {/* Phone Number */}
            <div className="relative">
              <Label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</Label>
              <div className="mt-1 flex items-center">
                <Phone className="absolute left-3 text-gray-400" />
                <Input
                  type="tel"
                  {...register('phoneNumber', { value: '+91' })}
                  className="bg-[#E9F4FF] pl-10 py-3"
                />
              </div>
              {errors.phoneNumber && <p className="text-red-500 text-xs mt-1">{errors.phoneNumber.message}</p>}
            </div>

            {/* Date of Birth */}
            <div>
              <Label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</Label>
              <input
                type="date"
                {...register('dateOfBirth')}
                className="mt-1 block w-full px-4 py-3 border border-gray-300 bg-[#E9F4FF] rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
              {errors.dateOfBirth && <p className="text-red-500 text-xs mt-1">{errors.dateOfBirth.message}</p>}
            </div>

            {/* Blood Group */}
            <div className="relative">
              <Label className="block text-sm font-medium text-gray-700 mb-2">Blood Group</Label>
              <div className="mt-1 flex items-center">
                <Droplet className="absolute left-3 text-gray-400" />
                <select
                  {...register('bloodGroup')}
                  className="mt-1 block w-full pl-10 pr-3 py-3 border border-gray-300 bg-[#E9F4FF] rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  <option value="">Select Blood Group</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                </select>
              </div>
              {errors.bloodGroup && <p className="text-red-500 text-xs mt-1">{errors.bloodGroup.message}</p>}
            </div>

            {/* Age */}
            <div>
              <Label className="block text-sm font-medium text-gray-700 mb-2">Age</Label>
              <Input
                type="text"
                {...register('age')}
                className="bg-[#E9F4FF] py-3"
              />
              {errors.age && <p className="text-red-500 text-xs mt-1">{errors.age.message}</p>}
            </div>
          </div>

          <div className="flex w-full flex-col lg:flex-row items-center justify-between mt-4">
            <div>
              <Label className="block text-sm font-medium text-gray-700 mb-2">Chief Complaints</Label>
              <Input
                {...register('chiefComplaints')}
                className="bg-[#E9F4FF] w-[230px] lg:w-[470px] py-3"
              />
              {errors.chiefComplaints && <p className="text-red-500 text-sm">{errors.chiefComplaints.message}</p>}
            </div>
            <DoctorSelectionDialog
              open={open}
              onOpenChange={setOpen}
              doctorList={doctorList}
              loading={loading}
              displayCount={displayCount}
              onDoctorSelect={handleDoctorSelect}
              handleLoadMore={handleLoadMore}
            />
          </div>
        </form>
      </Card>
      <CardFooter className="flex justify-end mt-4 lg:mr-14">
        <Button
          type="button"
          onClick={handleFormSubmit}
          variant="primary"
          className="w-96 h-12"
        >
          Submit
        </Button>
      </CardFooter>
    </div>
  );
};

export default DoctorRegistrationForm;
