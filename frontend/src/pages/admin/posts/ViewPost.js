import React, { useEffect, useRef, useState } from 'react'
import { baseUrl } from '../../../constants'
import ratingSvg from '../../../assets/StarLight.svg';
import deleteIcon from '../../../assets/delete.svg';
import Markdown from 'markdown-to-jsx'
import api from '../../../axios';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import Header from '../../../componets/admin/Header';
import { Stack, Rating } from '@mui/material';
import CommentReply from '../../../componets/admin/CommentReply';
import moment from 'moment'
import { useSelector } from 'react-redux';
import { Toast } from 'bootstrap';
import EditComment from '../../../componets/client/EditComment';
import Navbar from '../../../componets/admin/Navbar';
import ArrowLeftTwoToneIcon from '@mui/icons-material/ArrowLeftTwoTone';

function ViewPost() {
    const { user } = useSelector(state => state.user)
    const { id } = useParams()
    const [post, setPost] = useState()
    const toastRef = useRef()
    const [toastMsg, setToastMsg] = useState('')
    const [posted_at, setPostedAt] = useState()
    const [comments, setComments] = useState([])
    const navigator = useNavigate()
    const getPost = () => {
        api.get('posts/get', {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${localStorage.getItem('access')}`,
            },
            params: { 'id': id },
        }).then(e => {
            setPost(e.data.post)
            const dateTime = moment.utc(e.data.post.posted_at).local().startOf('seconds').fromNow()
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
        <div className='pt-5 bg-main text-dark d-flex justify-content-center align-items-center  h-100 w-100'>
            <Header leading={
                <ArrowLeftTwoToneIcon className='text-dark cursor-pointer h-100 fs-1' onClick={e=>{navigator('/admin?tab=1')}}/>
            }/>
            <div className='row h-100 d-flex w-100' >
                <Navbar idx={1} />

                <div className="col pe-0 overflow-hidden h-100">
                    {post && <div className='w-100  flex-column gap-2  d-flex overflow-y-scroll align-items-center hidescroller pt-2' style={{ maxHeight: (window.innerHeight - 80) + 'px', }}>
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
                                <h6 className=' mt-1'>All over:</h6>
                                <Stack spacing={1} >
                                    <Rating name="half-rating-read" value={overAllRate} precision={0.1} readOnly onChange={(event, newValue) => {

                                    }} emptyIcon={
                                        <img src={ratingSvg} alt="" srcSet="" />} />

                                </Stack>
                                <p className='text-muted'>{posted_at}</p>

                                <Markdown className={`ms-3 text-break `}  >{post.description}</Markdown>
                                <div className="w-100 ps-3 row gap-2 mt-2 clearfix mt-2">
                                    {post.tags.map((tag,idx) => <div key={idx} className='rounded-5 ps-2  col d-flex align-items-center ps-1 border-dark border  p-1 text-center' >
                                        {'#' + tag}
                                    </div>)}
                                </div>

                                <hr />
                                <h5 className='ps-2'>Comments</h5>
                                <div className='d-flex flex-column'>
                                    {comments.map((comment, idx) => {
                                        const DateTime = moment.utc(comment.posted_at).local().startOf('seconds').fromNow()

                                        return <div key={idx} className="d-flex border border-dark   rounded ms-2 mb-1 me-2 p-1 align-items-center ps-2">
                                            <div className='d-flex w-100 ps-1 pt-1'>
                                                <div className='bg-light rounded-5' style={{ height: '35px', width: '35px ', backgroundSize: 'cover', backgroundImage: `url(${baseUrl + comment.profile})` }}>
                                                </div>
                                                <div>
                                                    <p className='ms-3 mb-0  text-muted' style={{ fontSize: '12px' }}> {comment.user}</p>
                                                    <p className='mt-1 ms-4 mb-1  text-break  '>{comment.comment}</p>
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
                                                    <p className=' text-muted mb-0'>{DateTime}</p>
                                                    <button className='btn  ms-auto mt-0'
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
                                                    </button>
                                                </div>
                                            </div>

                                        </div>
                                    })}
                                    {comments.length === 0 && <p className='w-100 ps-4 text-muted'>no comments</p>}
                                </div>
                            </div>
                        </div>
                    </div>}
                </div>
            </div>
            <div className="toast-container position-fixed bottom-0 end-0 p-3 " >
                <div ref={toastRef} id="liveToast" className="toast " role="alert" aria-live="assertive" aria-atomic="true">

                    <div className="toast-body d-flex text-dark">
                        {toastMsg}
                        <button type="button" className="btn-close ms-auto" data-bs-dismiss="toast" aria-label="Close"></button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ViewPost
