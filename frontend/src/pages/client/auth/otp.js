import React, { useEffect, useRef, useState } from 'react'
import '../style.css'
import { useNavigate } from 'react-router-dom'
import api from "../../../axios"
import { useSelector } from 'react-redux'
import { useTimer } from 'react-timer-hook';
function OTPPage() {
    const PopupController = useRef()
    const [alert, setAlert] = useState('')
    const [OTP, setOTP] = useState('')
    const [resendSpin, setResendSpin] = useState(false)
    const [sendSpin, setSendSpin] = useState(false)
    const navigator = useNavigate()
    const handleSubmit = () => {
        setSendSpin(true)
        api.post('/otp/send', { 'otp': OTP, 'token': localStorage.getItem('token') },).then(e => {
            console.log(e);
            localStorage.removeItem('token')
            navigator('/login')
            setSendSpin(false)
        }).catch(e => {
            setAlert(e.response.data.message)
            setSendSpin(false)
        })
    }
    const { isAuthenticated, user, loading } = useSelector(state => state.user)
    useEffect(() => {
        if (localStorage.getItem('token') === null) {
            return navigator('/')

        }
        if (isAuthenticated && !loading) {
            return navigator('/')
        }
    })
    const Popup = (
        <>
            <div className={"modal fade show bg-white bg-opacity-25 p-5"} ref={PopupController} tabIndex="-1" role="dialog" aria-labelledby="mySmallModalLabel" aria-hidden="false" >
                <div style={{ top: '0', transition: 'top 2s ease 0s', }} className={`modal-dialog modal-sm   w-25  h-100 `}>
                    <div className="modal-content text-dark p-5">
                        <p>OTP verification Success</p>
                        <button className="btn btn-success" onClick={_ => {

                            PopupController.current.children[0].style.top = '0px'
                            PopupController.current.style.display = 'none'
                            PopupController.current.style.fillOpacity = '0'
                            PopupController.current.style.opacity = '0'
                            return navigator('/login')

                        }}>ok</button>
                    </div>
                </div>

            </div>

        </>
    )
    console.log(Date.parse('0000-01-01 00:00:10',));
    const now = new Date();
    const oneMinuteFromNow = new Date(now.getTime() + 60000);
    const [resendClr, setClr] = useState(' text-muted ');

    const {
        seconds,
        minutes,
        restart,
    } = useTimer({
        expiryTimestamp: oneMinuteFromNow, autoStart: true, onExpire: () => setClr(' text-primary')
    });


    return (
        <div className=" d-flex flex-column  align-items-center  m-0 h-100" >
            {alert && <div class="alert alert-danger alert-dismissible fade show pe-0" role="alert">
                {alert}
                <button className='btn mt-auto ' type="button" data-dismiss="alert" aria-label="Close"
                    onClick={_ => setAlert('')}
                >
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>}
            {Popup}
            <h1 className="mt-5 pt-5 mb-5 fw-bold "> </h1>
            <div className='col-sm-8 col-md-7 col-10 flex-column d-flex pt-4 rounded-4 align-items-center' style={{ backgroundColor: '#494949', height: '400px' }}>
                <div className='col-sm-8 col-md-8  col-10 flex-column d-flex   align-items-center'>
                    <h3 className='pb-5 fw-bold  '>Enter OTP</h3>
                    <input type="number" value={OTP} max={6} onChange={e => {
                        if (e.target.value < 999999)
                            setOTP(e.target.value)
                    }} name="OTP" id="" className='form-control w-100  bg-black border-black greayholder' placeholder='OTP' style={{ color: '#ffff', height: '40px' }} />

                    <p className={`d-inline  text-start align-items-start w-100 ${resendClr}`} style={{ cursor: 'pointer' }}
                        onClick={e => {
                            if (resendClr.trim() !== 'text-muted') {
                            setResendSpin(true)
                                api.post('/otp/resend', { 'otp': OTP, 'token': localStorage.getItem('token') },).then(e => {
                                    const now = new Date();
                                    const oneMinuteFromNow = new Date(now.getTime() + 60000);
                                    restart(oneMinuteFromNow, true)
                                    setClr(' text-muted ')
                                    setResendSpin(false)

                                }).catch(e => {
                                    setAlert(e.response.data.message)
                                    setResendSpin(false)
                                })
                            }
                        }}
                    >{resendSpin ? <>
                        <div class="spinner-border text-primary spinner-border-sm mt-2 " role="status">

                        </div> <span class="text-primary " role="status">resending...</span></> : 'resend in (' + minutes + ':' + seconds + ')'}  </p>
                    <button className="w-75  me-auto ms-auto rounded fw-bold text-white border-0 " style={{ backgroundColor: '#233543', height: '40px', fontSize: '20px' }}
                        onClick={handleSubmit}
                    >{sendSpin ? <><span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                        <span class="sr-only">&nbsp;Loading...</span></> : 'Send'}</button>
                </div>
            </div>

        </div>
    )
}

export default OTPPage
