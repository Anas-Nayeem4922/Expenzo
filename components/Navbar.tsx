"use client"

import React, { useState } from 'react'
import Logo from './Logo'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { Button, buttonVariants } from './ui/button'
import { UserButton } from '@clerk/nextjs'
import { ThemeSwitchButton } from './ThemeSwitchButton'
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet'
import { Menu } from 'lucide-react'

function Navbar() {
    return (
        <div>
            <DesktopNavbar/>
            <MobileNavbar/>
        </div>
    )
}

const items = [
    {label : "Dashboard", link : "/"},
    {label : "Transactions", link : "/transactions"},
    {label : "Manage", link : "/manage"},
]

function DesktopNavbar () {
    return <div className='hidden border-separate border-b bg-background md:block'> 
        <nav className='container flex items-center justify-between pl-4'>
            <div className='flex h-[80px] min-h-[60px] items-center gap-x-4'>
                <Logo/>
                <div className='flex h-full'>
                    {items.map((item) => (
                        <NavbarItem key={item.label} link={item.link} label={item.label}/>
                    ))}
                </div>
            </div>
            <div className="flex items-center gap-4">
                <ThemeSwitchButton/>
                <UserButton/>
            </div>
        </nav>
    </div>
}

function MobileNavbar() {
    const [isOpen, setIsOpen] = useState(false);
    return <div className="block border-separate bg-background md:hidden">
        <nav className="container flex items-center justify-between pl-4">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                    <Button variant={"ghost"} size={"icon"}>
                        <Menu/>
                    </Button>
                </SheetTrigger>
                <SheetContent className='w-[90%]' side={"left"}>
                    <Logo/>
                    <div className="flex flex-col gap-1 pt-4">
                        {items.map((item) => (
                            <NavbarItem onClick={() => {
                                setIsOpen(x => !x)
                            }} key={item.label} label={item.label} link={item.link}/>
                        ))}
                    </div>
                </SheetContent>
            </Sheet>
            <div className="flex justify-between">
                <div className="flex h-[80px] min-h-[60px] items-center gap-x-4">
                    <Logo/>
                </div>
                <div className="flex items-center gap-2">
                    <ThemeSwitchButton/>
                    <UserButton/>
                </div>
            </div>
        </nav>
    </div>
}

function NavbarItem ({link, label, onClick} : {link : string, label : string, onClick ?: () => void}) {
    const pathName = usePathname();
    const isActive = pathName === link;
    return <div  className='relative flex items-center'>
        <Link href={link} className={cn(
            buttonVariants({variant : "ghost"}), 
            "w-full justify-start text-lg text-muted-foreground hover:text-foreground",
            isActive && "text-foreground"
        )} onClick={onClick}>{label}</Link>
        {
            isActive && (
                <div className='absolute -bottom-[2px] left-1/2 hidden h-[2px] w-[80%] -translate-x-1/2 rounded-xl bg-foreground md:block'></div>
            )
        }
    </div>
}

export default Navbar