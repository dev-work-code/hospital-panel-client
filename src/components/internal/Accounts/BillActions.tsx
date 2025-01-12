// BillActions.tsx
import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";
import React from "react";

interface BillActionsProps {
  isBillConfirmed: boolean;
  loading: boolean;
  handleEditBill: () => void;
  handleUploadBill: () => void;
}

const BillActions: React.FC<BillActionsProps> = ({
  isBillConfirmed,
  loading,
  handleEditBill,
  handleUploadBill,
}) => {
  if (!isBillConfirmed) {
    return null; // If the bill is not confirmed, do not show the buttons.
  }

  return (
    <div className="flex justify-between items-center mb-6 px-4">
      <Button
        variant="destructive"
        className="px-6 py-2 border rounded"
        onClick={handleEditBill}
      >
        Edit Bill
      </Button>
      <Button
        variant="primary"
        className="px-6 py-2 text-white rounded w-56"
        onClick={handleUploadBill}
        disabled={loading}
      >
        {loading ? <Loader className="animate-spin h-5 w-5 text-black mr-2" /> : "Generate and Upload Bill"}
      </Button>
    </div>
  );
};

export default BillActions;
