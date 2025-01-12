import * as React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarRail,// Import SidebarHeader
} from "@/components/ui/sidebar";
import { NavMain } from "./NavMain";
import Logo from "@/assets/Liv PrivateLimited Transprent 1.svg";  // Logo import
import dashBoardIcon from "@/assets/ic_Dashboard.svg";  // Dashboard icon import
import AppointmentIcon from "@/assets/Apointment.svg";  // Appointment icon import
import PatientIcon from "@/assets/Patient.svg";  // Patient icon import
import RoleIcon from "@/assets/Role.svg";  // Role icon import
import AccountIcon from "@/assets/Account.svg";  // Account icon import
import DoctorIcon from "@/assets/Doctor.svg";  // Doctor icon import
import LiveCasesIcon from "@/assets/Live-Case.svg"
import ProfileIcon from "@/assets/Profile.svg"
import { SidebarHeader } from "./SidebarHeader";

// This is sample data.
const data = {
  user: {
    name: "Liv Med",
    email: "livmed@gmail.com",
    avatar: "https://ui.shadcn.com/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",  // Updated URL
      icon: dashBoardIcon,  // Image icon
      isActive: true,
    },
    {
      title: "Appointments",
      url: "/appointments",  // Updated URL
      icon: AppointmentIcon,  // Image icon
    },
    {
      title: "Doctors",
      url: "/doctor",  // Updated URL
      icon: DoctorIcon,  // Image icon
    },
    {
      title: "Patients",
      url: "/patients",  // Updated URL
      icon: PatientIcon,  // Image icon
    },
    {
      title: "Live Cases",
      url: "/livecases",  // Updated URL
      icon: LiveCasesIcon,  // Keeping this as a placeholder for live cases (can also replace with an image if needed)
    },
    {
      title: "Roles",
      url: "/role",  // Updated URL
      icon: RoleIcon,  // Image icon
    },
    {
      title: "Accounts",
      url: "/accounts",  // Updated URL
      icon: AccountIcon,  // Image icon
    },
    {
      title: "Profile",
      url: "/profile",  // Updated URL
      icon: ProfileIcon,  // Keeping default icon for profile (can replace with image as well)
    },
  ],
  navMain2: [
    {
      title: "Logo",
      url: "/",  // Updated URL
      icon: Logo,  // Image icon
      isActive: true,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      {/* Sidebar Header */}
      <SidebarHeader items={data.navMain2} />

      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
