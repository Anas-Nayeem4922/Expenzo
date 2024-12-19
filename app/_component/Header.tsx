import { Button } from '@/components/ui/button'
import Logo from '@/components/ui/Logo'
import React from 'react'

function Header() {
    return (
        <div className='bg-slate-950 text-white flex justify-between items-center px-2 py-4 shadow-lg'>
            <Logo/>
            <Button className='bg-green-400 text-black font-semibold'>Get Started</Button>
        </div>
    )
}

export default Header