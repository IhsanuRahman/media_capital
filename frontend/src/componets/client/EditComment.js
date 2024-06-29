import React, { useRef, useState } from 'react'
import { baseUrl } from '../../constants'
import api from '../../axios'
import { Modal } from 'bootstrap'
function EditComment({ comment ,onSuccess}) {
    const [input, setInput] = useState(comment.comment)
    const ref=useRef()
    return (
        <div ref={ref}  className="modal fade" id={`editBackdrop${comment.id}`} data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" data-bs-theme="dark" aria-labelledby="editBackdropLabel" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable " >
                <div className="modal-content bg-black ">
                    <div className="modal-header">

                        <h5 className="modal-title">Edit Comment</h5>
                        <button type="button" className="btn-close " data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">

                        <div className="mb-3">
                            <label for="recipient-name" className="col-form-label">Comment:</label>
                            <input type="text" className="form-control" id="recipient-name" value={input}
                                onChange={e => {
                                    setInput(e.target.value)
                                }}
                            />
                        </div>

                    </div>
                    <div className="modal-footer">

                        <button type="button" className="btn btn-primary" data-bs-dismiss="modal">Close</button>
                        <button type="button" className="btn btn-success " data-bs-dismiss="modal"
                            onClick={_ => {
                                api.put('posts/comment/edit', {
                                    comment_id: comment.id,
                                    comment: input
                                },
                                    {
                                        headers: {
                                            'Content-Type': 'multipart/form-data',
                                            'Authorization': `Bearer ${localStorage.getItem('access')}`,
                                        },
                                    }
                                ).then(e=>{
                                    const myModal = new Modal(ref.current)
                                    onSuccess(input)
                                    myModal.hide()
                                })
                            }}
                        >save</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default EditComment
