import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import api from '@/utils/api'; // Import your api utility
import { z } from 'zod';
import { toast } from '@/hooks/use-toast';
import { Card, CardHeader } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

// Zod validation schema
const schema = z.object({
    roleEmail: z.string().email('Invalid email address'),
    rolePhoneNumber: z.string().min(10, 'Phone number must be at least 10 digits').max(15, 'Phone number must be at most 15 digits'),
    roleGender: z.enum(['Male', 'Female', 'Other']).refine(val => val !== undefined, {
        message: 'Gender is required',
    }),
    roleDob: z.string().refine(val => !isNaN(Date.parse(val)), 'Invalid date of birth'),
    rolePanCard: z.string().min(10, 'PAN card must be exactly 10 characters').max(10, 'PAN card must be exactly 10 characters'),
    roleAadharCard: z.string().min(12, 'Aadhar card must be exactly 12 digits').max(12, 'Aadhar card must be exactly 12 digits'),
    roleName: z.enum(['NURSING', 'ACCOUNTANT', 'CLEANER']).refine(val => val !== undefined, {
        message: 'Role name is required',
    }),
});

type FormData = z.infer<typeof schema>;

const AddRoleForm = () => {
    const [loading, setLoading] = useState(false);
    const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>({
        resolver: zodResolver(schema),
    });

    const onSubmit = async (data: FormData) => {
        setLoading(true); // Set loading to true when submitting

        try {
            const response = await api.post('/hospital/addRole', data);

            if (response.status === 200) {
                toast({
                    description: response.data.message || 'Role added successfully!',
                    variant: 'default',
                    className: 'bg-green-500 text-white',
                });
            } else {
                toast({
                    description: response.data.message || 'Role added successfully!',
                    variant: 'default',
                    className: 'bg-green-500 text-white',
                });
                reset();
            }
        } catch (error: any) {
            toast({
                description: error.response?.data?.message || 'An error occurred!',
                variant: 'destructive',
            });
        } finally {
            setLoading(false); // Reset loading state after submission
        }
    };


    return (
        <Card className='max-w-5xl mx-auto p-4 border border-gray-300 rounded-[38px] mt-10  shadow-[2px_4px_5px_0px_#E9EBFFB2]'>
            <CardHeader className="text-2xl font-medium mb-2 text-[#003CBF]">Role</CardHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="mb-4">
                    <Label htmlFor="roleEmail" className="block text-sm font-medium text-gray-700">Email</Label>
                    <Input
                        id="roleEmail"
                        type="email"
                        {...register('roleEmail')}
                        className="mt-1 block w-full border-none bg-[#E9F4FF] "
                    />
                    {errors.roleEmail && <p className="text-red-500 text-xs">{errors.roleEmail.message}</p>}
                </div>

                <div className="mb-4">
                    <Label htmlFor="rolePhoneNumber" className="block text-sm font-medium text-gray-700">Phone Number</Label>
                    <Input
                        id="rolePhoneNumber"
                        type="text"
                        {...register('rolePhoneNumber')}
                        className="mt-1 block w-full border-none bg-[#E9F4FF] "
                    />
                    {errors.rolePhoneNumber && <p className="text-red-500 text-xs">{errors.rolePhoneNumber.message}</p>}
                </div>

                <div className="mb-4">
                    <Label htmlFor="roleGender" className="block text-sm font-medium text-gray-700">Gender</Label>
                    <select
                        id="roleGender"
                        {...register('roleGender')}
                        className="mt-1 py-3 rounded-md block w-full border-none bg-[#E9F4FF] "
                    >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                    </select>
                    {errors.roleGender && <p className="text-red-500 text-xs">{errors.roleGender.message}</p>}
                </div>

                <div className="mb-4">
                    <Label htmlFor="roleDob" className="block text-sm font-medium text-gray-700">Date of Birth</Label>
                    <Input
                        id="roleDob"
                        type="date"
                        {...register('roleDob')}
                        className="mt-1 block w-full border-none bg-[#E9F4FF] "
                    />
                    {errors.roleDob && <p className="text-red-500 text-xs">{errors.roleDob.message}</p>}
                </div>

                <div className="mb-4">
                    <Label htmlFor="rolePanCard" className="block text-sm font-medium text-gray-700">PAN Card</Label>
                    <Input
                        id="rolePanCard"
                        type="text"
                        {...register('rolePanCard')}
                        className="mt-1 block w-full border-none bg-[#E9F4FF] "
                    />
                    {errors.rolePanCard && <p className="text-red-500 text-xs">{errors.rolePanCard.message}</p>}
                </div>

                <div className="mb-4">
                    <Label htmlFor="roleAadharCard" className="block text-sm font-medium text-gray-700">Aadhar Card</Label>
                    <Input
                        id="roleAadharCard"
                        type="text"
                        {...register('roleAadharCard')}
                        className="mt-1 block w-full border-none bg-[#E9F4FF] "
                    />
                    {errors.roleAadharCard && <p className="text-red-500 text-xs">{errors.roleAadharCard.message}</p>}
                </div>

                <div className="mb-4">
                    <Label htmlFor="roleName" className="block text-sm font-medium text-gray-700">Role Name</Label>
                    <select
                        id="roleName"
                        {...register('roleName')}
                        className="mt-1 py-3 rounded-md block w-full border-none bg-[#E9F4FF] "
                    >
                        <option value="NURSING">NURSING</option>
                        <option value="ACCOUNTANT">ACCOUNTANT</option>
                        <option value="CLEANER">CLEANER</option>
                    </select>
                    {errors.roleName && <p className="text-red-500 text-xs">{errors.roleName.message}</p>}
                </div>

                <div className="relative left-28 top-28">
                    <Button
                        type="submit"
                        variant="primary"
                        disabled={loading}
                        className={`w-96 mt-4 py-6 px-4  rounded-md text-white ${loading ? 'bg-gray-500' : 'bg-[#003CBF]'}`}
                    >
                        {loading ? <Loader2 className="h-5 w-5 animate-spin text-white" /> : "Submit"}
                    </Button>
                </div>

            </form>
        </Card>
    );
};

export default AddRoleForm;
