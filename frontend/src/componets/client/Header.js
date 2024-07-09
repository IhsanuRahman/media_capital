import React, {  useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import {  logout } from '../../features/user';
import { useNavigate  } from 'react-router-dom';
import { baseUrl,WSBaseUrl } from '../../constants';
import { Toast } from 'bootstrap';
import AddIcon from '@mui/icons-material/Add';
import LogoutIcon from '@mui/icons-material/Logout';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import useWebSocket,{ReadyState} from 'react-use-websocket'
import './popup.css'
import axios from 'axios';
import CloseIcon from '@mui/icons-material/Close';



function Header({ leading }) {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const {  user } = useSelector(state => state.user);
    const [popup, setPopup] = useState(null)
    const [spinner, setSpinner] = useState(true)
    const notificationRef = useRef()
    const [notifications, setNotifications] = useState([])
    const [newSpoted,setNew]=useState(false)

    const {  readyState } = useWebSocket(encodeURI(`${WSBaseUrl}/get-notifications/${localStorage.getItem('access')}`),{
        onOpen: () =>{
            setSpinner(false)
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
        onMessage:(e)=>{
            const data = JSON.parse(e.data);

            if(data.text_data!==undefined){
                if (data.text_data[0].is_new===true){
                    setNew(true)
                }
                setNotifications([...data.text_data])
            }else{
                setNew(true)
                setNotifications([data,...notifications])}
            


        }   });
    const connectionStatus = {
        [ReadyState.CONNECTING]: 'Connecting',
        [ReadyState.OPEN]: 'connected',
        [ReadyState.CLOSING]: 'Closing',
        [ReadyState.CLOSED]: 'Closed',
        [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
      }[readyState];


    const MyModal = Toast.getOrCreateInstance(notificationRef.current)
    const popupComponent = (
        <div  className="popup text-white bg-gradient bg-dark gap-1" onMouseLeave={_ => setPopup(null)}  style={{ position: 'fixed', zIndex: '3', right: '10px', top: '55px' }}>
                <CloseIcon onClick={_ => setPopup(null)}  className='cursor-pointer text-white '  />
                <img src={`${baseUrl + user.profile}`} alt="Profile Picture"  className="profile-pic" />
                <div className="profile-name">{user.username}</div>
                <div className="d-flex gap-1">
                <button className="btn btn-outline-primary  " onClick={_ => navigate('/profile')}><AccountCircleOutlinedIcon/> Profile</button>
                <button className=" btn btn-outline-danger  " 
                    onClick={_ => {
                        dispatch(logout())
                        navigate('/login')
                    }}><LogoutIcon/> Logout</button></div>
                <button className="btn btn-outline-success"  onClick={_ => navigate('/create-post')}> <AddIcon /> Create Post</button>
            </div>
        
    )

    return (
        <>
            <div className='w-100 fixed-top  d-flex align-items-center' style={{ backgroundColor: '#111111', height: '50px' }}>
                <div className='col-1 '>
                    {leading}
                </div>
                <h3 className='fw-bolder  pt-3' onClick={_ => navigate('/')} style={{ cursor: 'pointer' }}>Media Capital</h3>
                <div className='ms-auto d-flex justify-content-between ' style={{ width: '80px' }}  >


                    <svg width="35" height="35" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg"
                        onClick={_ => {
                            setNew(false)
                            MyModal.show()
                        }}
                    >
                        {newSpoted&&<circle cx="5" cy="5" r="5" fill="red" />}
                        <rect x="1" y="1" width="42" height="42" rx="21" stroke="white" strokeWidth="2" />
                        <path d="M21.6191 13.2269C22.2094 13.2269 23.6117 13.5735 23.6117 13.5735C27.4108 14.3819 30.0849 17.6313 30.0849 21.3V31.1747L30.8616 31.8993L31.5106 32.5047H11.561L12.21 31.8993L12.9867 31.1747V21.3C12.9867 17.6314 15.6608 14.3819 19.4599 13.5735C19.4599 13.5735 20.9635 13.2269 21.4525 13.2269M21.5358 7.61905C20.069 7.61905 18.9476 8.66508 18.9476 10.0333V11.1599C14.0296 12.2063 10.3201 16.391 10.3201 21.3V30.1524L6.86914 33.3714V34.981H36.2025V33.3714L32.7516 30.1524V21.3C32.7516 16.391 29.0419 12.2063 24.1241 11.1599V10.0333C24.1241 8.66508 23.0026 7.61905 21.5358 7.61905ZM24.9867 36.5905H18.0848C18.0848 38.361 19.6376 39.8095 21.5358 39.8095C23.4341 39.8095 24.9867 38.361 24.9867 36.5905Z" fill="white" />
                    </svg>


                    <div className=' rounded-5 btn ' type="button" style={{ height: '35px', width: '35px ', backgroundSize: 'cover', backgroundImage: `url(${baseUrl + user.profile})` }} onMouseEnter={_ => setPopup(popupComponent)} >


                    </div>
                </div>
                <div className="toast-container position-fixed p-3 end-lg-25 " data-bs-autohide="false" data-bs-theme="dark" style={{ top: '50px',}}>
                    <div ref={notificationRef} id="liveToast" className="h-100  toast ms-auto " role="alert" aria-live="assertive" aria-atomic="true">
                        <div className="toast-header " style={{ backgroundColor: 'rgb(33 37 41)' ,height:'30px'}}>
                            <strong className="me-auto">Notification</strong>

                            <button type="button" className="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
                        </div>
                        <div className="toast-body d-flex flex-column text-dark overflow-y-scroll  " style={{ backgroundColor: 'rgb(33 37 41)',maxHeight:'calc(100vh - 100px)' }}>
                            {spinner?<span className="spinner-border" aria-hidden="true"></span>:notifications.length > 0 ? <ul type='none' className='list-group'>
                                {notifications.map((notification,idx) => {
                                    return <li key={idx} className='text-white list-group-item'>
                                        <div className='d-flex flex-column mb-0 '>
                                            <p className='fw-medium mb-0 fs-5 '>{notification.title}</p>
                                            <p className='ms-2 mb-0 small '>{notification.description}</p>
                                        </div>
                                    </li>
                                })}


                            </ul> : <p className='text-secondary'>no any notifications</p>}
                            
                            
                        
                        </div>
                    </div>
                </div>
            </div>
            {popup}
        </>
    )
}

export default Header
