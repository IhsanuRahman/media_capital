import React, { useEffect, useRef, useState } from 'react'
import { baseUrl } from '../../constants'
import api from '../../axios'
import { useDispatch } from 'react-redux'
import { getUser } from '../../features/user'
import { Toast } from 'bootstrap'

function SupportersList({ list, setList, type }) {
    const dispatch = useDispatch()
    const [message, setMessage] = useState()
    const tostRef = useRef()
  
    return (
        <div  className="modal fade" id={`${type}Backdrop`} data-bs-backdrop="true" data-bs-keyboard="true" data-bs-focus='true' tabIndex="-1" data-bs-theme="dark" aria-labelledby={`${type}BackdropLabel`} aria-hidden="false">
            <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable "  >
                <div className="modal-content bg-black ">
                    <div className="modal-header">

                        <h5 className="modal-title">{type}</h5>
                        <button type="button" className="btn-close " data-bs-dismiss="modal" aria-label="Close" onClick={_=>dispatch(getUser())}></button>
                    </div>
                    <div class="modal-body">
                        <div className='d-flex flex-column'>
                            {list.length > 0 ? list.map((user, idx) => {
                                return <div className='  rounded-2 d-flex p-2 mb-2  w-100' style={{ borderColor: '#494949', borderWidth: '2px ', borderStyle: 'solid' }}>
                                    <div className='bg-light rounded-5' onClick={e => navigator('/user/' + user.id)} style={{ height: '35px', width: '35px ', backgroundSize: 'cover', backgroundImage: `url('${baseUrl + user.profile}')` }}>
                                    </div>
                                    <div>
                                        <h6 className='ms-3 mb-0 text-white ' onClick={e => navigator('/user/' + user.id)}>{user.username}</h6>
                                        <p className='ms-4 mt-1  text-secondary' style={{ fontSize: '12px' }}> {user.first_name + ' ' + user.last_name}</p>
                                    </div>
                                    <button className="btn d-none ms-auto  d-sm-block btn-primary me-2  " onClick={_ => {
                                        api.put('profile/user/support', {
                                            id: user.id
                                        }, {
                                            headers: {
                                                'Content-Type': 'application/json',
                                                'Authorization': `Bearer ${localStorage.getItem('access')}`,

                                            },
                                        }).then(e => {
                                            user = { ...user, is_supporting: !user.is_supporting }
                                            let tlist = [...list]
                                            tlist[idx] = user
                                            setList([...tlist])
                                            setMessage(user.is_supporting ? 'started supporting ' + user.username : 'unsupported ' + user.username)
                                            const toastLiveExample = tostRef.current

                                            const toastBootstrap = Toast.getOrCreateInstance(toastLiveExample)
                                            toastBootstrap.show()

                                        })
                                    }}>{user.is_supporting ? 'un' : ''}support{user.is_supporting}</button>
                                </div>
                            }) : 'no any ' + type}</div>


                    </div>
                    <div class="modal-footer">

                        <button type="button" className="btn btn-primary" data-bs-dismiss="modal">Close</button>

                    </div>
                </div>
            </div>

            <div className="toast-container position-fixed bottom-0 end-0 p-3 " data-bs-theme="dark">
                <div ref={tostRef} id="liveToast" className="toast " role="alert" aria-live="assertive" aria-atomic="true">

                    <div className="toast-body d-flex">
                        {message}
                        <button type="button" className="btn-close ms-auto" data-bs-dismiss="toast" aria-label="Close"
                        onClick={_=>dispatch(getUser())}></button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SupportersList
