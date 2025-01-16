import { Suspense, lazy } from "react";
import { Navigate, Outlet, useRoutes } from "react-router-dom";
import HomeLayout from "@/components/layout/HomeLayout";
import { ProtectedRoute } from "./ProtectedRoute";

// Lazy-loaded components
const Doctor = lazy(() => import("@/pages/Doctor"));
const NotFound = lazy(() => import("@/pages/NotFound"));
const AppointmentsPage = lazy(() => import("@/pages/AppointmentsPage"));
const PatientsPage = lazy(() => import("@/pages/PatientsPage"));
const Profile = lazy(() => import("@/pages/Profile"));
const Account = lazy(() => import("@/pages/Account"));
const Role = lazy(() => import("@/pages/Role"));
const Dashboard = lazy(() => import("@/pages/Dashboard"));
const LoginScreen = lazy(() => import("@/components/internal/Auth/Login/login/loginScreen"));
const OTPComponent = lazy(() => import("@/components/internal/Auth/Login/otp/otpScreen"));
const RegisterScreen = lazy(() => import("@/components/internal/Auth/Register/RegisterScreen"));
const DoctorDetail = lazy(() => import("@/pages/DoctorDetail"));
const LiveCases = lazy(() => import("@/pages/LiveCases"));
const ProfileScreen = lazy(() => import("@/components/internal/Doctor/AddDoctor/PorfileScreen/profileScreen"));
const AddAppointments = lazy(() => import("@/pages/Add-Appointments"));
const PatientProfilePage = lazy(() => import("@/pages/PatientProfile"));
const AddRoles = lazy(() => import("@/pages/Add-Roles"));
const RoleProfile = lazy(() => import("@/components/internal/Role/RoleProfile"));
const LiveCaseProfilePage = lazy(() => import("@/pages/Live-case-Profile"));
const CreateBill = lazy(() => import("@/pages/CreateBill"));
const Invoices = lazy(() => import("@/components/internal/Accounts/Invocies"));
const InvoiceDetails = lazy(() => import("@/components/internal/Accounts/invoiceDetails/InvoiceDetails"));

export default function AppRouter() {
  const privateRoutes = [
    {
      path: "/",
      element: (
        <HomeLayout>
          <Suspense fallback={<div>Loading...</div>}>
            <Outlet />
          </Suspense>
        </HomeLayout>
      ),
      children: [
        {
          element: <ProtectedRoute element={<Dashboard />} />,
          index: true,
        },
        {
          path: "/doctor",
          element: <ProtectedRoute element={<Doctor />} />,
        },
        {
          path: "/doctor/:doctorId",
          element: <ProtectedRoute element={<DoctorDetail />} />,
        },
        {
          path: "/appointments",
          element: <ProtectedRoute element={<AppointmentsPage />} />,
        },
        {
          path: "/patients",
          element: <ProtectedRoute element={<PatientsPage />} />,
        },
        {
          path: "/patient/:patientId",
          element: <ProtectedRoute element={<PatientProfilePage />} />,
        },
        {
          path: "/add-patients",
          element: <ProtectedRoute element={<AddAppointments />} />,
        },
        {
          path: "/profile",
          element: <ProtectedRoute element={<Profile />} />,
        },
        {
          path: "/accounts",
          element: <ProtectedRoute element={<Account />} />,
        },
        {
          path: "/invoices",
          element: <ProtectedRoute element={<Invoices />} />,
        },
        {
          path: "/invoice/:invoiceId",
          element: <ProtectedRoute element={<InvoiceDetails />} />,
        },
        {
          path: "/createBillPage",
          element: <ProtectedRoute element={<CreateBill />} />,
        },
        {
          path: "/role",
          element: <ProtectedRoute element={<Role />} />,
        },
        {
          path: "/add-role",
          element: <ProtectedRoute element={<AddRoles />} />,
        },
        {
          path: "/role/:roleId",
          element: <ProtectedRoute element={<RoleProfile />} />,
        },
        {
          path: "/dashboard",
          element: <ProtectedRoute element={<Dashboard />} />,
        },
        {
          path: "/livecases",
          element: <ProtectedRoute element={<LiveCases />} />,
        },
        {
          path: "/hospital-case-profile",
          element: <ProtectedRoute element={<LiveCaseProfilePage />} />,
        },
        {
          path: "/doctor/add",
          element: <ProtectedRoute element={<ProfileScreen />} />,
        },
      ],
    },
  ];

  const publicRoutes = [
    {
      path: "/404",
      element: <Suspense fallback={<div>Loading...</div>}>
        <NotFound />
      </Suspense>,
    },
    {
      path: "/register",
      element: (
        <ProtectedRoute
          element={
            <Suspense fallback={<div>Loading...</div>}>
              <RegisterScreen />
            </Suspense>
          }
          isPublic
          alreadyLoggedInRedirect="/dashboard"
        />
      ),
    },
    {
      path: "/login",
      element: (
        <ProtectedRoute
          element={
            <Suspense fallback={<div>Loading...</div>}>
              <LoginScreen />
            </Suspense>
          }
          isPublic
          alreadyLoggedInRedirect="/dashboard"
        />
      ),
    },
    {
      path: "/login/otp",
      element: (
        <ProtectedRoute
          element={
            <Suspense fallback={<div>Loading...</div>}>
              <OTPComponent />
            </Suspense>
          }
          isPublic
          alreadyLoggedInRedirect="/dashboard"
        />
      ),
    },
    {
      path: "*",
      element: <Navigate to="/404" replace />,
    },
  ];

  const routes = useRoutes([...privateRoutes, ...publicRoutes]);
  return routes;
}
