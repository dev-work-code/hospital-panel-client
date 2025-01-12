import { Separator } from "@/components/ui/separator";
import React from "react";

interface BillSummaryProps {
  subTotal: number;
  calculateCGST: (subTotal: number) => number;
  calculateSGST: (subTotal: number) => number;
  calculateFinalTotal: () => number;
}

const BillSummary: React.FC<BillSummaryProps> = ({
  subTotal,
  calculateCGST,
  calculateSGST,
  calculateFinalTotal,
}) => {
  return (
    <div className="px-4">
      <Separator className="my-6 bg-black" />
      <div className="flex justify-between  px-16">
        <div className="w-1/2 flex flex-col">
          <span><label className="text-sm">Terms and Conditions</label></span>
          <span>All services provided are subject to the hospital's policies.</span>
        </div>
        <div className="flex flex-col gap-2" >
          <div className="flex justify-end items-center gap-10">
            <span><label className="text-sm">Sub Total:</label></span>
            <p className="font-medium">₹{subTotal}</p>
          </div>
          <div className="flex justify-end items-center gap-10">
            <span><label className="text-sm">CGST (9%):</label></span>
            <p className="font-medium">₹{calculateCGST(subTotal)}</p>
          </div>
          <div className="flex justify-end items-center gap-10">
            <span><label className="text-sm">SGST (9%):</label></span>
            <p className="font-medium">₹{calculateSGST(subTotal)}</p>
          </div>
          <div className="flex justify-end items-center gap-10 font-semibold bg-[#E9F4FF] rounded-md p-2 w-64 ml-auto -mx-4">
            <span><label className="text-sm">Total:</label></span>
            <p className="font-medium">₹{calculateFinalTotal()}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BillSummary;
