import { Link, useNavigate } from "react-router-dom";
import OTPForm from "./otpForm";
import { Card, CardFooter } from "@/components/ui/card";
import Logo from "@/assets/Liv PrivateLimited Transprent 1.svg";
import BackGroundLogo from "@/assets/BackgroundImage.svg";
function OTPComponent() {
  const navigate = useNavigate();

  const handleSuccess = () => {
    navigate("/");
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100 dark:bg-gray-900" style={{ backgroundImage: `url(${BackGroundLogo})` }}>
      <Card className="bg-white rounded-sm md:rounded-2xl lg:rounded-3xl dark:bg-background w-[539px] h-[564px] shadow-lg">
        <div className="w-96 mt-10 mx-auto flex flex-col items-center">
          <img
            src={Logo}
            alt="Logo"
            className="w-[160px] h-[163px]"
            loading="lazy"
          />
          <div>
            <h1 className="block font-Inter text-xl font-medium text-[#013DC0] mb-4">Login</h1>
            <OTPForm onSuccess={handleSuccess} />
          </div>
          <CardFooter className="mt-4 font-light">Don’t have an account?
            <Link to="/register ">
              <span className="text-[#013DC0] ml-1"> Create one</span>
            </Link>
          </CardFooter>
        </div>
      </Card>
    </div>
  );
}
export default OTPComponent;
