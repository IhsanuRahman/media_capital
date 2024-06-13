import React, { useEffect, useRef, useState } from 'react'
import { baseUrl } from '../../constants'
import api from '../../axios'
import {Modal} from 'bootstrap'
import { useNavigate } from 'react-router-dom'
function Notification({ notification,setMsg}) {
    const [title, setTitle] = useState(notification.title)
    const [description, setDescription] = useState(notification.description)
    const [error, setError] = useState('')
    const navigator =useNavigate()
    
    return (
        <div  className="modal  fade bg-transparent" id={`notificationBackdrop${notification.id}`} data-bs-backdrop="static"  data-bs-keyboard="false" tabIndex="-1" aria-labelledby="notificationBackdropLabel" aria-hidden="false">
            <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable " >
                <div class="modal-content  text-dark">
                    <div class="modal-header">

                        <h5 class="modal-title">Notification</h5>
                        <button type="button" className="btn-close " data-bs-dismiss="modal" aria-label="Close" ></button>
                    </div>
                    <div class="modal-body">

                        <div className="mb-3">
                            <label for="recipient-name" class="col-form-label">title:</label>
                            <input type="text" readOnly className="form-control" id="reson" value={notifyState.title}
                                
                            />
                        </div>
                        
                        <div className="mb-3">
                            <label for="recipient-name" class="col-form-label">description:</label>
                            <textarea type="text" readOnly className="form-control" id="detail" value={notifyState.description}

                                
                            />
                        </div>
                        <div className="mb-3">
                            <label for="recipient-name" class="col-form-label"><b>on</b>: { notifyState.sended_at}</label>
                        </div>
                        <div className="mb-3 d-flex align-items-center justify-content-between">
                            
                            
                        </div>

                    </div>
                    <div class="modal-footer">
                    <button className='btn btn-danger me-auto'
                                    onClick={e => {
                                          api.put('admin/notification/activate', { id: notification.id }, {
                                                headers: {
                                                    'Content-Type': 'application/json',
                                                    'Authorization': `Bearer ${localStorage.getItem('access')}`,

                                                },
                                            }).then(e => {
                                                notification.is_active = !notification.is_active 
                                                setNotify({...notification})
                                                setMsg(`notification is ${notification.is_active?'activation success':'deactivation success'}`)
                                            })
                                        
                                    }}
                                >{notification.is_active?'deactivate':'activate'}</button>
                        <button type="button" className="btn btn-primary" data-bs-dismiss="modal">Close</button>
                        
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Notification
