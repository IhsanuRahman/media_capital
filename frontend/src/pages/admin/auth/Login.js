import React from 'react'
import '../styles.css'
import Header from '../../../componets/admin/Header'
function AdminLogin() {
    return (
        <div className='bg-main text-dark d-flex justify-content-center align-items-center' style={{ height: '100%', weight: '100%' }}>
            <Header/>
            <div className='col-4 flex-column d-flex pt-4 rounded-3 align-items-center border-dark border' style={{ height: '500px' }} >
                <h2 className='mt-auto fw-bold text-main' >Login</h2>
                <div className='w-100 ps-5 pe-5 mt-auto'>
                    <label for="username">Username</label>
                    <input type="text" class="form-control border-black bg-main" id="username" aria-describedby="emailHelp" placeholder="Enter Username"></input>
                </div>
                <div className='w-100 ps-5 pe-5 mt-3 mb-auto'>
                    <label for="password">Password</label>
                    <input type="password" class="form-control border-black bg-main" id="password" aria-describedby="emailHelp" placeholder="Enter Password"></input>
                </div>
                <button className='btn-success btn w-25 ms-auto me-3 mb-5 mt-auto'>Login</button>
            </div>
        </div>
    )
}

export default AdminLogin
