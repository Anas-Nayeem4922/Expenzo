import React from 'react'

    function Logo({auth = false} : {auth ?: boolean}) {
    return (
        <div className='cursor-pointer flex items-center ml-3'>
            <img className='h-12 w-12' src="https://www.thegreatapps.com/application/upload/Apps/2017/03/expense-manager-22.png" alt="" />
            <p className={`text-2xl font-extrabold ml-2`}>Expenzo</p>
        </div>
    )
}

export default Logo