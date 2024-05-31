import React, { useEffect, useState } from 'react'
import logoutIcon from '../../assets/Sign_Out.svg'
import ProfileIcon from '../../assets/User.svg'
import { useDispatch, useSelector } from 'react-redux';
import { getUser, logout } from '../../features/user';
import { useNavigate } from 'react-router-dom';
import { baseUrl } from '../../constants';
function Header({ leading }) {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { isAuthenticated, user, loading } = useSelector(state => state.user);
    console.log(user);
    const [popup, setPopup] = useState(null)

    const popupComponent = (
        <div  className="bg-gradient bg-dark rounded border gap-4 pt-5 mb-5  d-flex flex-column align-items-center " onMouseLeave={_ => setPopup(null)} style={{ position: 'fixed', zIndex: '3', right: '10px', top: '55px', height: '300px', width: '400px', }}>
            <div className='bg-light  btn' style={{ height: '80px', width: '80px ', borderRadius: '100%', backgroundSize: 'cover', backgroundImage: `url(${baseUrl+user.profile})` }}>

            </div>
            <h6>{user.username}</h6>
            <div className="d-flex w-100 justify-content-center gap-3 ">
                <button className='btn btn-outline-light w-25'
                    onClick={_ => {
                        dispatch(logout())
                        navigate('/login')
                    }}
                >
                    <img src={logoutIcon} alt="" srcset="" />
                    logout</button><button className='btn btn-outline-light w-25 gap-2' onClick={_=> navigate('/profile')}> <img src={ProfileIcon} alt=""/>profile</button>
            </div>
        </div>
    )
    
    return (
        <>
            <div className='w-100 fixed-top  d-flex align-items-center' style={{ backgroundColor: '#111111', height: '50px' }}>
                <div className='col-1 '>
                    {leading}
                </div>
                <h3 className='fw-bolder  pt-3' onClick={_=>navigate('/')} style={{cursor:'pointer'}}>Media Capital</h3>
                <div className='ms-auto d-flex justify-content-between ' style={{ width: '80px' }}  >
                    <svg width="35" height="35" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="1" y="1" width="42" height="42" rx="21" stroke="white" stroke-width="2" />
                        <path d="M21.6191 13.2269C22.2094 13.2269 23.6117 13.5735 23.6117 13.5735C27.4108 14.3819 30.0849 17.6313 30.0849 21.3V31.1747L30.8616 31.8993L31.5106 32.5047H11.561L12.21 31.8993L12.9867 31.1747V21.3C12.9867 17.6314 15.6608 14.3819 19.4599 13.5735C19.4599 13.5735 20.9635 13.2269 21.4525 13.2269M21.5358 7.61905C20.069 7.61905 18.9476 8.66508 18.9476 10.0333V11.1599C14.0296 12.2063 10.3201 16.391 10.3201 21.3V30.1524L6.86914 33.3714V34.981H36.2025V33.3714L32.7516 30.1524V21.3C32.7516 16.391 29.0419 12.2063 24.1241 11.1599V10.0333C24.1241 8.66508 23.0026 7.61905 21.5358 7.61905ZM24.9867 36.5905H18.0848C18.0848 38.361 19.6376 39.8095 21.5358 39.8095C23.4341 39.8095 24.9867 38.361 24.9867 36.5905Z" fill="white" />
                    </svg>
                    <div className=' rounded-5 btn ' type="button" style={{ height: '35px', width: '35px ', backgroundSize: 'cover', backgroundImage: `url(${baseUrl+user.profile})` }} onMouseEnter={_ => setPopup(popupComponent)} >


                    </div>
                </div>

            </div>
            {popup}
        </>
    )
}

export default Header
