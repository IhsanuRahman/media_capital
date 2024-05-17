import React, { useEffect } from 'react';
import Header from '../../../componets/client/Header';
import Navbar from '../../../componets/client/Navbar';
import mainLogo from '../../../assets/Postimage.png';
import ratingSvg from '../../../assets/Star.svg';
import ratingHalfSvg from '../../../assets/Half_filled_star.svg';
import ratingFullSvg from '../../../assets/Filled_star.svg';
import option from '../../../assets/options.svg';
import Messages from '../../../componets/client/Messages';
import '../style.css'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

export function Home() {
    const navigate = useNavigate()
    const { isAuthenticated, user, loading } = useSelector(state => state.user);
    useEffect(() => {
        if (!isAuthenticated && !loading && Object.keys(user).length === 0) {
            console.log('loading', loading,user)
            return navigate('/login')
        }
    })

    var posts = ['post1', 'post1', 'post1', 'post1',];
    return (

        Object.keys(user).length > 0?<div className='pt-5 h-100 w-100'>
            <Header />
            <div className="row w-100 ">
                <div style={{ maxHeight: (window.innerHeight - 150) + 'px', }} className='col-12 col-lg-9 pe-0'>
                    <Navbar />
                    <div className='w-100 reponsive-border flex-column gap-2  d-flex overflow-y-scroll align-items-center hidescroller pt-2' style={{ maxHeight: (window.innerHeight - 150) + 'px', }}>
                        {posts.map((post) => <div className='  rounded-1 ' style={{ width: '400px', minHeight: '530px', maxHeight: '550px', borderColor: '#494949', borderWidth: '2px ', borderStyle: 'solid' }}>
                            <div className='d-flex align-items-center ps-2   w-100 h-50' style={{ minHeight: "45px", maxHeight: "45px", borderColor: '#494949', borderWidth: '0 0 2px 0', borderStyle: 'solid' }}>
                                <div className='bg-light rounded-5' style={{ height: '35px', width: '35px ' }}>
                                </div>
                                <h6 className='ms-3'>user</h6>
                            </div>
                            <div className='w-100' style={{ borderColor: '#494949', borderWidth: '0 0 2px 0', borderStyle: 'solid' }}>
                                <img src={mainLogo} alt="" style={{ width: '100%', height: '350px' }} />
                            </div>
                            <div className='w-100 justify-content-between d-flex flex-column ' style={{ height: '120px' }}>
                                <div className='d-flex w-100 '>
                                    <div className='d-flex m-2 w-50 gap-1 w-100'>
                                        <img src={ratingFullSvg} alt="" srcset="" className='fill-white' />
                                        <img src={ratingHalfSvg} alt="" srcset="" />
                                        <img src={ratingSvg} alt="" srcset="" />
                                        <img src={ratingSvg} alt="" srcset="" />
                                        <img src={ratingSvg} alt="" srcset="" />
                                    </div>
                                    <img src={option} alt="" srcset="" />
                                </div>
                                <p className='ms-3 text-truncate'>lorum ipsum dolor sit</p>
                                <div className='d-flex gap-2 align-self-end  mb-2 justify-content-start w-100'>
                                    <input type="text" name="" placeholder="comment" className="form-control w-50 ms-2 rounded-5 text-white whiteholder border-0" style={{ height: '25px', backgroundColor: '#494949' }} />
                                    <button className='w-25 rounded-pill border-0 text-white fwbold' style={{ backgroundColor: '#233543' }}>post</button>
                                </div>
                            </div>
                        </div>)}
                    </div>

                </div>
                <Messages />
            </div>
        </div>:<div></div>
    );
}

export default Home
