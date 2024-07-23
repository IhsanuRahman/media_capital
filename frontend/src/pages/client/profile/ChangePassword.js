import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import api from '../../../axios'
import { checkAuth, logout } from '../../../features/user'

function ChangePassword() {
  
    const [alert, setAlert] = useState('')
    const [spinner, setSpinner] = useState(false)
    const dispatch =useDispatch()
    const navigator = useNavigate()
    const [errors, setErrors] = useState({
        old_password: '',
        new_password: '',
        confirm_password: '',
    })
    const [userData, setUserData] = useState({
        old_password: '',
        new_password: '',
        confirm_password: '',
    })
    const handleinput = (e) => {
        setUserData({ ...userData, [e.target.name]: e.target.value })
    }
    const handleSubmit = () => {
        setSpinner(true)
        let is_valid=true
        if (userData.old_password === '' || userData.old_password === null) {
            errors.old_password = 'old password is required'
            is_valid=false
        } else {
            errors.old_password = ''
        }
        if (userData.new_password === '' || userData.new_password === null) {
            errors.new_password = 'password is required'
            is_valid=false
        } else {
            errors.new_password = ''
        }
        if (userData.confirm_password === '' || userData.confirm_password === null) {
            errors.confirm_password = 'password is required'
            is_valid=false
        } else {
            errors.confirm_password = ''
        }
        if (userData.confirm_password.trim() === '') {
            errors.confirm_password = 'confirm password is required'
            is_valid=false
            
        } else {
            errors.confirm_password = ''
        }
        if (userData.new_password!==userData.confirm_password){
            errors.confirm_password ='passwords are not match'
            is_valid=false
        }
        setErrors({ ...errors })
        if (is_valid) {
            api.put('/profile/change-password', userData,{
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('access')}`,
                },
            

            }).then((e) => {
                setSpinner(false)
                dispatch(logout())
                navigator('/login')
                
            }).catch(e => {
             setAlert(e.response.data.message)
             setSpinner(false)
             
            })
        }else{

            setSpinner(false) 
        }
    }
    
    return (
        <div className=" d-flex flex-column  align-items-center  m-0 h-100" >
            {alert &&<div className="alert alert-danger alert-dismissible fade show pe-0" role="alert">
                {alert}
                <button className='btn mt-auto ' type="button" data-dismiss="alert" aria-label="Close"
                 onClick={_=>setAlert('')}
                >
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>}
            <h1 className="mt-5 pt-5 mb-5 fw-bold ">change password </h1>
            <div className='col-sm-8 col-md-7 col-10 flex-column d-flex pt-4 rounded-4 align-items-center' style={{ backgroundColor: '#494949', minHeight: '400px' }}>
                <div className='col-sm-8 col-md-8  col-10 flex-column d-flex   align-items-center'>
                    <h3 className='pb-5 fw-bold  '></h3>
                    <input type="password" onChange={handleinput} name="old_password" id="" className='form-control w-100  bg-black border-black greayholder' placeholder='old password' style={{ color: '#ffff', height: '40px' }} />
                    {errors.old_password !== '' && <li className="text-danger ms-2">{errors.old_password}</li>}
                    <input type="password" onChange={handleinput} name="new_password" id="" className='form-control w-100 mt-4 bg-black border-black greayholder' placeholder='new password' style={{ color: '#fff', height: '40px' }} />
                    {errors.new_password !== '' && <li className="text-danger ms-2">{errors.new_password}</li>}
                    <input type="password" onChange={handleinput} name="confirm_password" id="" className='form-control w-100 mt-4 bg-black border-black greayholder' placeholder='confirm password' style={{ color: '#fff', height: '40px' }} />
                    {errors.confirm_password !== '' && <li className="text-danger ms-2">{errors.confirm_password}</li>}
                   <button className="w-75 mt-5 me-auto ms-auto mb-5 rounded fw-bold text-white border-0 " style={{ backgroundColor: '#233543', height: '40px', fontSize: '20px' }}
                        onClick={handleSubmit}
                    >
                      {spinner? <span className="spinner-border" aria-hidden="true"></span>:'submit'}
                    </button>
                </div>
            </div>

        </div>
    )
}

export default ChangePassword
