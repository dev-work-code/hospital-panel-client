// ConfirmBillButton.tsx
import { Button } from "@/components/ui/button";
import React from "react";

interface ConfirmBillButtonProps {
  isBillConfirmed: boolean;
  handleConfirmBill: () => void;
}

const ConfirmBillButton: React.FC<ConfirmBillButtonProps> = ({
  isBillConfirmed,
  handleConfirmBill,
}) => {
  if (isBillConfirmed) {
    return null; // If the bill is confirmed, do not show the button
  }

  return (
    <div className="flex justify-end items-center mb-6 px-4">
      <Button
        variant="primary"
        className="px-6 py-6 bg-[#013DC0] w-64 text-white rounded"
        onClick={handleConfirmBill}
      >
        Confirm Bill
      </Button>
    </div>
  );
};

export default ConfirmBillButton;
