import React, { useEffect, useRef, useState } from 'react'
import '../style.css'
import { useNavigate } from 'react-router-dom'
import api from "../../../axios"
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { checkAuth, setAuthed } from '../../../features/user'
function Login() {
    const PopupController = useRef()
    const [alert, setAlert] = useState('')
    const dispatch =useDispatch()
    const navigator = useNavigate()
    const [errors, setErrors] = useState({
        username: '',
        password: '',
    })
    const [userData, setUserData] = useState({
        username: '',
        password: '',
    })
    const handleinput = (e) => {
        setUserData({ ...userData, [e.target.name]: e.target.value })
    }
    const handleSubmit = () => {
        if (userData.username === '' || userData.username === null) {
            errors.username = 'username is required'
        } else {
            errors.username = ''
        }
        if (userData.password === '' || userData.password === null) {
            errors.password = 'password is required'
        } else {
            errors.password = ''
        }
        setErrors({ ...errors })
        if (errors.username === '' && errors.password === '') {
            api.post('/login', userData).then((e) => {
                console.log(e);
                localStorage.setItem('access', e.data.access)
                localStorage.setItem('refresh', e.data.refresh)
                PopupController.current.style.display = 'block'
                PopupController.current.style.fillOpacity = '0.5'
                PopupController.current.style.opacity = '1'
                
            }).catch(e => {
             setAlert(e.response.data.detail)
             console.log(e.response.data.detail);
             
            })
        }
    }
    const { isAuthenticated, user, loading } = useSelector(state => state.user)
    useEffect(() => {
        if (isAuthenticated && !loading ) {
          return navigator('/')
        }
      })
    const Popup = (
        <>
            <div className={"modal fade show bg-white bg-opacity-25 p-5"} ref={PopupController} tabIndex="-1" role="dialog" aria-labelledby="mySmallModalLabel" aria-hidden="false" >
                <div style={{ top: '0', transition: 'top 2s ease 0s', }} className={`modal-dialog modal-sm   w-25  h-100 `}>
                    <div className="modal-content text-dark p-5">
                        <p>Login Success</p>
                        <button className="btn btn-success" onClick={_ => {
                dispatch(setAuthed())
                            dispatch(checkAuth())
                            PopupController.current.children[0].style.top = '0px'
                            PopupController.current.style.display = 'none'
                            PopupController.current.style.fillOpacity = '0'
                            PopupController.current.style.opacity = '0'
                            return navigator('/')

                        }}>ok</button>
                    </div>
                </div>

            </div>

        </>
    )
    return (
        <div className=" d-flex flex-column  align-items-center  m-0 h-100" >
            {alert &&<div class="alert alert-danger alert-dismissible fade show pe-0" role="alert">
                {alert}
                <button className='btn mt-auto ' type="button" data-dismiss="alert" aria-label="Close"
                 onClick={_=>setAlert('')}
                >
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>}
            {Popup}
            <h1 className="mt-5 pt-5 mb-5 fw-bold ">Welcome back </h1>
            <div className='col-sm-8 col-md-7 col-10 flex-column d-flex pt-4 rounded-4 align-items-center' style={{ backgroundColor: '#494949', height: '400px' }}>
                <div className='col-sm-8 col-md-8  col-10 flex-column d-flex   align-items-center'>
                    <h3 className='pb-5 fw-bold  '>Login</h3>
                    <input type="text" onChange={handleinput} name="username" id="" className='form-control w-100  bg-black border-black greayholder' placeholder='username' style={{ color: '#ffff', height: '40px' }} />
                    {errors.username !== '' && <li className="text-danger ms-2">{errors.username}</li>}
                    <input type="password" onChange={handleinput} name="password" id="" className='form-control w-100 mt-4 bg-black border-black greayholder' placeholder='password' style={{ color: '#fff', height: '40px' }} />
                    {errors.password !== '' && <li className="text-danger ms-2">{errors.password}</li>}
                    <p className="text-primary text-start align-items-start mb-0 mt-2 w-100" style={{ cursor: 'pointer' }} onClick={_ => navigator('/signup')}>create new account?</p>
                    <p className="text-primary text-start align-items-start w-100" style={{ cursor: 'pointer' }} >fogot password?</p>
                    <button className="w-75  me-auto ms-auto rounded fw-bold text-white border-0 " style={{ backgroundColor: '#233543', height: '40px', fontSize: '20px' }}
                        onClick={handleSubmit}
                    >login</button>
                </div>
            </div>

        </div>
    )
}

export default Login
