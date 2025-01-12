import React, { useCallback } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Button } from "@/components/ui/button";
import useStore from "@/zustand/store";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { handleApiError } from "@/utils/errorHandler";
import { useToast } from "@/hooks/use-toast";
// Import the Loader icon from lucide-react
import { Loader } from "lucide-react";
import { Label } from "@/components/ui/label";

// testing

// Define validation schema using Zod
const schema = z.object({
    hospitalPhoneNumber: z
        .string()
        .min(10, "Phone number must be at least 10 digits")
        .max(15, "Phone number must be at most 15 digits"),
});

type FormData = z.infer<typeof schema>;

interface LoginFormProps {
    onSuccess: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSuccess }) => {
    const {
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<FormData>({
        resolver: zodResolver(schema),
    });

    const requestOtp = useStore((state) => state.requestOtp);
    const loading = useStore((state) => state.loading);
    const updateHospitalPhoneNumber = useStore((state) => state.updateHospitalPhoneNumber);
    const { toast } = useToast();

    const onSubmit: SubmitHandler<FormData> = async (data) => {
        updateHospitalPhoneNumber(data.hospitalPhoneNumber); // Store the full hospitalPhoneNumber
        try {
            await requestOtp();
            toast({
                title: "Success",
                description: "OTP sent successfully",
                variant: "default",
                className: "bg-green-500 text-white",
            });

            onSuccess();
        } catch (error) {
            const errorMessage = handleApiError(error);
            toast({
                title: "Error",
                description: errorMessage,
                variant: "destructive",
            });
        }
    };

    const handlePhoneChange = useCallback(
        (value: string, country: { dialCode?: string }) => {
            if (!country.dialCode) {
                toast({
                    title: "Error",
                    description: "Invalid country code.",
                    variant: "destructive",
                });
                return;
            }

            // Combine the country code with the phone number
            const fullPhoneNumber = `+${value}`;

            // Update the hospitalPhoneNumber with the full phone number including the country code
            setValue("hospitalPhoneNumber", fullPhoneNumber);
            updateHospitalPhoneNumber(fullPhoneNumber); // Update the store directly with the full phone number
        },
        [setValue, updateHospitalPhoneNumber, toast]
    );

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-2">
            <Label
                htmlFor="hospitalPhoneNumber"
                className="block font-Inter text-sm font-medium text-gray-700 dark:text-white"
            >
                Enter phone number for Login
            </Label>
            <div className="flex items-center space-x-2 w-full pb-2">
                <PhoneInput
                    country="in" // Default country set to India
                    onlyCountries={['in']} // Restrict to India only
                    onChange={handlePhoneChange}
                    inputStyle={{ width: "100%", color: "#000000", height: "40px" }}
                />
            </div>
            {errors.hospitalPhoneNumber && (
                <span className="text-red-600 text-xs flex items-end justify-end">
                    {errors.hospitalPhoneNumber.message}
                </span>
            )}
            <Button
                type="submit"
                disabled={loading}
                variant="primary"
                className="w-96 h-[40px]"
            >
                {loading ? (
                    <>
                        <Loader className="animate-spin h-5 w-5 text-black mr-2" />
                        Loading...
                    </>
                ) : (
                    "Next"
                )}
            </Button>
        </form>
    );
};

export default LoginForm;
