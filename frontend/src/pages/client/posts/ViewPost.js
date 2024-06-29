import React, { useEffect, useRef, useState } from 'react'
import { baseUrl } from '../../../constants'
import ratingSvg from '../../../assets/Star.svg';
import ratingHalfSvg from '../../../assets/Half_filled_star.svg';
import deleteIcon from '../../../assets/delete.svg';
import option from '../../../assets/options.svg';
import Markdown from 'markdown-to-jsx'
import api from '../../../axios';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import Header from '../../../componets/client/Header';
import { Stack, Rating } from '@mui/material';
import CommentReply from '../../../componets/client/CommentReply';
import moment from 'moment'
import { useSelector } from 'react-redux';
import { Toast } from 'bootstrap';
import EditComment from '../../../componets/client/EditComment';
import Report from '../../../componets/client/Report';
import formatNumber from '../../../NumberFormater';



function ViewPost() {
    const { user } = useSelector(state => state.user)
    const { id } = useParams()
    const [comment, setComment] = useState('')
    const [post, setPost] = useState()
    const toastRef = useRef()
    const [toastMsg, setToastMsg] = useState('')

    const [is_saved, setSave] = useState(true)
    const [visible, setVisible] = useState(true)
    const [report, setReport] = useState(false)
    const [posted_at, setPostedAt] = useState()
    const [comments, setComments] = useState([])
    const navigator = useNavigate()
    const getPost = () => {
        api.get('/posts/get', {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${localStorage.getItem('access')}`,
            },
            params: { 'id': id },
        }).then(e => {
            setPost(e.data.post)
            setSave(e.data.is_saved)
            const dateTime = moment.utc(e.data.post.posted_at.replace('+', '00+')).local().startOf('seconds').fromNow()
            setPostedAt(dateTime)
            setAllRate(parseFloat(e.data.post.rating))
            setComments(e.data.post.comments)
        })

    }
    const [overAllRate, setAllRate] = useState(0)
    useEffect(() => {
        getPost()
    }, [id])
    return (
        <div className='pt-5 h-100 w-100'>
            <Header />
            
            {post && <div className='w-100 reponsive-border flex-column gap-2  d-flex overflow-y-scroll align-items-center hidescroller pt-2' style={{ maxHeight: (window.innerHeight - 90) + 'px', }}>
                <div className='  rounded-1 ' style={{ width: '600px', borderColor: '#494949', borderWidth: '2px ', borderStyle: 'solid' }}>
                    <div className='d-flex align-items-center ps-2   w-100 ' style={{ minHeight: "45px", maxHeight: "45px", borderColor: '#494949', borderWidth: '0 0 2px 0', borderStyle: 'solid' }}>
                        <div className='bg-light rounded-5' style={{ height: '35px', width: '35px ', backgroundSize: 'cover', backgroundImage: `url(${baseUrl + post.user.profile})` }}>
                        </div>
                        <h6 className='ms-3'>{post.user.username}</h6>
                    </div>
                    <div className='w-100' style={{ borderColor: '#494949', borderWidth: '0 0 2px 0', borderStyle: 'solid' }}>
                        <img src={baseUrl + post.image} alt="" style={{ width: '100%', height: '550px' }} />
                    </div>
                    <div className='w-100 justify-content-between d-flex flex-column ps-1' style={{}}>

                        <div className='d-flex'><Stack spacing={1} >
                            <h6 className=' mt-1'>All over:</h6>


                            <Rating name="half-rating-read" value={overAllRate} precision={0.1} readOnly onChange={(event, newValue) => {

                            }} emptyIcon={
                                <img src={ratingSvg} alt="" srcSet="" />} />
                            <h6>Your Rating:</h6>
                            <Rating name="half-rating" defaultValue={post.my_rate} precision={0.1}
                                onChange={(event, newValue) => {
                                    api.put('/posts/rate/add', {
                                        id: post.id,
                                        rate: newValue
                                    }, {
                                        headers: {
                                            'Content-Type': 'application/json',
                                            'Authorization': `Bearer ${localStorage.getItem('access')}`,

                                        },

                                    }).then(e => {

                                        getPost()
                                        setAllRate(e.data.rating)
                                    })
                                }}
                                emptyIcon={
                                    <img src={ratingSvg} alt="" srcSet="" />} />
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
                                                        setToastMsg(`post has been ${post.is_saved ? 'unsaved' : 'saved'}`)
                                                        getPost()
                                                        const toastLiveExample = toastRef.current

                                                        const toastBootstrap = Toast.getOrCreateInstance(toastLiveExample)
                                                        toastBootstrap.show()
                                                    })
                                                }}
                                            >{post.is_saved === true ? 'un':''}save post {is_saved}</li>
                                            <li className="dropdown-item cursor-pointer" style={{ cursor: 'pointer' }} onClick={_ => setReport(true)}>report</li></>}
                                </ul>
                            </div> </div>
                        {report && <Report post={post} close={_ => setReport(false)} onSuccess={_ => {
                            setToastMsg('report is submited')
                            const toastLiveExample = toastRef.current
                            const toastBootstrap = Toast.getOrCreateInstance(toastLiveExample)
                            toastBootstrap.show()
                            setReport(false)
                        }} />}
                        {post.no_raters&&  <p className='text-primary'>{formatNumber(post.no_raters)} raters</p>}
                        <p className='text-secondary'>{posted_at}</p>

                        <Markdown className={`ms-3 text-break `}  >{post.description}</Markdown>
                        <div className="w-100 ps-3 row gap-2 mt-2 clearfix mt-2">
                            {post.tags.map((tag,idx) => <div key={idx}  className='rounded-5 ps-2  col d-flex align-items-center ps-1 border-white border  p-1 text-center' >
                                {'#' + tag}
                            </div>)}
                        </div>
                        <hr />
                        <h5 className='ps-2'>Comments</h5>
                        <div className='d-flex flex-column'>
                            {comments.map((comment, idx) => {
                                const DateTime = moment.utc(comment.posted_at.replace(':+','+')).local().startOf('seconds').fromNow()

                                return <div id={idx} className="d-flex border  rounded ms-2 mb-1 me-2 p-1 align-items-center ps-2">
                                    <div className='d-flex w-100 ps-1 pt-1'>
                                        <div className='bg-light rounded-5' style={{ height: '35px', width: '35px ', backgroundSize: 'cover', backgroundImage: `url(${baseUrl + comment.profile})` }}>
                                        </div>
                                        <div>
                                            <p className='ms-3 mb-0  text-secondary' style={{ fontSize: '12px' }}> {comment.user}</p>
                                            <p className='mt-1 ms-4 mb-1 text-white text-break  '>{comment.comment}</p>
                                            <div className="d-flex gap-2 ">
                                                <p className='text-primary  mt-0' style={{ cursor: 'pointer' }} data-bs-toggle="modal" data-bs-target={`#staticBackdrop${comment.id}`}>replys</p>

                                                {comment.user_id === user.id && <p className='text-primary  mt-0' style={{ cursor: 'pointer' }} data-bs-toggle="modal" data-bs-target={`#editBackdrop${comment.id}`}>edit</p>
                                                }</div>

                                            <CommentReply comment={comment} />
                                            <EditComment comment={comment} onSuccess={comment => {

                                                setToastMsg('comment has been edited')

                                                const toastLiveExample = toastRef.current
                                                const toastBootstrap = Toast.getOrCreateInstance(toastLiveExample)
                                                comments[idx].comment = comment
                                                setComments([...comments])
                                                toastBootstrap.show()

                                            }} />
                                        </div>
                                        <div className='ms-auto d-flex flex-column '>
                                            <p className=' text-secondary mb-0'>{DateTime}</p>
                                            {comment.user_id === user.id && <button className='btn  ms-auto mt-0'
                                                onClick={_ => {
                                                    api.delete('posts/comment/delete', {
                                                        data: {
                                                            comment_id: comment.id
                                                        },
                                                        headers: {
                                                            'Content-Type': 'application/json',
                                                            'Authorization': `Bearer ${localStorage.getItem('access')}`,

                                                        },

                                                    }).then(e => {
                                                        comments.splice(idx, 1)
                                                        setToastMsg('comment has been deleted')

                                                        const toastLiveExample = toastRef.current
                                                        const toastBootstrap = Toast.getOrCreateInstance(toastLiveExample)
                                                        setComments([...comments])
                                                        toastBootstrap.show()
                                                    })

                                                }}
                                            >
                                                <img src={deleteIcon} width={'20px'} height={'20px'} />
                                            </button>}
                                        </div>
                                    </div>

                                </div>
                            })}
                        </div>
                        <div className='d-flex gap-2 align-self-end mt-3  mb-2 justify-content-start w-100'>
                            <input type="text" name="" placeholder="comment" value={comment}
                                onChange={e => {
                                    setComment(e.target.value)
                                }}
                                className="form-control w-50 ms-2 rounded-5 text-white whiteholder border-0" style={{ height: '25px', backgroundColor: '#494949' }} />
                            <button className='w-25 rounded-pill border-0 text-white fwbold' style={{ backgroundColor: '#233543' }}
                                onClick={e => {
                                    if (comment !== '') {
                                        api.post('posts/comment/add', {
                                            post_id: post.id,
                                            comment: comment,
                                        }).then(e => {

                                            getPost()
                                        })
                                    }
                                    setComment('')
                                }}
                            >post</button>
                        </div>
                    </div>
                </div>
            </div>}
            <div className="toast-container position-fixed bottom-0 end-0 p-3 " data-bs-theme="dark">
                <div ref={toastRef} id="liveToast" className="toast " role="alert" aria-live="assertive" aria-atomic="true">

                    <div className="toast-body d-flex">
                        {toastMsg}
                        <button type="button" className="btn-close ms-auto" data-bs-dismiss="toast" aria-label="Close"></button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ViewPost
