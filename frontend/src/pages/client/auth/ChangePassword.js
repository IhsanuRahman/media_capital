import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../../axios'
import { useSelector } from 'react-redux'

function ChangePassword() {
    const [alert, setAlert] = useState('')
    const [spinner, setSpinner] = useState(false)
    const navigator = useNavigate()
    const [newPassword, setNewPassword] = useState('')
    const [cnfrmPassword, setCnfrmPassword] = useState('')
    const handleSubmit = () => {
        setSpinner(true)
        if (newPassword.trim().length===0 || cnfrmPassword.trim().length===0){
            setAlert('all fields are required please specify it.')
            setSpinner(false)
        }else if (newPassword.trim().length<6){
            setAlert('password needs atleast 6 characters')
            setSpinner(false)
        }
        if (newPassword.trim() !== cnfrmPassword.trim()){
            setAlert('passwords are not match')
            setSpinner(false)
        }
        if (alert == '') {
            api.post('/forgot-password/change', {
                'token': localStorage.getItem('FStoken'),
                'password': newPassword.trim(),
                headers:{'Authorization':''}
            }).then((e) => {
                console.log(e);
                navigator('/')
                setSpinner(false)

            }).catch(e => {
                setAlert(e.response.data.message)
                setSpinner(false)
                console.log(e.response.data.detail);

            })
        }
    }
    const { isAuthenticated, user, loading } = useSelector(state => state.user)
    useEffect(() => {
        if (localStorage.getItem('FStoken') === null) {
            return navigator('/')

        }
        if (isAuthenticated && !loading) {
            return navigator('/')
        }
        return()=>{
            localStorage.removeItem('FStoken')
        }
    })
    return (
        <div className=" d-flex flex-column  align-items-center  m-0 h-100" >
            {alert && <div class="alert alert-danger alert-dismissible fade show pe-0 w-75 d-flex align-items-center justify-content-between " role="alert">
                {alert}
                <button className='btn mt-auto me-0' type="button" data-dismiss="alert" aria-label="Close"
                    onClick={_ => setAlert('')}
                >
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>}
            <h1 className="mt-5 pt-5 mb-5 fw-bold ">Forgot Password </h1>
            <div className='col-sm-8 col-md-7 col-10 flex-column d-flex pt-4 rounded-4 align-items-center' style={{ backgroundColor: '#494949', height: '400px' }}>
                <div className='col-sm-8 col-md-8  col-10 flex-column d-flex   align-items-center'>
                    <h3 className='pb-5 fw-bold'>enter new password</h3>

                    <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} name="password" className='form-control w-100 mt-4 bg-black border-black greayholder' placeholder='new password' style={{ color: '#fff', height: '40px' }} />
                    <input type="password" value={cnfrmPassword} onChange={e => setCnfrmPassword(e.target.value)} name="password" className='form-control w-100 mt-4 bg-black border-black greayholder' placeholder='conform password' style={{ color: '#fff', height: '40px' }} />

                    <button className="w-75  me-auto ms-auto rounded fw-bold text-white border-0 mt-3" style={{ backgroundColor: '#233543', height: '40px', fontSize: '20px' }}
                        onClick={handleSubmit}
                    >
                        {spinner ? <span class="spinner-border" aria-hidden="true"></span> : 'submit'}
                    </button>
                </div>
            </div>

        </div>
    )
}

export default ChangePassword
