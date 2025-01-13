import HomeLayout from "@/components/layout/HomeLayout";
import Home from "@/pages/Home";
import Doctor from "@/pages/Doctor";
import NotFound from "@/pages/NotFound";
import { Suspense } from "react";
import { Navigate, Outlet, useRoutes } from "react-router-dom";
import AppointmentsPage from "@/pages/AppointmentsPage";
import PatientsPage from "@/pages/PatientsPage";
import Profile from "@/pages/Profile";
import Account from "@/pages/Account";
import Role from "@/pages/Role";
import Dashboard from "@/pages/Dashboard";
import LoginScreen from "@/components/internal/Auth/Login/login/loginScreen";
import OTPComponent from "@/components/internal/Auth/Login/otp/otpScreen";
import RegisterScreen from "@/components/internal/Auth/Register/RegisterScreen";
import DoctorDetail from "@/pages/DoctorDetail";
import LiveCases from "@/pages/LiveCases";
import ProfileScreen from "@/components/internal/Doctor/AddDoctor/PorfileScreen/profileScreen";
import AddAppointments from "@/pages/Add-Appointments";
import PatientProfilePage from "@/pages/PatientProfile";
import AddRoles from "@/pages/Add-Roles";
import RoleProfile from "@/components/internal/Role/RoleProfile";
import LiveCaseProfilePage from "@/pages/Live-case-Profile";
import CreateBill from "@/pages/CreateBill";
import Invocies from "@/components/internal/Accounts/Invocies";
import InvoiceDetails from "@/components/internal/Accounts/InvoiceDetails";

export default function AppRouter() {
  const privateRoutes = [
    {
      path: "/",
      element: (
        <HomeLayout>
          <Suspense>
            <Outlet />
          </Suspense>
        </HomeLayout>
      ),
      children: [
        {
          element: <Home />,
          index: true,
        },
        {
          path: "/doctor",
          element: <Doctor />,
        },
        {
          path: "/doctor/:doctorId",
          element: <DoctorDetail />,
        },
        {
          path: "/appointments",
          element: <AppointmentsPage />,
        },
        {
          path: "/patients",
          element: <PatientsPage />,
        },
        {
          path: "/patient/:patientId",
          element: <PatientProfilePage />,
        },
        {
          path: "/add-patients",
          element: <AddAppointments />,
        },
        {
          path: "/profile",
          element: <Profile />,
        },
        {
          path: "/accounts",
          element: <Account />,
        },
        {
          path: "/invoices",
          element: <Invocies />,
        },
        {
          path: "/invoice/:invoiceId",
          element: <InvoiceDetails />,
        },
        {
          path: "/createBillPage",
          element: <CreateBill />,
        },
        {
          path: "/role",
          element: <Role />,
        },
        {
          path: "/add-role",
          element: <AddRoles />,
        },
        {
          path: "/role/:roleId",
          element: <RoleProfile />,
        },
        {
          path: "/dashboard",
          element: <Dashboard />,
        },
        {
          path: "/livecases",
          element: <LiveCases />,
        },
        {
          path: "/hospital-case-profile",
          element: <LiveCaseProfilePage />,
        },
        {
          path: "/doctor/add",
          element: <ProfileScreen />,
        },

      ],
    },
  ];

  const publicRoutes = [
    {
      path: "/404",
      element: <NotFound />,
    },
    {
      path: "/register",
      element: <RegisterScreen />,
    },
    {
      path: "/login",
      element: <LoginScreen />,
    },
    {
      path: "/login/otp",
      element: <OTPComponent />,
    },
    {
      path: "*",
      element: <Navigate to="/404" replace />,
    },
  ];

  const routes = useRoutes([...privateRoutes, ...publicRoutes]);
  return routes;
}
