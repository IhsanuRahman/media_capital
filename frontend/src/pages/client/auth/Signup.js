import React, { useEffect, useRef, useState, useTransition } from "react"
import api from "../../../axios"
import SignupValidator from "./helpers/Validations"
import { useNavigate } from 'react-router-dom';
import { useSelector } from "react-redux";
function Signup() {
  const { isAuthenticated, user, loading } = useSelector(state => state.user)
  const navigator = useNavigate()
  useEffect(() => {
      if (isAuthenticated && !loading) {
        return navigator('/')
      }
    })
  const PopupControler = useRef()
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
  const submit = () => {
    if (SignupValidator(errors, userData)) {
      api.post(
        '/signup',
        userData
      ).then(e => {
          PopupControler.current.style.display = 'block'
          PopupControler.current.style.fillOpacity = '0.5'
          PopupControler.current.style.opacity = '1'

      }).catch(e => {
        if (e.response.status == 403) {
          const serverErrors = e.response.data
          Object.entries(serverErrors).map(([k, v]) => {

            console.log(k, v, 'hai')
          })

          setErrors({ ...errors, ...serverErrors })
        } 
      })
    } else
      setErrors({ ...errors })


  }
  const handleinput = (e) => {
    setData({ ...userData, [e.target.name]: e.target.value })
  }
  const Popup = (
    <>
      <div className={"modal fade show bg-white bg-opacity-25 p-5"} ref={PopupControler} tabIndex="-1" role="dialog" aria-labelledby="mySmallModalLabel" aria-hidden="false" >
        <div  style={{ top: '0', transition: 'top 2s ease 0s', }} className={`modal-dialog modal-sm   w-25  h-100 `}>
          <div className="modal-content text-dark p-5">
            <p>Login Success</p>
            <button className="btn btn-success" onClick={_ => {
              PopupControler.current.children[0].style.top = '0px'
              PopupControler.current.style.display = 'none'
              PopupControler.current.style.fillOpacity = '0'
              PopupControler.current.style.opacity = '0'
              navigator('/login')
            }}>ok</button>
          </div>
        </div>

      </div>
     
      </>
  )
  return (

    <div className=" d-flex flex-column  align-items-center   m-0 h-100" >
    
      {Popup}
      <h1 className="mt-5 pt-5 mb-5 fw-bold  ">Welcome to Media Capital</h1>
      <div className=" flex-column d-flex  justify-content-between   mt-5  col-sm-8 col-md-6  col-10" style={{ height: '450px', }}>
        <input type="text" name="username" id="" className="form-control fw-bold " placeholder="Username" value={userData.username}
          onChange={handleinput}
        />
        {errors.username !== '' && <li className="text-danger ms-2">{errors.username}</li>}
        <div className="d-flex justify-content-between  w-100 ">
          <div className="d-flex flex-column me-1  w-50">
            <input type="text" name="first_name" className="form-control fw-bold w-100" placeholder="First Name" value={userData.first_name}
              onChange={handleinput}
            />
            {errors.first_name !== '' && <li className="text-danger ms-2">{errors.first_name}</li>}
          </div>
          <div className="d-flex flex-column ms-1  w-50">
            <input type="text" name="last_name" className="form-control fw-bold  w-100" placeholder="Last Name" value={userData.last_name}
              onChange={handleinput} />

            {errors.last_name !== '' && <li className="text-danger ms-2">{errors.last_name}</li>}
          </div>
        </div>
        <input type="email" name="email" className="form-control fw-bold" placeholder="Email" value={userData.email}
          onChange={handleinput} />
        {errors.email !== '' && <li className="text-danger ms-2">{errors.email}</li>}
        <input type="date" name="dob" id="" className="form-control fw-bold " style={{ minHeight: '35px' }} value={userData.dob}
          onChange={handleinput} />
        {errors.dob !== '' && <li className="text-danger ms-2">{errors.dob}</li>}
        <input type="password" name="password" className="form-control fw-bold" placeholder="Password" value={userData.password}
          onChange={handleinput} />
        {errors.password !== '' && <li className="text-danger ms-2">{errors.password}</li>}
        <input type="password" name="conform_password" className="form-control fw-bold" placeholder="Conform Password" value={userData.conform_password}
          onChange={handleinput} />

        {errors.conform_password !== '' && <li className="text-danger ms-2">{errors.conform_password}</li>}
        <p className="text-primary" style={{ cursor: 'pointer' }} onClick={_ => navigator('/login')}>already have account?</p>
        <button className="w-50  me-auto ms-auto rounded fw-bold text-white border-0 " style={{ backgroundColor: '#233543', height: '35px' }}
          onClick={submit}
        >Sign up</button>
      </div>
    </div>
  )
}

export default Signup
