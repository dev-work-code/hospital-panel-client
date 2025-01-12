// MedicineTable.tsx
import React from "react";
import { Minus, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Medicine {
  service: string;
  quantity: number | string;
  unitCharges: number | string;
}

interface MedicineTableProps {
  medicines: Medicine[];
  isBillConfirmed: boolean;
  handleMedicineChange: (
    index: number,
    field: keyof Medicine,
    value: string | number
  ) => void;
  handleRemoveMedicine: (index: number) => void;
  handleAddMedicine: () => void;
  calculateTotalAmount: (medicines: Medicine[]) => number;
}

const MedicineTable: React.FC<MedicineTableProps> = ({
  medicines,
  isBillConfirmed,
  handleMedicineChange,
  handleRemoveMedicine,
  handleAddMedicine,
}) => {
  return (
    <div className="border rounded-md shadow-[1px_4px_20px_0px_#0D162A33]">
      <Table className="table-auto w-full border-collapse mb-4 rounded-xl">
        <TableHeader>
          <TableRow className="bg-[#E9F4FF]">
            <TableHead className="py-2 text-[#667085] text-sm font-medium">
              Services Provided
            </TableHead>
            <TableHead className="py-2 text-[#667085] text-sm font-medium">
              Quantity
            </TableHead>
            <TableHead className="py-2 text-[#667085] text-sm font-medium">
              Unit Charges
            </TableHead>
            <TableHead className="py-2 text-[#667085] text-sm font-medium">
              Amount
            </TableHead>
            {!isBillConfirmed && (
              <TableHead className="py-2 text-[#667085] text-sm font-medium">
                Action
              </TableHead>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {medicines.map((medicine, index) => (
            <TableRow key={index}>
              <TableCell className="px-4 py-2">
                {isBillConfirmed ? (
                  medicine.service
                ) : (
                  <Input
                    type="text"
                    value={medicine.service}
                    onChange={(e) =>
                      handleMedicineChange(index, "service", e.target.value)
                    }
                    className="w-full border bg-white border-[#D8ECFF] px-2 py-1 rounded"
                  />
                )}
              </TableCell>
              <TableCell className="px-4 py-2">
                {isBillConfirmed ? (
                  medicine.quantity
                ) : (
                  <Input
                    type="number"
                    value={medicine.quantity}
                    onChange={(e) =>
                      handleMedicineChange(index, "quantity", e.target.value)
                    }
                    className="w-full border bg-white border-[#D8ECFF] px-2 py-1 rounded"
                  />
                )}
              </TableCell>
              <TableCell className="px-4 py-2">
                {isBillConfirmed ? (
                  medicine.unitCharges
                ) : (
                  <Input
                    type="number"
                    value={medicine.unitCharges}
                    onChange={(e) =>
                      handleMedicineChange(index, "unitCharges", e.target.value)
                    }
                    className="w-full border bg-white border-[#D8ECFF] px-2 py-1 rounded"
                  />
                )}
              </TableCell>
              <TableCell className="px-4 py-2">
                ₹{(parseFloat(medicine.quantity.toString()) || 0) *
                  (parseFloat(medicine.unitCharges.toString()) || 0)}
              </TableCell>
              {!isBillConfirmed && (
                <TableCell className="px-4 py-2">
                  <button
                    onClick={() => handleRemoveMedicine(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Minus />
                  </button>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Add Medicine Button */}
      {!isBillConfirmed && (
        <div className="flex justify-end items-center mb-6 mr-8">
          <button
            className="px-2 py-2 border border-[#164FCA] text-white rounded-full"
            onClick={handleAddMedicine}
          >
            <Plus className="text-[#164FCA]" />
          </button>
        </div>
      )}
    </div>
  );
};

export default MedicineTable;
