import React, { useEffect, useRef, useState } from 'react'
import api from '../../axios'
import { baseUrl } from '../../constants'
import { useNavigate } from 'react-router-dom'
import {Toast} from 'bootstrap'
import Notification from './Notification'
function Notifications() {
    const [notifications, setNotifications] = useState([])
    const navigate = useNavigate()
    const toastRef = useRef()
    const [msg, setMsg] = useState('')
    useEffect(()=>{
        if (msg!==''){
            const toastLiveExample = toastRef.current
            const toastBootstrap = Toast.getOrCreateInstance(toastLiveExample)
            
            toastBootstrap.show()}
    },[msg])
    // const [selectOption, setSelectOption] = useState('none')
    // const [selectedList, setSelected] = useState([])
    useEffect(() => {
        api.get('admin/notifications', {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('access')}`,

            },
        }).then(e => {
            setNotifications(e.data.notifications)
        })
    }, [])
    return (
        <div className='w-100  d-flex flex-column  ' style={{ maxHeight: 'calc(100% - 50px)' }}>
            <div className='d-flex mt-3'>
                <h3 >Notifications</h3> <button className="btn btn-success ms-auto me-1" onClick={_ => navigate('/admin/notification/create')}>create notification</button></div>
            
            <div className='w-100 overflow-y-auto '>
                <table className='table table-dark text-dark  ' style={{ width: '98%', }}>
                    <thead className='w-100'>
                        <tr className=''>
                            <th className='col-1 bg-transparent text-dark'>
                                id</th>
                            <th className="col bg-transparent text-dark">notification</th>
                            <th className="col-2  bg-transparent text-dark">ban</th>
                        </tr></thead>

                    <tbody className='w-100 h-100'>
                        {notifications?.map((notification, idx) =>
                            <tr id={idx} >
                                <th className='  text-dark bg-transparent' >{notification.id}</th>
                                <td className='text-dark bg-transparent'   data-bs-toggle="modal" data-bs-target={`#notificationBackdrop${notification.id}`}>
                                    <div className='d-flex flex-column mb-0 ' style={{ height: '70px' }}>
                                        <p className='fw-medium mb-0 fs-5 '>{notification.title}</p>
                                        <p className='ms-2 mb-0 small '>{notification.description}</p>
                                    </div>
                                </td>
                                <td className='text-dark bg-transparent'><button className='btn btn-danger'
                                    onClick={e => {
                                          api.put('admin/notification/activate', { id: notification.id }, {
                                                headers: {
                                                    'Content-Type': 'application/json',
                                                    'Authorization': `Bearer ${localStorage.getItem('access')}`,

                                                },
                                            }).then(e => {
                                                let tlist = [...notifications]
                                                notification.is_active = !notification.is_active 
                                                tlist[idx] = notification
                                                setNotifications(tlist)
                                                setMsg(`notification is ${notification.is_active?'activation success':'deactivation success'}`)
                                            })
                                        
                                    }}
                                >{notification.is_active?'deactivate':'activate'}</button></td>
                                <Notification notification={notification} setMsg={setMsg}/>
                            </tr>)}
                        {/* <tr>
                        <th className='col-1'><input type="checkbox" name="" id="" className='c-12' /></th>
                        <td>Jacob</td>
                        <td>Thornton</td>
                        <td>@fat</td>
                    </tr>
                    <tr>
                        <th className='col-1'><input type="checkbox" name="" id="" className='' /></th>
                        <td>Larry the Bird</td>
                        <td>@twitter</td>
                    </tr> */}
                    </tbody>
                </table></div>
            <div className="toast-container position-fixed bottom-0 end-0 p-3 " >
                <div ref={toastRef} id="liveToast" className="toast " role="alert" aria-live="assertive" aria-atomic="true">

                    <div className="toast-body d-flex">
                        {msg}
                        <button type="button" className="btn-close ms-auto" data-bs-dismiss="toast" aria-label="Close"></button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Notifications


