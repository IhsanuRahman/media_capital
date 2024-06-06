import React, { useState } from 'react'
import api from '../../../axios'
import { useNavigate } from 'react-router-dom'

function EditEmail() {

    const [alert, setAlert] = useState('')
    const [input, setInput] = useState('')
    const [spinner, setSpinner] = useState(false)
    const navigator=useNavigate()
    localStorage.removeItem('EETokenTime')
    localStorage.removeItem('EETokenTime')
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
            <h1 className="mt-5 pt-5 mb-5 fw-bold ">Edit Email </h1>
            <div className='col-sm-8 col-md-7 col-10 flex-column d-flex pt-4 rounded-4 align-items-center' style={{ backgroundColor: '#494949', height: '300px' }}>
                <div className='col-sm-8 col-md-8  col-10 flex-column d-flex h-75    align-items-center'>
                    <h3 className='pb-5 fw-bold  '>enter new email</h3>
                    <input type="email" value={input} onChange={e => { setInput(e.target.value) }} name="email" id="" className='form-control w-100  bg-black border-black greayholder' placeholder='email' style={{ color: '#ffff', height: '40px' }} />

                    <button className="w-75 mt-auto me-auto ms-auto rounded fw-bold text-white border-0 " style={{ backgroundColor: '#233543', height: '40px', fontSize: '20px' }}
                        onClick={_ => {
                            if (!spinner){
                            setSpinner(true)
                            api.patch('profile/edit-email', {
                                email: input
                            }, {
                                headers: {
                                    'Content-Type': 'application/json',
                                    'Authorization': `Bearer ${localStorage.getItem('access')}`,

                                },
                            }
                            )
                            .then(resp=>{
                                console.log(resp)
                                localStorage.setItem('EEToken',resp.data.token)
                                navigator('/profile/change-email/verify')
                                setSpinner(false)
                            })
                            .catch(e=>{
                                console.log(e)
                                setAlert(e.response.data.message)
                                setSpinner(false)
                            })}
                        }}
                    >
                        {spinner ? <span class="spinner-border" aria-hidden="true"></span> : 'submit'}
                    </button>
                </div>
            </div>

        </div>
    )
}

export default EditEmail
