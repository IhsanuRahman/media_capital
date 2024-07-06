import React, {  useRef, useState } from 'react'
import { baseUrl } from '../../constants'
import ratingSvg from '../../assets/Star.svg';
import option from '../../assets/options.svg';
import Markdown from 'markdown-to-jsx'
import { useNavigate } from 'react-router-dom';
import api from '../../axios';
import { Rating, Stack } from '@mui/material';
import { useSelector } from 'react-redux';
import { Toast } from 'bootstrap';
import Report from './Report'
import formatNumber from '../../NumberFormater';

function PostItem({ post }) {
    const { user } = useSelector(state => state.user)
    const navigator = useNavigate()
    const [commentInput, setCommentInput] = useState('')
    const [overAllRate, setAllRate] = useState(post.rating)
    const [no_raters, setRaters] = useState(post.no_raters)
    const [view, setView] = useState(false)
    const [is_saved, setSave] = useState(post.is_saved)
    const toastRef = useRef()
    const [toastMsg, setToastMsg] = useState('')
    const [visible, setVisible] = useState(true)
    const [report, setReport] = useState(false)
    return (
        <>
            {visible ? <div className='  rounded-1 post-item' style={{ borderColor: '#494949', borderWidth: '2px ', borderStyle: 'solid' }}>
                <div className='d-flex align-items-center ps-2   w-100 ' style={{ minHeight: "45px", maxHeight: "45px", borderColor: '#494949', borderWidth: '0 0 2px 0', borderStyle: 'solid' }}>
                    <div className='bg-light rounded-5' onClick={e => navigator('/user/' + post.user.id)} loading="lazy" style={{ height: '35px', width: '35px ', backgroundSize: 'cover', backgroundImage: `url(${baseUrl + post.user.profile})` }}>
                    </div>
                    <h6 className='ms-3' onClick={e => user.id === post.user.id ? navigator('/profile') : navigator('/user/' + post.user.id)}>{post.user.username}</h6>

                </div>
                <div className='w-100' style={{ borderColor: '#494949', borderWidth: '0 0 2px 0', borderStyle: 'solid' }}
                    onClick={e => {
                        navigator('/post/' + post.id)
                    }}
                >
                    <img src={baseUrl + post.image} alt="" style={{ width: '100%', height: '350px' }} />
                </div>
                <div className='w-100 justify-content-between d-flex flex-column justify-content-between' >
                    <div className="d-flex w-100 ps-1 mt-2">
                        <Stack spacing={1} className='d-flex flex-row'>
                            <div className="d-flex gap-2 flex-column ">
                                <h6 className='pt-2'>All over:</h6>
                                {post.user.id !== user.id && <h6>Your Rating:</h6>}
                               {post.no_raters?  <p className='text-primary'>{formatNumber(no_raters)} raters</p>:<p className='text-primary'>no raters</p>}</div>

                            <div className="d-flex gap-2 flex-column">
                                <Rating name="half-rating-read" value={overAllRate} precision={0.1} readOnly onChange={(event, newValue) => {

                                }} emptyIcon={
                                    <img src={ratingSvg} alt="" srcSet="" />} />
                                {post.user.id !== user.id && <Rating name="half-rating" defaultValue={post.my_rate} precision={0.1}
                                    onChange={(_, newValue) => {
                                        api.put('/posts/rate/add', {
                                            id: post.id,
                                            rate: newValue === null ? 0 : newValue
                                        }, {
                                            headers: {
                                                'Content-Type': 'application/json',
                                                'Authorization': `Bearer ${localStorage.getItem('access')}`,

                                            },

                                        }).then(e => {
                                            setAllRate(e.data.rate)
                                            setRaters(e.data.no_raters)
                                        })
                                        post.rating = newValue
                                    }}
                                    emptyIcon={
                                        <img src={ratingSvg} alt="" srcSet="" />} />}</div>

                        </Stack>
                        <div className="dropdown ms-auto me-1 " data-bs-theme="dark" >
                            <img src={option} alt="" srcSet="" style={{ cursor: 'pointer' }} className="dropdown-toggle" data-bs-toggle="dropdown" aria-expanded='false' />
                            <ul className="dropdown-menu dropdown-center " >

                                {post.user.id === user.id ?
                                    <li className="dropdown-item cursor-pointer"
                                        onClick={_ => {
                                            api.delete('post/delete', {
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
                                                setVisible(false)
                                                toastBootstrap.show()


                                            })
                                        }}
                                    >delete post</li>
                                    :
                                    <>
                                        <li className="dropdown-item cursor-pointer"
                                            onClick={_ => {
                                                api.patch('post/save', {
                                                    post_id: post.id
                                                }, {
                                                    headers: {
                                                        'Content-Type': 'application/json',
                                                        'Authorization': `Bearer ${localStorage.getItem('access')}`,

                                                    },

                                                }).then(e => {
                                                    setToastMsg(`post has been ${is_saved ? 'unsaved' : 'saved'}`)
                                                    setSave(!is_saved)
                                                    const toastLiveExample = toastRef.current

                                                    const toastBootstrap = Toast.getOrCreateInstance(toastLiveExample)
                                                    toastBootstrap.show()
                                                })
                                            }}
                                        >{is_saved === true && 'un'}save post</li>
                                        <li className="dropdown-item cursor-pointer" style={{ cursor: 'pointer' }} onClick={_ => setReport(true)}>report</li></>}
                            </ul>
                        </div>
                        {report && <Report post={post} close={_ => setReport(false)} onSuccess={_ => {
                            setToastMsg('report is submited')
                            const toastLiveExample = toastRef.current
                            const toastBootstrap = Toast.getOrCreateInstance(toastLiveExample)
                            toastBootstrap.show()
                            setReport(false)
                        }} />}

                    </div>
                    {<Markdown className={`ms-3 text-break mb-0 pb-0 `} style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: view?'wrap':'nowrap' }}>{post.description}</Markdown>}
                    <p onClick={_=>setView(!view)} className="text-primary pt-0 mt-0 cursor-pointer pb-0 mb-0">view {view?'less':'more'}</p>
                    <div className="w-100 ps-3 row mb-2 gap-2 clearfix mt-2">
                        {post.tags.map((tag,idx) => <div key={idx} className='rounded-5 ps-2  col d-flex align-items-center ps-1 border-white border  p-1 text-center' >
                            {'#' + tag}
                        </div>)}
                    </div>

                    <div className='d-flex gap-2 align-self-end mt-2  mb-2 justify-content-start w-100'>
                        <input type="text" name="" value={commentInput} placeholder="comment" className="form-control w-50 ms-2 rounded-5 text-white whiteholder border-0" style={{ height: '25px', backgroundColor: '#494949' }}
                            onChange={e => {
                                setCommentInput(e.target.value)
                            }}
                        />
                        <button className='w-25 rounded-pill border-0 text-white fwbold' style={{ backgroundColor: '#233543' }}
                            onClick={e => {
                                api.post('posts/comment/add', {
                                    post_id: post.id,
                                    comment: commentInput,
                                }, {
                                    headers: {
                                        'Content-Type': 'application/json',
                                        'Authorization': `Bearer ${localStorage.getItem('access')}`,

                                    },

                                })
                                setCommentInput('')
                            }}
                        >post</button>
                    </div>
                </div>

            </div> : null}
            <div className="toast-container position-fixed bottom-0 end-0 p-3 " data-bs-theme="dark">
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
