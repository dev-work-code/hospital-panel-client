import { Card, CardHeader } from "@/components/ui/card";
import OrganizationForm from "../ProfileForm/ProfileDataForm";

function OTPComponent() {
  return (
    <Card className="border border-[#D2E2F3] rounded-[38px] p-4">
      <CardHeader className="text-2xl font-semibold mt-4  text-[#013DC0] text-start">Add Doctor</CardHeader> {/* Add your text here */}
      <OrganizationForm />
    </Card>
  );
}
export default OTPComponent;
