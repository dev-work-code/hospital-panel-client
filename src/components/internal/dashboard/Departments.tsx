import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import React from "react";

type Department = {
  name: string;
  patientCount: number;
  id: string;
};

type DepartmentsProps = {
  departments: Department[];
};

const Departments: React.FC<DepartmentsProps> = ({ departments }) => {
  return (
    <Card className="bg-white w-[323px] shadow-[8px_12px_18px_0px_#DADEE8] border border-[#DEEBFD] rounded-lg">
      <Accordion type="single" collapsible className="w-full border-none">
        <AccordionItem value="item-1" className="border-none">
          <AccordionTrigger className="text-lg font-semibold mb-4 bg-[#E9F4FF] text-start py-2 rounded-t-lg px-4">
            Departments
          </AccordionTrigger>
          <AccordionContent>
            <CardContent className="space-y-4">
              {departments.map((department, index) => (
                <div
                  key={department.id}
                  className={`flex justify-between items-center ${index !== departments.length - 1 ? "border-b pb-2" : ""
                    }`}
                >
                  <span className="font-medium text-sm">{department.name}</span>
                  <Badge className="font-semibold rounded-2xl bg-[#013DC0] px-4">
                    {department.patientCount}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </Card>
  );
};

export default Departments;
