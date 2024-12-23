import Logo from '@/components/Logo'
import React, { ReactNode } from 'react'

    function layout({children} : {children : ReactNode}) {
    return (
        <div className='bg-slate-200 relative flex h-screen w-full flex-col items-center justify-center'>
            <Logo auth={true}/>
            <div className='mt-12'>{children}</div>
        </div>
    )
}

export default layout