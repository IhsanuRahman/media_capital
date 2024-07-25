import React, { useState } from 'react'
import { baseUrl } from '../../constants'
import api from '../../axios'

function CommentReply({comment}) {
    const [reply, setReply] = useState('')
    const [replys, setReplys] = useState(comment.replys)
    return (
        <div className="modal fade" id={`staticBackdrop${comment.id}`} data-bs-backdrop="static"  data-bs-theme="dark" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable " >
                <div className="modal-content bg-black ">
                    <div className="modal-header">
                        <div className='bg-light rounded-5' style={{ height: '35px', width: '35px ', backgroundSize: 'cover', backgroundImage: `url(${baseUrl + comment.profile})` }}>
                        </div>
                        <div className="d-flex flex-column">
                            <p className='ms-3 mb-0  text-secondary' style={{ fontSize: '12px' }}> {comment.user}</p>
                            <p className='mt-1 ms-4 mb-1 text-white text-break  '>{comment.comment}</p></div>
                        <button type="button" className="btn-close " data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        <h6>replys</h6>
                        {replys.map((rply,idx)=>
                        <div key={idx} className="d-flex border  rounded ms-2 mb-1 me-2 p-1 align-items-center ps-2">
                            <div className='d-flex w-100 ps-1 pt-1'>
                                <div className='bg-light rounded-5' style={{ height: '35px', width: '35px ', backgroundSize: 'cover', backgroundImage: `url(${baseUrl + rply.user.profile})` }}>
                                </div>
                                <div>
                                    <p className='ms-3 mb-0  text-secondary' style={{ fontSize: '12px' }}> {rply.user.username}</p>
                                    <p className='mt-1 ms-4 mb-1 text-white text-break  '>{rply.reply}</p>
                                </div>
                            </div>
                        </div>)}
                    </div>
                    <div className="modal-footer">
                        <div className='d-flex gap-2 align-self-end mt-3  mb-2 justify-content-start w-100'>
                            <input type="text" name="" placeholder="reply" value={reply}
                                onChange={e => {
                                    setReply(e.target.value)
                                }}
                                className="form-control w-50 ms-2 rounded-5 text-white whiteholder border-0" style={{ height: '25px', backgroundColor: '#494949' }} />
                            <button className='w-25 rounded-pill border-0 text-white fwbold' style={{ backgroundColor: '#233543' }}
                                onClick={e => {
                                    if (reply !== '') {
                                        api.post('posts/comment-reply/add', {
                                            'comment_id': comment.id,
                                            reply: reply,
                                        },{ headers: {
                                            'Content-Type': 'multipart/form-data',
                                            'Authorization': `Bearer ${localStorage.getItem('access')}`,
                                        },}).then(e => {
                                            setReplys([e.data.reply,...replys])
                                        })
                                    setReply('')
                                    }
                                }}
                            >add reply</button>
                        </div>
                        <button type="button" className="btn btn-primary" data-bs-dismiss="modal">Close</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CommentReply 
