import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import '../style.css'
import { useNavigate } from 'react-router-dom'
import api from "../../../axios"
import { useSelector } from 'react-redux'
import { useTimer } from 'react-timer-hook';
function OTPPage({ apiUrl, redirection, keyName, success, resendUrl }) {
    const [alert, setAlert] = useState('')
    const [OTP, setOTP] = useState('')
    const [resendSpin, setResendSpin] = useState(false)
    const [sendSpin, setSendSpin] = useState(false)
    const navigator = useNavigate()
    const handleSubmit = () => {
        setSendSpin(true)
        api.post(apiUrl, { 'otp': OTP, 'token': localStorage.getItem(keyName) },{headers:{'Authorization':''}},).then(e => {
            console.log(e);
            localStorage.removeItem(keyName)
            navigator(redirection)
            success(e)
            setSendSpin(false)
        }).catch(e => {
            try {
                setAlert(e.response.data.message)
            }
            catch {
                setAlert(e.response)
            }
            setSendSpin(false)
        })
    }
    const { isAuthenticated, user, loading } = useSelector(state => state.user)
    useEffect(() => {
        if (localStorage.getItem(keyName) === null) {
            return navigator('/')

        }
        if (isAuthenticated && !loading) {
            return navigator('/')
        }

    })

    const now = new Date();
    
    const oneMinuteFromNow = useCallback(() =>  Date(now.getTime() + 60000, []))
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
                            if (true) {
                                setResendSpin(true)
                                api.post(resendUrl, { 'otp': OTP, 'token': localStorage.getItem(keyName), },{headers:{'Authorization':''}}).then(e => {
                                    
                                    const now = new Date();
                                    const oneMinuteFromNow = new Date(now.getTime() + 60000);
                                    restart(oneMinuteFromNow, true)
                                    setClr(' text-muted ')
                                    setResendSpin(false)

                                }).catch(e => {
                                    console.log(e);
                                    try {
                                        setAlert(e.response.data.message)
                                    }
                                    catch {
                                        setAlert(e.response.data.detail)
                                    }
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
