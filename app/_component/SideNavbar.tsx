"use client"
import Logo from "@/components/ui/Logo";
import { UserButton } from "@clerk/nextjs";
import { LayoutGrid, PiggyBank, ReceiptText, ShieldCheck } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

export default function SideNavbar() {
    const menuList = [
        {id : 1, name : "Dashboard", icon : LayoutGrid, path : "/dashboard"},
        {id : 2, name : "Budgets", icon : PiggyBank, path : "/dashboard/budget"},
        {id : 3, name : "Expenses", icon : ReceiptText, path : "/dashboard/expense"},
        {id : 4, name : "Upgrade", icon : ShieldCheck, path : "/dashboard/upgrade"},
    ];
    const path = usePathname();
    useEffect(() => {
        console.log(path)
    }, [path])
    return <div>
        <div className="mt-3"><Logo/></div>
        <div className="mt-10">
            {menuList.map((e) => {
                return <h2 key={e.id} className={`flex items-center gap-2 text-gray-500 font-semibold p-3 my-4 mx-2 cursor-pointer rounded-md hover:bg-green-200 hover:text-black ${path == e.path && 'text-gray-950 bg-green-200'}`}>
                    <e.icon/>
                    {e.name}
                </h2>
            })}
        </div>
        <div className="fixed bottom-5 p-5 flex gap-2 items-center cursor-pointer">
            <UserButton/>
            <p className="font-bold">User Profile</p>
        </div>
    </div>
}