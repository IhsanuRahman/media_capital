import React from 'react'

function Header({leading,trailing}) {
    return (
        <div className='bg-main fixed-top border-bottom border-dark d-flex w-100' style={{ height: '50px' }}>
            <div className='' style={{ width: '3%' }}>
                {leading}
            </div>
            <h3 className='mt-auto mb-1 text-main '>Admin</h3>
            <div className="ms-auto me-2 p-1 d-flex ">
                {trailing}
            </div>
        </div>
    )
}

export default Header
