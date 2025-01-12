import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CardFooter } from "@/components/ui/card";
import CountdownTimer from "./CountdownTimer";
import useStore from "@/zustand/store";
import { useToast } from "@/hooks/use-toast";

// Define schema for OTP validation
const otpSchema = z.object({
  otp: z
    .string()
    .length(6, { message: "OTP must be exactly 6 digits" })
    .regex(/^\d+$/, { message: "OTP must only contain digits" }),
});

// Type for form values inferred from the schema
type OTPFormValues = z.infer<typeof otpSchema>;

// Props type for OTPForm component
interface OTPFormProps {
  onSuccess: () => void; // Callback for successful verification
}

const OTPForm: React.FC<OTPFormProps> = ({ onSuccess }) => {
  // Initialize form handling
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<OTPFormValues>({
    resolver: zodResolver(otpSchema),
  });

  // Extract Zustand store hooks
  const resendOtpLogin = useStore((state) => state.resendOtpLogin);
  const validateOtp = useStore((state) => state.validateOtp);
  const error = useStore((state) => state.error);
  const loading = useStore((state) => state.loading);


  const { toast } = useToast(); // Initialize Shadcn's toast

  // Form submission handler
  const onSubmit: SubmitHandler<OTPFormValues> = async ({ otp }) => {
    const success = await validateOtp(otp);

    if (success) {
      toast({
        title: "Success",
        description: "OTP verified successfully!",
        variant: "default", // Use 'default' for success
        className: "bg-green-500 text-white",
      });
      onSuccess(); // Call onSuccess callback if provided
    } else {
      // Show error message without redirection
      console.error("Verification error:", error);
      toast({
        title: "Error",
        description: "OTP verification failed.",
        variant: "destructive", // Use 'destructive' for error
      });
      console.log("Entered wrong OTP:", otp); // Log the entered wrong OTP
    }
  };

  // Handler for resending OTP
  const handleResend = async () => {
    try {
      await resendOtpLogin();
      toast({
        title: "Success",
        description: "OTP sent again successfully!",
        variant: "default", // Use 'default' for success
      });
    } catch (err) {
      console.error("Resend OTP error:", error);
      toast({
        title: "Error",
        description: "Failed to resend OTP.",
        variant: "destructive", // Use 'destructive' for error
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <Label
          htmlFor="otp"
          className="block text-sm font-medium text-gray-700 pb- 1"
        >
          Enter OTP
        </Label>
        <div className="flex items-center space-x-2" style={{ width: "100%" }}>
          <div className="flex flex-col space-y-1.5 w-72 md:w-[350px] lg:w-96">
            <Input
              id="otp"
              {...register("otp")}
              aria-invalid={!!errors.otp}
              className="h-[40px]" />
            {errors.otp && (
              <span role="alert" className="text-red-500 text-xs">
                {errors.otp.message}
              </span>
            )}
          </div>
        </div>
      </div>
      <CountdownTimer initialCountdown={30} onResend={handleResend} />
      <CardFooter className="flex flex-col p-1 gap-3 justify-between pt-2">
        <Button
          type="submit"
          disabled={loading}
          variant="primary"
          className="w-96 h-[40px]"
        >
          {loading ? "Verifying..." : "Next"}
        </Button>
      </CardFooter>
    </form>
  );
};

export default OTPForm;
