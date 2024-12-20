import DashboardHeader from "@/app/_component/DashboardHeader";
import SideNavbar from "@/app/_component/SideNavbar";
import React from "react";

export default function DashboardLayout({children} : {children : React.ReactNode}) {
    return <div>
        <div className="fixed md:w-64 hidden md:block h-screen border shadow-md">
            <SideNavbar/>
        </div>
        <div className="md:ml-64">
            <DashboardHeader/>
            {children}
        </div>
    </div>
}