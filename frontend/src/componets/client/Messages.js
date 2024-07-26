import React, { useEffect, useRef, useState } from 'react'
import MessagesPage from '../../pages/client/home/MessagesPage'
import api from './../../axios'
import { baseUrl, WSBaseUrl } from '../../constants'
import useWebSocket, { ReadyState } from 'react-use-websocket'
import { json, useNavigate } from 'react-router-dom'
import moment from 'moment'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { Offcanvas, Toast } from 'bootstrap'
import axios from 'axios'
import CloseIcon from '@mui/icons-material/Close';

function Messages({ setNew }) {
    const [popup, setPopup] = useState(null)
    const [users, setUsers] = useState([])
    const [searchValue, setSearchValue] = useState('')
    const navigator = useNavigate()
    const toastRef = useRef()
    const [msg, setMsg] = useState('')
    const canvasRef = useRef()
    const { sendMessage, lastMessage, readyState } = useWebSocket(encodeURI(`${WSBaseUrl}/get-messages/${localStorage.getItem('access')}`), {
        onOpen: () => {

        },
        shouldReconnect: async (closeEvent) => {
            const refreshToken = localStorage.getItem('refresh');
            if (refreshToken && connectionStatus !== 'Connecting') {
                try {
                    const response = await axios.post(`${baseUrl}/token/refresh`, {
                        refresh: localStorage.getItem('refresh')
                    }, { headers: { 'Authorization': `Bearer ${localStorage.getItem('access')}` } })
                    const newAccessToken = response.data.access;
                    localStorage.setItem('access', newAccessToken);
                    return false;
                } catch (error) {
                    return false

                }
            }

        },
        reconnectAttempts: 10,
        retryOnError: true,
        onMessage: (e) => {
            const data = JSON.parse(e.data);
            setNew(true)
            data.is_new=true
            setUsers([data, ...(users.filter(usr => usr.id !== data.id))])


        }
    });
    const connectionStatus = {
        [ReadyState.CONNECTING]: 'Connecting',
        [ReadyState.OPEN]: 'connected',
        [ReadyState.CLOSING]: 'Closing',
        [ReadyState.CLOSED]: 'Closed',
        [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
    }[readyState];
    const getUsers = () => {
        if (localStorage.getItem('access')) {
            api.get(`messages/users`, {
                params: {
                    search: searchValue,
                },
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('access')}`,

                }
            }).then(e => {
                setUsers(e.data.users)
            })
        }
    }
    useEffect(() => {
        getUsers()
    
    }, [searchValue])
    
    return (
        <div ref={canvasRef} data-bs-backdrop="static" className=" col-sm-3 col-10 d-flex  d-block   flex-column offcanvas-lg offcanvas-end bg-black p-0  " tabIndex="-1" id="offcanvasExample" aria-labelledby="offcanvasExampleLabel">
            {popup}
            <div className="d-flex justify-contents-start" style={{maxWidth:'100%'}}>
                <CloseIcon className='d-lg-none text-white ' data-bs-toggle="offcanvas" href="#offcanvasExample" role="button" aria-controls="offcanvasExample" onClick={_=>setNew(false)}/>
                <button type="button" className="btn-close" data-bs-theme='dark' aria-label="Close"></button>
                <h3 className='p-4 text-white' >Messages</h3></div>
            <input type="search" placeholder='search' value={searchValue}
                onChange={e => {
                    setSearchValue(e.target.value)
                }}
                className='w-75 greyholder text-white ms-auto me-auto rounded-3 ps-2 border-0' style={{ height: '30px', backgroundColor: '#494949' }} />
            <hr className=' ms-auto me-auto ' style={{ width: '85%' }} />
            <div className='w-auto ps-2 pe-xl-5'>
                {users?.map((user, idx) => {
                    if (user.is_new) {
                        setNew(true)
                    }
                    const time = moment.utc(user.time).local().startOf('seconds').fromNow()
                    return <div key={idx} className='w-100 m-3  ps-xl-3 d-flex' style={{ borderColor: 'grey', borderWidth: '0 0 1px 0 ', borderStyle: 'solid', height: '50px' }}
                        onClick={e => {
                            let tUser = users[idx]
                            tUser.is_new = false
                            users[idx] = tUser
                            setUsers([...users])
                            return setPopup(<MessagesPage username={user.username} userId={user.id} profile={user.profile} setMsgPg={setPopup} onClose={_=>{getUsers()}}></MessagesPage>)
                        }}>
                        <div className='bg-light rounded-5 ' style={{ height: '35px', width: '35px ', backgroundSize: 'cover', backgroundImage: `url('${baseUrl + user.profile}')` }}>
                        </div>
                        <div className='col'>
                            <div className="d-flex w-100 mb-0 justify-content-between" style={{ height: '22px' }}>
                                <h6 className='ms-3 mb-0 text-white'>{user.username}</h6>

                                <div className="dropdown ms-auto me-1 " data-bs-theme="dark" >
                                    {user.is_new && <span className="position-absolute top-100 end-100 translate-middle badge rounded-pill bg-primary">
                                        new
                                    </span>}
                                    <p className=' mb-0  text-secondary' style={{ fontSize: '12px' }}>{time === 'Invalid date' ? '' : time}</p>

                                    <MoreHorizIcon height={30} style={{ cursor: 'pointer' }} className="ms-4 dropdown-toggle" data-bs-toggle="dropdown" aria-expanded='false' onClick={e => {
                                        e.stopPropagation();
                                    }} />
                                    <ul className="dropdown-menu dropdown-center "  >
                                        <li className="dropdown-item cursor-pointer" onClick={e => navigator('/user/' + user.id)} >view user</li>
                                        <li className="dropdown-item cursor-pointer" style={{ cursor: 'pointer' }}
                                            onClick={e => {
                                                e.stopPropagation()
                                                api.put('messages/block', {
                                                    'user_id': user.id
                                                }, {
                                                    headers: {
                                                        'Content-Type': 'application/json',
                                                        'Authorization': `Bearer ${localStorage.getItem('access')}`,

                                                    }
                                                }).then(e => {
                                                    let data = [...users]
                                                    data[idx].is_blocked = !data[idx].is_blocked
                                                    setMsg('')
                                                    setMsg(user.is_blocked ? 'unblock user succes' : 'block user succes')
                                                    setUsers([...data])
                                                    const toastLiveExample = toastRef.current
                                                    const toastBootstrap = Toast.getOrCreateInstance(toastLiveExample)

                                                    toastBootstrap.show()
                                                })
                                            }}
                                        >{user.is_blocked ? 'unblock' : 'block'} user</li>
                                    </ul>
                                </div>
                            </div>
                            <p className='ms-4 text-secondary' style={{ fontSize: '12px' }}>{user.lastMessage}</p>
                        </div>
                    </div>
                })}

            </div>
            <div className="toast-container position-fixed bottom-0 end-0 p-3 " data-bs-theme="dark">
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

export default Messages
