import React, { useEffect, useState } from 'react'
import '../styles.css'
import Header from '../../../componets/admin/Header'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import api from '../../../axios'
import { checkAuth, setAuthed } from '../../../features/user'
function AdminLogin() {
    const [alert, setAlert] = useState('')
    const dispatch =useDispatch()
    const navigator = useNavigate()
    const { isAuthenticated, user, loading } = useSelector(state => state.user)
    useEffect(() => {
        if (isAuthenticated && !loading && user.is_staff === true) {
            return navigator('/admin')
        }
    })
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
            api.post('admin/login', userData).then((e) => {
                localStorage.setItem('access', e.data.access)
                localStorage.setItem('refresh', e.data.refresh)
                dispatch(setAuthed())
                            dispatch(checkAuth())
                
            }).catch(e => {
                setAlert(e.response.data.detail)

            })
        }
    }
    return (
        <div className='bg-main text-dark d-flex flex-column  justify-content-center align-items-center' style={{ height: '100%', weight: '100%' }}>
            <Header />
            {alert && <div className="alert alert-danger alert-dismissible fade show pe-0" role="alert">
                {alert}
                <button className='btn mt-auto ' type="button" data-dismiss="alert" aria-label="Close"
                    onClick={_ => setAlert('')}
                >
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>}
            <div className='col-4 flex-column d-flex pt-4 rounded-3 align-items-center border-dark border' style={{ height: '500px' }} >

                <h2 className='mt-auto fw-bold text-main' >Login</h2>
                <div className='w-100 ps-5 pe-5 mt-auto'>
                    <label for="username">Username</label>
                    <input type="text" name='username' onChange={handleinput} className="form-control border-black bg-main" id="username" aria-describedby="emailHelp" placeholder="Enter Username"></input>
                    {errors.username !== '' && <li className="text-danger ms-2">{errors.username}</li>}
                </div>
                <div className='w-100 ps-5 pe-5 mt-3 mb-auto'>
                    <label for="password">Password</label>
                    <input type="password" name='password' onChange={handleinput}  className="form-control border-black bg-main" id="password" aria-describedby="emailHelp" placeholder="Enter Password"></input>
                    {errors.password !== '' && <li className="text-danger ms-2">{errors.password}</li>}
                </div>
                <button className='btn-success btn w-25 ms-auto me-3 mb-5 mt-auto' onClick={handleSubmit}>Login</button>
            </div>
        </div>
    )
}

export default AdminLogin
