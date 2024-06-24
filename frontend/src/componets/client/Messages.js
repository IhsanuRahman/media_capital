import React, { useEffect, useState } from 'react'
import MessagesPage from '../../pages/client/home/MessagesPage'
import api from './../../axios'
import { baseUrl, WSBaseUrl } from '../../constants'
import useWebSocket, { ReadyState } from 'react-use-websocket'
import { json } from 'react-router-dom'
import moment from 'moment'
function Messages() {
    const [popup, setPopup] = useState(null)
    const [users, setUsers] = useState([])
    const [searchValue, setSearchValue] = useState('')
    const { sendMessage, lastMessage, readyState } = useWebSocket(encodeURI(`${WSBaseUrl}/get-messages/${localStorage.getItem('access')}`), {
        onOpen: () => {
            console.log("The connection was setup successfully !",);
        },
        onClose: (e) => {

        },
        onMessage: (e) => {
            console.log(e, 'date ws')
            const data = JSON.parse(e.data);
            setUsers([data, ...(users.filter(usr => usr.id !== data.id))])

            // if (typeof data.text_data !== 'undefined') {
            //     if (typeof data.text_data.messages !== 'undefined' && messages.length===0) { 
            //         data.text_data.messages.map((msg) => {
            //             setMessages(prevMessages => [...prevMessages, {
            //                 type: msg.username === user.username ? 'send' : 'receive', message: msg.message ,sended_at:new Date(msg.sended_at).toLocaleTimeString()
            //             }])
            //         })

            //     }
            // } else if (data.username !== user.username) {
            //     const newMessage = {
            //         type: data.username === user.username ? 'send' : 'receive', message: data.message 
            //     }

            //     setMessages(prevMessages => [...prevMessages, newMessage])
            // }
            // if (messageView) {
            //     messageView.current.addEventListener('DOMNodeInserted', event => {
            //         const { currentTarget: target } = event;
            //         target.scroll({ top: target.scrollHeight, behavior: 'smooth' });
            //     });
            // }

        }
    });
    const connectionStatus = {
        [ReadyState.CONNECTING]: 'Connecting',
        [ReadyState.OPEN]: 'connected',
        [ReadyState.CLOSING]: 'Closing',
        [ReadyState.CLOSED]: 'Closed',
        [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
    }[readyState];

    useEffect(() => {
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
                console.log('messages', e.data.users);
            })
        }
    }, [searchValue])
    return (
        <div className=" col-sm-3 col-10 d-flex  d-block  flex-column offcanvas-lg offcanvas-end bg-black p-0  " tabindex="-1" id="offcanvasExample" aria-labelledby="offcanvasExampleLabel">
            {popup}
            <h3 className='p-4 text-white' >Messages</h3>
            <input type="search" placeholder='search' value={searchValue}
                onChange={e => {
                    setSearchValue(e.target.value)
                }}
                className='w-75 greyholder text-white ms-auto me-auto rounded-3 ps-2 border-0' style={{ height: '30px', backgroundColor: '#494949' }} />
            <hr className=' ms-auto me-auto ' style={{ width: '85%' }} />
            <div className='w-auto ps-2 pe-5'>

                {users.map((user, idx) => {
                    const time = moment.utc(user.time).local().startOf('seconds').fromNow()
                    return <div id={idx} className='   w-100 m-0 m-md-3  ps-md-3 d-flex' style={{ borderColor: 'grey', borderWidth: '0 0 1px 0 ', borderStyle: 'solid', height: '50px' }}
                        onClick={e =>
                            setPopup(<MessagesPage username={user.username} userId={user.id} profile={user.profile} setMsgPg={setPopup}></MessagesPage>)

                        }>
                        <div className='bg-light rounded-5 ' style={{ height: '35px', width: '35px ', backgroundSize: 'cover', backgroundImage: `url('${baseUrl + user.profile}')` }}>
                        </div>
                        <div className='col'>
                            <div className="d-flex w-100 mb-0 justify-content-between" style={{ height: '22px' }}>
                                <h6 className='ms-3 mb-0 text-white'>{user.username}</h6>
                                <p className='   text-secondary' style={{ fontSize: '12px' }}>{time === 'Invalid date' ? '' : time}</p>
                                
                            </div>
                            <p className='ms-4   text-secondary' style={{ fontSize: '12px' }}>{user.lastMessage}</p>
                        </div>
                    </div>
                })}

            </div>
        </div>
    )
}

export default Messages
