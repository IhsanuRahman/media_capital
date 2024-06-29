import { Toast } from 'bootstrap'
import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../axios'
import CommentReply from './CommentReply'

function Comments() {
    const [comments, setComments] = useState([])
    const navigate = useNavigate()
    const toastRef = useRef()
    const [msg, setMsg] = useState('')
    useEffect(() => {
        if (msg !== '') {
            const toastLiveExample = toastRef.current
            const toastBootstrap = Toast.getOrCreateInstance(toastLiveExample)

            toastBootstrap.show()
        }
    }, [msg])
    useEffect(() => {
        api.get('admin/comments', {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('access')}`,

            },
        }).then(e => {
            setComments(e.data.comments)
        })
    }, [])
  return (
    <div className='w-100  d-flex flex-column  ' style={{ maxHeight: 'calc(100% - 50px)' }}>
            <div className='d-flex mt-3'>
                <h3 >Reports</h3> </div>

            <div className='w-100 overflow-y-auto'>
                <table className='table table-dark text-dark  ' style={{ width: '98%', }}>
                    <thead className='w-100'>
                        <tr className=''>
                            <th className='col-1 bg-transparent text-dark'>id</th>
                            <th className="col bg-transparent text-dark">comment</th>
                            <th className="col-2 bg-transparent text-dark">user</th>
                            <th className="col-2 bg-transparent text-dark">post</th>
                            <th className="col-2 bg-transparent text-dark">replay</th>
                            
                        </tr></thead>

                    <tbody className='w-100 h-100'>
                        {comments?.map((comment, idx) =>
                            <tr key={idx} >
                                <th className='text-dark bg-transparent' >{comment.id}</th>
                                <td className='text-dark bg-transparent'  >
                                    {comment.comment}
                                </td>
                                <th className='text-dark bg-transparent' >{comment.username}</th>
                                <th className='text-dark bg-transparent' >
                                    <button className='btn btn-link' onClick={_=>navigate('/admin/post/' + comment.post)}> view post</button>
                                   </th>
                                <th className='text-dark bg-transparent' > <button className='btn btn-link'style={{ cursor: 'pointer' }} data-bs-toggle="modal" data-bs-target={`#staticBackdrop${comment.id}`} > view replays</button> </th>
                                <CommentReply comment={comment} />
                                
                                
                            </tr>)}

                    </tbody>
                </table></div>
            <div className="toast-container position-fixed bottom-0 end-0 p-3 " >
                <div ref={toastRef} id="liveToast" className="toast " role="alert" aria-live="assertive" aria-atomic="true">

                    <div className="toast-body d-flex">
                        {msg}
                        <button type="button" className="btn-close ms-auto" data-bs-dismiss="toast" aria-label="Close"></button>
                    </div>
                </div>
            </div>
        </div>
  )
}

export default Comments