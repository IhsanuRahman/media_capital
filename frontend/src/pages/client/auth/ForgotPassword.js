import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../../../axios'
import { useSelector } from 'react-redux'

function ForgotPassword() {
    const [alert, setAlert] = useState('')
    const [spinner, setSpinner] = useState(false)
    const [email, setEmail] = useState('')
    const navigator = useNavigate()
    
    
    const handleSubmit = () => {
        setSpinner(true)
            api.post('/forgot-password',{'email':email}).then((e) => {
                console.log(e.data.token);
                localStorage.setItem('FStoken',e.data.token)
                setSpinner(false)
                navigator('/forgotpassword/verify-email')
                
            }).catch(e => {
             setAlert(e.response.data.message)
             setSpinner(false)
             console.log(e.response.data.detail);
             
            })
            
       
    }
    const { isAuthenticated, user, loading } = useSelector(state => state.user)
    useEffect(() => {
        if (isAuthenticated && !loading ) {
          return navigator('/')
        }
      })
    
    return (
        <div className=" d-flex flex-column  align-items-center  m-0 h-100" >
            {alert &&<div class="alert alert-danger alert-dismissible fade show pe-0 w-75 d-flex align-items-center justify-content-between " role="alert">
                {alert}
                <button className='btn mt-auto me-0' type="button" data-dismiss="alert" aria-label="Close"
                 onClick={_=>setAlert('')}
                >
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>}
            <h1 className="mt-5 pt-5 mb-5 fw-bold ">Forgot Password </h1>
            <div className='col-sm-8 col-md-7 col-10 flex-column d-flex pt-4 rounded-4 align-items-center' style={{ backgroundColor: '#494949', height: '400px' }}>
                <div className='col-sm-8 col-md-8  col-10 flex-column d-flex   align-items-center'>
                    <h3 className='pb-5 fw-bold'>enter email</h3>
                    
                    <input type="email" value={email} onChange={e=>setEmail(e.target.value)} name="email" id="" className='form-control w-100 mt-4 bg-black border-black greayholder' placeholder='email' style={{ color: '#fff', height: '40px' }} />
                    <p className="text-primary text-start align-items-start mb-0 mt-2 w-100" style={{ cursor: 'pointer' }} onClick={_ => navigator('/login')}>back to login</p>
                    <button className="w-75  me-auto ms-auto rounded fw-bold text-white border-0 mt-3" style={{ backgroundColor: '#233543', height: '40px', fontSize: '20px' }}
                        onClick={handleSubmit}
                    >
                      {spinner? <span class="spinner-border" aria-hidden="true"></span>:'submit'}
                    </button>
                </div>
            </div>

        </div>
    )
}

export default ForgotPassword
