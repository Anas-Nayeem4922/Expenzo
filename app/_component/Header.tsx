"use client"
import { Button } from '@/components/ui/button'
import Logo from '@/components/ui/Logo'
import { UserButton, useUser } from '@clerk/nextjs'
import Link from 'next/link'
import React from 'react'

function Header() {
    const { user, isSignedIn } = useUser();
    return (
        <div className='bg-slate-950 text-white flex justify-between items-center px-2 py-4 shadow-lg'>
            <Logo/>
            {!isSignedIn ? <Button className='bg-green-400 text-black font-semibold'><Link href={"/signup"}>Get Started</Link></Button> : 
            <UserButton/>
            }
            
        </div>
    )
}

export default Header