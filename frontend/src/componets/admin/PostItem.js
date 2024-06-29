import React, { useRef, useState } from 'react'
import { baseUrl } from '../../constants'
import option from '../../assets/options.svg';
import Markdown from 'markdown-to-jsx'
import { useNavigate } from 'react-router-dom';
import api from '../../axios';
import { Rating, Stack } from '@mui/material';
import { useSelector } from 'react-redux';
import { Toast } from 'bootstrap';

function PostItem({ post }) {
    const navigator = useNavigate()
    const toastRef = useRef()
    const [toastMsg, setToastMsg] = useState('')
    const [visible, setVisible] = useState(true)
    const [hide, setHide] = useState(post.is_hidded)

    return (
        <>
            {visible ? <div className='  rounded-1 ' style={{ width: '400px', borderColor: '#494949', borderWidth: '2px ', borderStyle: 'solid' }}>
                <div className='d-flex align-items-center ps-2   w-100 ' style={{ minHeight: "45px", maxHeight: "45px", borderColor: '#494949', borderWidth: '0 0 2px 0', borderStyle: 'solid' }}>
                    <div className='bg-light rounded-5' onClick={e => navigator('/admin/user/' + post.user.id)} loading="lazy" style={{ height: '35px', width: '35px ', backgroundSize: 'cover', backgroundImage: `url(${baseUrl + post.user.profile})` }}>
                    </div>
                    <h6 className='ms-3' onClick={e =>  navigator('/admin/user/' + post.user.id)}>{post.user.username}</h6>

                </div>
                <div className='w-100' style={{ borderColor: '#494949', borderWidth: '0 0 2px 0', borderStyle: 'solid' }}
                    onClick={e => {
                        navigator('/admin/post/' + post.id)
                    }}
                >
                    <img src={baseUrl + post.image} alt="" style={{ width: '100%', height: '350px' }} />
                </div>
                <div className='w-100 justify-content-between d-flex flex-column justify-content-between' >
                    <div className="d-flex w-100  ps-1 mt-2">
                        <Stack spacing={1} className='d-flex flex-row'>
                            <div className="d-flex gap-2  ">
                                <h6 className='pt-2'>All over:</h6><Rating name="half-rating-read" value={post.rating} precision={0.1} readOnly onChange={(event, newValue) => {

                                }} 
                                 />
                            </div>


                        </Stack>
                        <div className="dropdown ms-auto me-1 " data-bs-theme="light" >
                            <img src={option} alt="" srcSet="" style={{ cursor: 'pointer' }} className="dropdown-toggle" data-bs-toggle="dropdown" aria-expanded='false' />
                            <ul className="dropdown-menu dropdown-center " >
                                
                                    <li className="dropdown-item cursor-pointer"
                                        onClick={_ => {
                                            api.delete('/post/delete', {
                                                data: {
                                                    post_id: post.id
                                                },
                                                headers: {
                                                    'Content-Type': 'application/json',
                                                    'Authorization': `Bearer ${localStorage.getItem('access')}`,
                                                },

                                            }).then(resp => {
                                                setToastMsg('post has been delete')
                                                const toastLiveExample = toastRef.current
                                                const toastBootstrap = Toast.getOrCreateInstance(toastLiveExample)
                                                post=null
                                                setVisible(false)
                                                toastBootstrap.show()
                                                

                                            }).catch(e=>{console.log('error post')}
                                            )
                                        }}
                                    >delete post</li>
                                    <li className="dropdown-item cursor-pointer"
                                        onClick={_ => {
                                            api.put('admin/post/hide',{
                                                    post_id: post.id
                                                }, {
                                                
                                                headers: {
                                                    'Content-Type': 'application/json',
                                                    'Authorization': `Bearer ${localStorage.getItem('access')}`,
                                                },

                                            }).then(resp => {
                                                setToastMsg('post hide been updated')
                                                const toastLiveExample = toastRef.current
                                                const toastBootstrap = Toast.getOrCreateInstance(toastLiveExample)
                                                
                                                setHide(!hide)
                                                toastBootstrap.show()
                                                

                                            }).catch(e=>
                                                {console.log('error on post')}
                                            )
                                        }}
                                    >{hide?'unhide':'hide'} post</li>
                                    
                            </ul>
                        </div>

                    </div>
                    {<Markdown className={`ms-3 text-break `} style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{post.description}</Markdown>}
                    <div className="w-100 ps-3 row mb-2 gap-2 clearfix mt-2">
                        {post.tags.map((tag,idx) => <div key={idx} className='rounded-5 ps-2  col d-flex align-items-center ps-1 border-white border  p-1 text-center' >
                            {'#' + tag}
                        </div>)}
                    </div>

                    
                </div>

            </div> : null}
            <div className="toast-container position-fixed bottom-0 end-0 p-3 "     >
                <div ref={toastRef} id="liveToast" className="toast " role="alert" aria-live="assertive" aria-atomic="true">

                    <div className="toast-body d-flex">
                        {toastMsg}
                        <button type="button" className="btn-close ms-auto" data-bs-dismiss="toast" aria-label="Close"></button>
                    </div>
                </div>
            </div>
            
        </>
    )
}

export default PostItem
