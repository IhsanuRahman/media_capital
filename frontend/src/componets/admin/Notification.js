import React, { useEffect, useRef, useState } from 'react'
import { baseUrl } from '../../constants'
import api from '../../axios'
import { Modal } from 'bootstrap'
import { useNavigate } from 'react-router-dom'
function Notification({ notification, setMsg ,update}) {
    const [title, setTitle] = useState(notification.title)
    const [description, setDescription] = useState(notification.description)
    const [active, setActive] = useState(notification.is_active)
    const navigator = useNavigate()

    return (
        <div className="modal  fade bg-transparent" id={`notificationBackdrop${notification.id}`} data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="notificationBackdropLabel" aria-hidden="false">
            <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable " >
                <div className="modal-content  text-dark">
                    <div className="modal-header">

                        <h5 className="modal-title">Notification</h5>
                        <button type="button" className="btn-close " data-bs-dismiss="modal" aria-label="Close" ></button>
                    </div>
                    <div className="modal-body">

                        <div className="mb-3">
                            <label for="recipient-name" className="col-form-label">title:</label>
                            <input type="text"  className="form-control" id="reson" value={title}
                                onChange={e=>{
                                    setTitle(e.target.value)
                                }}
                            />
                        </div>

                        <div className="mb-3">
                            <label for="recipient-name" className="col-form-label">description:</label>
                            <textarea type="text"  className="form-control" id="detail" value={description}
                                onChange={e=>{
                                    setDescription(e.target.value)
                                }}

                            />
                        </div>
                        <div className="mb-3">
                            <label for="recipient-name" className="col-form-label"><b>on</b>: {notification.sended_at}</label>
                        </div>
                        <div className="mb-3 d-flex align-items-center justify-content-between">


                        </div>

                    </div>
                    <div className="modal-footer">
                        <button className='btn btn-danger me-auto'
                            onClick={e => {
                                api.put('admin/notification/activate', { id: notification.id }, {
                                    headers: {
                                        'Content-Type': 'application/json',
                                        'Authorization': `Bearer ${localStorage.getItem('access')}`,

                                    },
                                }).then(e => {
                                    setActive(!active)
                                    notification.is_active=!notification.is_active
                                    update(notification)
                                    setMsg(`notification is ${!active ? 'activation success' : 'deactivation success'}`)
                                })

                            }}
                        >{active ? 'deactivate' : 'activate'}</button>
                        <button type="button" className="btn btn-primary" data-bs-dismiss="modal">Close</button>
                        <button type="button" className="btn btn-success"
                            onClick={
                                _ => {

                                    if (title === '' || description === '') {
                                        setMsg(<p className=' text-danger'>requierd</p>)
                                    }
                                    else {
                                        api.patch('admin/notification/edit',{
                                            id:notification.id,
                                            title,
                                            description
                                        },{
                                            headers: {
                                                'Content-Type': 'application/json',
                                                'Authorization': `Bearer ${localStorage.getItem('access')}`,
        
                                            },
                                        }).then(e => {
                                            notification.title=title
                                            notification.description=description
                                            update(notification)
                                            setMsg('notification is saved')
                                            
                                        })
                                    }
                                }

                            }

                        >Save</button>

                    </div>
                </div>
            </div>
        </div>
    )
}

export default Notification
