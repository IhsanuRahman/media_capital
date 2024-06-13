import React, { useEffect, useRef, useState } from 'react'
import { baseUrl } from '../../constants'
import api from '../../axios'
import { Modal } from 'bootstrap'
function Report({ post, onSuccess ,close}) {
    const [reson, setReson] = useState('')
    const [detail, setDetail] = useState('')
    const [error, setError] = useState('')
    const ref = useRef()
    useEffect(() => {
        const myModal = new Modal(ref.current)
        myModal.show()


    }, [])
    return (
        <div ref={ref} className="modal show fade" id={`reportBackdrop${post.id}`} data-bs-backdrop="false" data-bs-keyboard="false" tabIndex="-1" data-bs-theme="dark" aria-labelledby="reportBackdropLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable " >
                <div class="modal-content bg-black ">
                    <div class="modal-header">

                        <h5 class="modal-title">Report</h5>
                        <button type="button" className="btn-close " data-bs-dismiss="modal" aria-label="Close" onClick={_ =>
                            close()}></button>
                    </div>
                    <div class="modal-body">

                        <div className="mb-3">
                            <label for="recipient-name" class="col-form-label">Reson:</label>
                            <input type="text" className="form-control" id="reson" value={reson}
                                onChange={e => {
                                    setReson(e.target.value)
                                }}
                            />
                        </div>
                        <div className="mb-3">
                            <label for="recipient-name" class="col-form-label">Detail:</label>
                            <textarea type="text" className="form-control" id="detail" value={detail}

                                onChange={e => {
                                    setDetail(e.target.value)
                                }}
                            />
                        </div>
                        {error !== '' && <li className='text-danger'>{error}</li>}

                    </div>
                    <div class="modal-footer">

                        <button type="button" className="btn btn-primary" data-bs-dismiss="modal" onClick={_ =>
                            close()}>Close</button>
                        <button type="button" className="btn btn-success "
                            onClick={e => {

                                if (reson === '' || detail === '') {
                                    setError('reson or detail about report is required')

                                } else {
                                    api.post('post/report/add', {
                                        post_id: post.id,
                                        reson: reson,
                                        detail:detail,
                                    },
                                        {
                                            headers: {
                                                'Content-Type': 'multipart/form-data',
                                                'Authorization': `Bearer ${localStorage.getItem('access')}`,
                                            },
                                        }
                                    ).then(e => {
                                        onSuccess()

                                    })
                                }

                            }}
                        >submit</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Report
