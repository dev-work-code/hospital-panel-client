import { Card } from "@/components/ui/card";
import Logo from "@/assets/Liv PrivateLimited Transprent 1.svg";
import HospitalForm from "./hospitalRegister";
import BackGroundLogo from "@/assets/BackgroundImage.svg";

function OTPComponent() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900" style={{ backgroundImage: `url(${BackGroundLogo})` }}>
            <Card className="bg-white rounded-xl dark:bg-background w-[1129px] shadow-lg">
                <div className="flex flex-col items-center">
                    <img
                        src={Logo}
                        alt="Logo"
                        className="w-[260px] h-[200px]"
                        loading="lazy"
                    />
                    <div>
                        <h1 className="block font-Inter text-2xl font-medium text-[#013DC0] mb-2 lg:-mt-12">Hospital Registration</h1>
                        <div className="mt-10">
                            <HospitalForm />
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    );
}

export default OTPComponent;
