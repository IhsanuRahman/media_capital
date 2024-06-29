import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import '../style.css'
import { useSelector } from 'react-redux';
import useWebSocket, { ReadyState } from 'react-use-websocket'
import { useNavigate } from 'react-router-dom';
import { baseUrl, WSBaseUrl } from '../../../constants';
import axios from 'axios';
function Messages({ username, userId, profile, setMsgPg }) {
    const { isAuthenticated, user, loading } = useSelector(state => state.user);
    const [inputText, setInputText] = useState('')
    const [messages, setMessages] = useState([])
    const [buttonText, setButton] = useState('loading')
    const messageView = useRef()
    const navigator = useNavigate()
    const { sendMessage, lastMessage, readyState } = useWebSocket(encodeURI(`${WSBaseUrl}/chat/${localStorage.getItem('access')}/${userId}`), {
        onOpen: () => {
            setButton('send')
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

            if (typeof data.text_data !== 'undefined') {
                if (typeof data.text_data.messages !== 'undefined' && messages.length === 0) {
                    data.text_data.messages.map((msg) => {
                        const time = new Date(msg.sended_at).toLocaleTimeString().split(':')
                        setMessages(prevMessages => [...prevMessages, {
                            type: msg.username==='server'?'server': msg.username === user.username ? 'send' :  'receive', message: msg.message, sended_at: time[0] + ':' + time[1]
                        }])
                    })

                }
            } else if (data.username !== user.username) {
                const newMessage = {
                    type: data.username === user.username ? 'send' : data.username==='server'?'server': 'receive', message: data.message
                }

                setMessages(prevMessages => [...prevMessages, newMessage])
            }
            if (messageView) {
                messageView.current.addEventListener('DOMNodeInserted', event => {
                    const { currentTarget: target } = event;
                    target.scroll({ top: target.scrollHeight, behavior: 'smooth' });
                });
            }

        }
    });

    const connectionStatus = {
        [ReadyState.CONNECTING]: 'Connecting',
        [ReadyState.OPEN]: 'connected',
        [ReadyState.CLOSING]: 'Closing',
        [ReadyState.CLOSED]: 'Closed',
        [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
    }[readyState];
    return (
        <div className='d-flex  flex-column h-100 message-page ' style={{ maxHeight: (window.innerHeight - 80) + 'px', width: 'inherit' }}>
            <div className='w-100 mt-3  ps-1 d-flex' style={{ borderColor: 'grey', borderWidth: '0 0 1px 0 ', borderStyle: 'solid', height: '50px' }}>
                <button type="button" className="bg-black border-0 me-2 mb-2" data-dismiss="modal" aria-label="Close" onClick={_ => setMsgPg(null)}>
                    <svg xmlns="http://www.w3.org/2000/svg" width='20' viewBox="0 0 320 512"><path fill='white' d="M41.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.3 256 246.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z" /></svg>
                </button><div className='bg-light rounded-5' onClick={e => navigator('/user/' + userId)} style={{ height: '35px', width: '35px ', backgroundSize: 'cover', backgroundImage: `url('${baseUrl + profile}')` }}>
                </div>
                <div>
                    <h6 className='ms-3 mb-0 text-white ' onClick={e => navigator('/user/' + userId)}>{username}</h6>
                    <p className='ms-4 mt-1  text-secondary' style={{ fontSize: '12px' }}> {connectionStatus}</p>
                </div>

            </div>
            <div className="d-flex flex-column ps-2 overflow-y-scroll hidescroller mt-auto gap-2 w-100 pt-2" ref={messageView}>
                {messages.map((message, idx) => {
                    return <div key={idx} className={message.type === 'receive' ? 'bg-success  rounded ps-3 pe-3  text-break' :message.type === 'server'?'ms-auto me-auto  text-end  bg-warning text-black  text-break rounded ps-3 pe-2' : 'ms-auto text-end  bg-success  text-break rounded ps-3 pe-2'} style={{ maxWidth: '75%', width: "fit-content", minWidth: '25%' }}>
                        <div className='text-start'>
                            {message.message}</div>

                        {message.type!=='server'&&<p className='ms-auto text-muted mb-1 m-0' style={{ fontSize: '10px', height: '10px' }}>{message.sended_at}</p>}
                    </div>
                })}
            </div>
            <div className="w-100 d-flex gap-1 mt-2">
                <input type="text" value={inputText} placeholder="messages" aria-placeholder='messages' id="" className='w-75 whiteholder rounded-3 bg-secondary ps-2 '
                    onChange={e => {
                        setInputText(e.target.value)
                    }}
                    onKeyDown={e => {
                        if (e.key === "Enter")
                            if (readyState === 1 && inputText !== '') {
                                const time = new Date().toLocaleTimeString().split(':')
                                const message = {
                                    type: 'send',
                                    message: inputText,
                                    username: user.username,
                                    sended_at: time[0] + ':' + time[1]
                                };
                                

                                sendMessage(JSON.stringify({
                                    message: inputText, username: user.username
                                }))
                                if (messageView) {
                                    messageView.current.addEventListener('DOMNodeInserted', event => {
                                        const { currentTarget: target } = event;
                                        target.scroll({ top: target.scrollHeight, behavior: 'smooth' });
                                    });
                                }
                                if (readyState==1){
                                    setMessages([...messages, message]);
                                setInputText('')
                                }
                            }
                    }}
                />
                <button className='w-25 bg-primary rounded border-0 ' tabIndex="0"

                    onClick={_ => {
                        if (readyState === 0) {
                            alert('still connecting')
                        } else if (readyState === 1 && inputText !== '') {
                            const time = new Date().toLocaleTimeString().split(':')
                            const message = {
                                type: 'send',
                                message: inputText,
                                username: user.username,
                                sended_at: time[0] + ':' + time[1]
                            };
                            setMessages([...messages, message]);
                            setInputText('')

                            sendMessage(JSON.stringify({
                                message: inputText, username: user.username
                            }))
                            if (messageView) {
                                messageView.current.addEventListener('DOMNodeInserted', event => {
                                    const { currentTarget: target } = event;
                                    target.scroll({ top: target.scrollHeight, behavior: 'smooth' });
                                });
                            }
                        }
                    }}
                >{buttonText}</button>
            </div>
        </div>
    )
}

export default Messages
