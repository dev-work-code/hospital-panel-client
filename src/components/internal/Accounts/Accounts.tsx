import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import api from "@/utils/api"; // Import your custom Axios instance
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { AxiosError } from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import InvoiceImg from "@/assets/InvoiceImg.svg"

const CreateBillButton: React.FC = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const navigate = useNavigate();

  const handleDialogChange = (open: boolean) => {
    // Prevent the dialog from closing if there's an error
    if (error) {
      console.log("Dialog is not closing due to error");
      return;
    }
    setIsDialogOpen(open);
  };

  const handleNextClick = async () => {
    if (!phoneNumber.trim()) {
      setError("Phone number is required.");
      toast({
        title: "Validation Error",
        description: "Phone number is required.",
        variant: "destructive",
        className: "bg-red-500 text-white",
      });
      return;
    }

    if (phoneNumber.trim().length !== 10 || !/^\d+$/.test(phoneNumber.trim())) {
      setError("Phone number must be exactly 10 digits.");
      toast({
        title: "Validation Error",
        description: "Phone number must be exactly 10 digits.",
        variant: "destructive",
        className: "bg-red-500 text-white",
      });
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const response = await api.get("/hospital/patients/getPatientDetails", {
        params: { phoneNumber },
      });
      const { success, message, data } = response.data;

      console.log("API Response:", success, message, data); // Add log here

      if (success) {
        toast({
          title: "Success",
          description: message || "Patient details fetched successfully!",
          variant: "default",
          className: "bg-green-500 text-white",
        });
        navigate("/createBillPage", { state: { patientData: data } });
        setIsDialogOpen(false); // Close on success
      } else {
        setError(message);
        toast({
          title: "Error",
          description: message || "An error occurred. Please try again.",
          variant: "destructive",
          className: "bg-red-500 text-white",
        });
        // Dialog remains open on error
      }
    } catch (err: unknown) {
      console.error("Error fetching patient details:", err);

      let errorMessage = "Failed to fetch patient details. Please try again.";

      if (err instanceof AxiosError) {
        if (err.response && err.response.data && err.response.data.message) {
          errorMessage = err.response.data.message;
        }
      }

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
        className: "bg-red-500 text-white",
      });

      setError(errorMessage);
      // Dialog remains open on error
    } finally {
      setLoading(false);
    }
  };
  const handleViewInvoiceClick = () => {
    navigate("/invoices");
  };

  // Check if the phone number is valid
  const isPhoneNumberValid = phoneNumber.trim().length === 10 && /^\d+$/.test(phoneNumber.trim());
  return (
    <>
      <div className="flex items-center justify-between w-full p-4">
        <h1 className="text-xl  text-[#013DC0] font-medium -mt-[60px] ">Account</h1>
        <div className="flex flex-col items-end space-y-4">
          {/* Create Bill Button */}
          <AlertDialog open={isDialogOpen} onOpenChange={handleDialogChange}>
            <AlertDialogTrigger asChild>
              <Button
                variant="primary"
                className="px-4 py-5 w-48 rounded-[8px]"
                onClick={() => setIsDialogOpen(true)}
              >
                Create Bill
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-[#E9F4FF] rounded-3xl h-64">
              <AlertDialogHeader>
                <AlertDialogTitle className="flex flex-row items-center justify-center">Enter Patient Phone number to create the Bill</AlertDialogTitle>
              </AlertDialogHeader>
              <div className="mb-4">
                <Input
                  type="text"
                  className="bg-white py-6"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="Enter phone number"
                />
                {error && <p className="text-red-500 text-sm ml-2 mt-1">{error}</p>}
              </div>
              <AlertDialogFooter>
                <Button
                  variant="destructive"
                  className="px-4 py-5 w-52 rounded mr-2"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
                <AlertDialogAction
                  className="px-4 py-5 font-bold text-base w-52 bg-[#013DC0] text-white rounded hover:bg-[#013DC0]"
                  onClick={handleNextClick}
                  disabled={loading || !isPhoneNumberValid} // Disable button if phone number is invalid
                >
                  {loading ? "Loading..." : "Next"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <Button
            variant="primary"
            className="px-4 py-5 w-48 rounded-[8px] "
            onClick={handleViewInvoiceClick}
          >
            View Previous Invoice
          </Button>
        </div>
      </div>
      <div className="flex items-center justify-center">
        <img src={InvoiceImg} alt="Invoice Image" />
      </div>
    </>
  );
};

export default CreateBillButton;
