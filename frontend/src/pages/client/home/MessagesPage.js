import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import '../style.css'
import { useSelector } from 'react-redux';
import useWebSocket,{ReadyState} from 'react-use-websocket'
import { useNavigate } from 'react-router-dom';
import { baseUrl } from '../../../constants';
function Messages({ username, userId,profile, setMsgPg }) {
    const { isAuthenticated, user, loading } = useSelector(state => state.user);
    const [inputText, setInputText] = useState('')
    const [messages, setMessages] = useState([])
    const [buttonText, setButton] = useState('loading')
    const messageView = useRef()
    const navigator=useNavigate()
    const { sendMessage, lastMessage, readyState } = useWebSocket(encodeURI(`ws://127.0.0.1:8000/${localStorage.getItem('access')}/${userId}`),{
        onOpen: () =>{
            console.log("The connection was setup successfully !",);
            setButton('send')
        },
        onMessage:(e)=>{
            
            const data = JSON.parse(e.data);
            
            if (typeof data.text_data !== 'undefined') {
                if (typeof data.text_data.messages !== 'undefined') {
                    data.text_data.messages.map((msg) => {
                        setMessages(prevMessages => [...prevMessages, {
                            type: msg.username === user.username ? 'send' : 'receive', message: msg.message 
                        }])
                    })

                }
            } else if (data.username !== user.username) {
                const newMessage = {
                    type: data.username === user.username ? 'send' : 'receive', message: data.message 
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
        <div className='d-flex  flex-column h-100 message-page ' style={{ maxHeight: (window.innerHeight - 80) + 'px',width:'inherit' }}>
            <div className='w-100 mt-3  ps-1 d-flex' style={{ borderColor: 'grey', borderWidth: '0 0 1px 0 ', borderStyle: 'solid', height: '50px' }}>
                <button type="button" className="bg-black border-0 me-2 mb-2" data-dismiss="modal" aria-label="Close" onClick={_ => setMsgPg(null)}>
                    <svg xmlns="http://www.w3.org/2000/svg" width='20' viewBox="0 0 320 512"><path fill='white' d="M41.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.3 256 246.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z" /></svg>
                </button><div className='bg-light rounded-5'  onClick={e=>navigator('/user/'+userId)} style={{ height: '35px', width: '35px ' , backgroundSize: 'cover', backgroundImage:`url('${baseUrl+profile}')`}}>
                </div>
                <div>
                    <h6 className='ms-3 mb-0 text-white '  onClick={e=>navigator('/user/'+userId)}>{username}</h6>
                    <p className='ms-4 mt-1  text-secondary' style={{ fontSize: '12px' }}> {connectionStatus}</p>
                </div>

            </div>
            <div className="d-flex flex-column ps-2 overflow-y-scroll hidescroller mt-auto gap-2 w-100 pt-2" ref={messageView}>
                {messages.map((message, idx) => {
                    return <div id={idx} className={message.type === 'receive' ? 'bg-success  rounded ps-3 pe-3  text-break' : 'ms-auto text-end  bg-success  text-break rounded ps-3 pe-2'} style={{ maxWidth: '75%', width: "fit-content", minWidth: '25%' }}>
                        {message.message}
                    </div>
                })}
            </div>
            <div className="w-100 d-flex gap-1 mt-2">
                <input type="text" value={inputText} placeholder="messages" aria-placeholder='messages' id="" className='w-75 whiteholder rounded-3 bg-secondary ps-2 '
                    onChange={e => {
                        setInputText(e.target.value)
                    }}
                    onKeyDown={e => { 
                        console.log(e.key);
                        if (e.key === "Enter")
                            if (readyState === 0) {
                                alert('still connecting')
                            } else if (readyState===1) {
                                const message = {
                                    type: 'send',
                                    message: inputText,
                                    username: user.username
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
                />
                <button className='w-25 bg-primary rounded border-0 ' tabIndex="0"
                    
                    onClick={_ => {
                        if (readyState === 0) {
                            alert('still connecting')
                        } else if (readyState===1) {
                            const message = {
                                type: 'send',
                                message: inputText,
                                username: user.username
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
