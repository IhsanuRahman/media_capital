import React, { useEffect, useState } from "react"
import api from "../../../axios"
import SignupValidator from "./helpers/Validations"
import { useNavigate } from 'react-router-dom';
import { useSelector } from "react-redux";
function Signup() {
  const { isAuthenticated, loading } = useSelector(state => state.user)
  const [sending, setSending] = useState(false)
  const navigator = useNavigate()
  useEffect(() => {
    if (isAuthenticated && !loading) {
      return navigator('/')
    }
  })
  const [userData, setData] = useState({
    username: '',
    first_name: '',
    last_name: '',
    email: '',
    dob: '',
    password: '',
    conform_password: ''
  })
  const [errors, setErrors] = useState({
    username: '',
    first_name: '',
    last_name: '',
    email: '',
    dob: '',
    password: '',
    conform_password: ''
  })
  const today = new Date()
  const submit = () => {
    setSending(true)
    if (SignupValidator(errors, userData)) {
      api.post(
        '/signup',
        userData,{headers:{'Authorization':''}}
      ).then(e => {
        console.log(e);
        localStorage.setItem('RToken', e.data.token)
        navigator('/verify-email')
        setSending(false)

      }).catch(e => {
        if (e.response.status === 403) {
          const serverErrors = e.response.data

          console.log(e)
          setErrors({ ...errors, ...serverErrors })
        }
        setSending(false)
      })
    } else {
      setErrors({ ...errors })
      setSending(false)
    }
  }
  const handleinput = (e) => {
    setData({ ...userData, [e.target.name]: e.target.value })
    setErrors({ ...errors, [e.target.name]: '' })
  }
  return (

    <div className=" d-flex flex-column  align-items-center   m-0 h-100" >

      <h1 className="mt-5 pt-5 mb-5 fw-bold  ">Welcome to Media Capital</h1>
      <div className=" flex-column d-flex  justify-content-between   mt-5  col-sm-8 col-md-6  col-10" style={{ height: '450px', }}>
        <input type="text" name="username" id="" className="form-control fw-bold " placeholder="Username" value={userData.username}
          onChange={handleinput}
          onBlur={_ => {
            if (userData.username.trim() === '') {
              errors.username = 'username is required'
            }
            else {
              if (userData.username.trim().includes(' ')) {
                errors.username = 'space is not allowed in username'
              } else {
                console.log(errors.username);
                if (userData.username.length > 15) {
                  errors.username = 'only maximum 15 chacters is allowed in username'
                } else
                  errors.username = ''
              }
            }
            setErrors({ ...errors })
          }}
        />
        {errors.username !== '' && <li className="text-danger ms-2">{errors.username}</li>}
        <div className="d-flex justify-content-between  w-100 ">
          <div className="d-flex flex-column me-1  w-50">
            <input type="text" name="first_name" className="form-control fw-bold w-100" placeholder="First Name" value={userData.first_name}
              onChange={handleinput}
              onBlur={
                _ => {
                  if (userData.first_name.trim() === '') {
                    errors.first_name = 'first name is required'
                  } else {
                    if (userData.first_name.length > 15) {
                      errors.first_name = 'only maximum 15 chacters is allowed in first name'
                    } else
                      errors.first_name = ''
                  }
                  setErrors({ ...errors })
                }
              }
            />
            {errors.first_name !== '' && <li className="text-danger ms-2">{errors.first_name}</li>}
          </div>
          <div className="d-flex flex-column ms-1  w-50">
            <input type="text" name="last_name" className="form-control fw-bold  w-100" placeholder="Last Name" value={userData.last_name}
              onChange={handleinput}
              onBlur={_ => {
                if (userData.last_name.trim() === '') {
                  errors.last_name = 'last name is required'
                } else {
                  if (errors.last_name.length > 15) {
                    errors.last_name = 'only maximum 15 chacters is allowed in last name'
                  } else
                    errors.last_name = ''
                }
                setErrors({ ...errors })
              }} />
            {errors.last_name !== '' && <li className="text-danger ms-2">{errors.last_name}</li>}
          </div>
        </div>
        <input type="email" name="email" className="form-control fw-bold" placeholder="Email" value={userData.email}
          onChange={handleinput}
          onBlur={_ => {
            if (userData.email.trim() === '') {
              errors.email = 'email is required'
            } else {
              const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
              if (!regex.test(userData.email.trim())) {
                errors.email = 'enter a valid email'
              } else if (userData.email.length < 5) {
                errors.email = 'minimum 5 chacters need in email'
              } else {
                errors.email = ''
              }
            }
            setErrors({ ...errors })
          }} />
        {errors.email !== '' && <li className="text-danger ms-2">{errors.email}</li>}
        <input type="date" name="dob" id="" className="form-control fw-bold " max={`${today.getFullYear() + '-' + ((today.getMonth()) < 10 ? '0' + today.getMonth() : today.getMonth()) + '-' + ((today.getDate()) < 10 ? '0' + today.getDate() : today.getDate())}`} style={{ minHeight: '35px' }} value={userData.dob}
          onChange={handleinput}
          onBlur={_ => {

            if (userData.dob === '' || userData.dob === null) {
              errors.dob = 'date of birth is required'
            } else {
              errors.dob = ''
            }
            setErrors({ ...errors })
          }} />
        {errors.dob !== '' && <li className="text-danger ms-2">{errors.dob}</li>}
        <input type="password" name="password" className="form-control fw-bold" placeholder="Password" value={userData.password}
          onChange={handleinput}
          onBlur={_ => {
            if (userData.password.trim() === '') {
              errors.password = 'password is required'
            } else {
              errors.password = ''
            }
            setErrors({ ...errors })
          }} />
        {errors.password !== '' && <li className="text-danger ms-2">{errors.password}</li>}
        <input type="password" name="conform_password" className="form-control fw-bold" placeholder="Conform Password" value={userData.conform_password}
          onChange={handleinput}
          onBlur={_ => {
            if (userData.conform_password.trim() === '') {
              errors.conform_password = 'conform password is required'

            } else {
              errors.conform_password = ''
            }
            if (userData.password !== userData.conform_password) {
              errors.conform_password = 'passwords are not match'

            }
            setErrors({ ...errors })
          }} />

        {errors.conform_password !== '' && <li className="text-danger ms-2">{errors.conform_password}</li>}
        <p className="text-primary" style={{ cursor: 'pointer' }} onClick={_ => navigator('/login')}>already have account?</p>
        <button className="w-50  me-auto ms-auto rounded fw-bold text-white border-0 " style={{ backgroundColor: '#233543', height: '35px' }}
          onClick={submit}
        >{sending ?
          <div className="spinner-border" role="status">
          </div>
          : 'Sign up'}</button>
      </div>
    </div>
  )
}

export default Signup
