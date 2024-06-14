import React, { useState } from 'react'
import { baseUrl } from '../../constants'
import api from '../../axios'

function CommentReply({comment}) {
    const [reply, setReply] = useState('')
    const [replys, setReplys] = useState(comment.replys)
    return (
        <div class="modal fade" id={`staticBackdrop${comment.id}`} data-bs-backdrop="static"  data-bs-theme="light" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable  " >
                <div class="modal-content  ">
                    <div class="modal-header">
                        <div className='bg-dark rounded-5' style={{ height: '35px', width: '35px ', backgroundSize: 'cover', backgroundImage: `url(${baseUrl + comment.profile})` }}>
                        </div>
                        <div className="d-flex flex-column">
                            <p className='ms-3 mb-0  text-secondary' style={{ fontSize: '12px' }}> {comment.user}</p>
                            <p className='mt-1 ms-4 mb-1  text-break  '>{comment.comment}</p></div>
                        <button type="button" className="btn-close " data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <h6>replys</h6>
                        {replys?.length>0?replys.map((rply,idx)=>
                        <div id={idx} className="d-flex border  rounded ms-2 mb-1 me-2 p-1 align-items-center ps-2">
                            <div className='d-flex w-100 ps-1 pt-1'>
                                <div className='bg-light rounded-5' style={{ height: '35px', width: '35px ', backgroundSize: 'cover', backgroundImage: `url(${baseUrl + rply.user.profile})` }}>
                                </div>
                                <div>
                                    <p className='ms-3 mb-0  text-secondary' style={{ fontSize: '12px' }}> {rply.user.username}</p>
                                    <p className='mt-1 ms-4 mb-1 text-break  '>{rply.reply}</p>
                                </div>
                                
                            </div>
                        </div>):<p className='text-secondary'>no replys</p>}
                    </div>
                    <div class="modal-footer">
                        <div className='d-flex gap-2 align-self-end mt-3  mb-2 justify-content-start w-100'>
                            
                        </div>
                        <button type="button" class="btn btn-primary" data-bs-dismiss="modal">Close</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CommentReply 
