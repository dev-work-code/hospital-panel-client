import React, { useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "@/utils/api"; // Import your Axios instance
import { toPng } from "html-to-image";
import { Card } from "@/components/ui/card";
import PatientInfo from "./PatientBillInfo";
import MedicineTable from "./MedicineTable";
import { Label } from "@/components/ui/label";
import BillSummary from "./BillSummary";
import BillActions from "./BillActions";
import ConfirmBillButton from "./ConfirmBillButton";
import { toast } from "@/hooks/use-toast";

interface Medicine {
  service: string; // Rename to 'service' for Services Provided
  quantity: number | string; // Start as empty or string
  unitCharges: number | string; // Start as empty or string
}

const CreateBillPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const patientData = location.state?.patientData;

  const [medicines, setMedicines] = useState<Medicine[]>([
    { service: "", quantity: "", unitCharges: "" },
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isBillConfirmed, setIsBillConfirmed] = useState(false);

  const billRef = useRef<HTMLDivElement>(null);

  const handleAddMedicine = () => {
    setMedicines([...medicines, { service: "", quantity: "", unitCharges: "" }]);
  };

  const handleRemoveMedicine = (index: number) => {
    const updatedMedicines = medicines.filter((_, i) => i !== index);
    setMedicines(updatedMedicines);
  };

  const handleMedicineChange = (
    index: number,
    field: keyof Medicine,
    value: string | number
  ) => {
    const updatedMedicines = medicines.map((medicine, i) =>
      i === index ? { ...medicine, [field]: value } : medicine
    );
    setMedicines(updatedMedicines);
  };

  const calculateTotalAmount = () => {
    return medicines.reduce((total, medicine) => {
      const quantity = parseFloat(medicine.quantity.toString());
      const unitCharges = parseFloat(medicine.unitCharges.toString());
      return total + (quantity * unitCharges || 0);
    }, 0);
  };

  const calculateCGST = (total: number) => total * 0.09; // 9% CGST
  const calculateSGST = (total: number) => total * 0.09; // 9% SGST
  const calculateSubTotal = () => calculateTotalAmount();
  const calculateFinalTotal = () => {
    const total = calculateTotalAmount();
    return total + calculateCGST(total) + calculateSGST(total);
  };

  const handleConfirmBill = () => {
    setIsBillConfirmed(true);
  };

  const handleEditBill = () => {
    setIsBillConfirmed(false);
  };
  const handleUploadBill = async () => {
    if (!billRef.current) {
      setError("Failed to generate the bill screenshot.");
      return;
    }

    setError(null);
    setLoading(true);

    try {
      // Generate a screenshot of the bill
      const imageDataUrl = await toPng(billRef.current);
      const blob = await (await fetch(imageDataUrl)).blob();
      const file = new File([blob], "bill.png", { type: "image/png" });

      // Prepare FormData for the upload
      const formData = new FormData();
      formData.append("billFile", file);
      formData.append("patientId", patientData.patientHistory[0].patientDetails.patientId);
      formData.append("billAmount", calculateTotalAmount().toString());

      // Upload the bill
      await api.post("/hospital/patients/uploadPatientBill", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Display success toast
      toast({
        title: "Success",
        description: "Bill uploaded successfully!",
        variant: "default",
        className: "bg-green-500 text-white",
      });

      navigate("/accounts"); // Navigate to the homepage after success
    } catch (err) {
      console.error("Error uploading bill:", err);
      setError("Failed to upload the bill. Please try again.");

      // Display error toast
      toast({
        title: "Error",
        description: "Failed to upload the bill. Please try again.",
        variant: "destructive",
        className: "bg-red-500 text-white",
      });
    } finally {
      setLoading(false); // End loading state
    }
  };

  if (!patientData) {
    return <p className="text-center mt-10 text-red-500">No patient data found.</p>;
  }

  const hospitalDetails = patientData.patientHistory[0].doctorDetails.hospital;
  const patientDetails = patientData.patientHistory[0].patientDetails;
  const subTotal = calculateSubTotal();
  const today = new Date().toLocaleDateString("en-US", {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <Card className="max-w-6xl rounded-[38px] mx-auto">
      {/* Bill UI Section */}
      <div
        ref={billRef}
        className="bg-white mb-6 rounded-[38px]"
        id="bill-container"
      >
        {/* Header Section for Bill */}
        <div className="bg-[#E9F4FF] py-4 rounded-t-[38px]">
          <h3 className="ml-8">Bill</h3>
        </div>
        {/* Hospital Information Section */}
        <div className="mb-4 px-4 mt-2">
          <h3 className="text-lg font-semibold mb-2">Hospital Information</h3>
          <div className="flex items-center justify-between">
            <div className="grid grid-cols-1 gap-2">
              <span className="flex flex-row items-center gap-2">
                <Label className="text-sm font-bold">Name:</Label>
                <p className="text-xs">
                  {hospitalDetails.hospitalName}
                </p>
              </span>
              <span className="flex flex-row items-center gap-2">
                <Label className="text-sm font-bold">Location:</Label>
                <p className="text-xs">
                  {hospitalDetails.location}
                </p>
              </span>
            </div>
            <span className="flex flex-row items-center gap-2 mt-2">
              <Label className="text-sm font-bold">Issued on:</Label>
              <p className="text-xs">{today}</p>
            </span>
          </div>
        </div>
        {/* Patient Information Section */}
        <PatientInfo patientDetails={patientDetails} />
        {/* Bill Details Section */}
        <h1 className="text-center -mt-2 mb-6 font-bold text-base">Details</h1>
        <div className="px-4">
          {/* Medicine Table */}
          <MedicineTable
            medicines={medicines}
            isBillConfirmed={isBillConfirmed}
            handleMedicineChange={handleMedicineChange}
            handleRemoveMedicine={handleRemoveMedicine}
            handleAddMedicine={handleAddMedicine}
            calculateTotalAmount={calculateTotalAmount}
          />
        </div>

        {/* Bill Summary Section */}
        <BillSummary
          subTotal={subTotal}
          calculateCGST={calculateCGST}
          calculateSGST={calculateSGST}
          calculateFinalTotal={calculateFinalTotal}
        />
      </div>
      {/* Confirm Bill Button */}
      <ConfirmBillButton
        isBillConfirmed={isBillConfirmed}
        handleConfirmBill={handleConfirmBill}
      />
      {/* Bill Actions Section */}
      <BillActions
        isBillConfirmed={isBillConfirmed}
        loading={loading}
        handleEditBill={handleEditBill}
        handleUploadBill={handleUploadBill}
      />
      {/* Error Message */}
      {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
    </Card>

  );
};
export default CreateBillPage;
