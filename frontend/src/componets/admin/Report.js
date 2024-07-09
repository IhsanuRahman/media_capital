import React, { useEffect, useRef, useState } from 'react'
import { baseUrl } from '../../constants'
import api from '../../axios'
import {Modal} from 'bootstrap'
import { useNavigate } from 'react-router-dom'
function Report({ report,actionhandler}) {
    const [reson, setReson] = useState('')
    const [detail, setDetail] = useState('')
    const [error, setError] = useState('')
    const navigator =useNavigate()
    
    return (
        <div  className="modal  fade bg-transparent" id={`reportBackdrop${report.id}`} data-bs-backdrop="static"  data-bs-keyboard="false" tabIndex="-1" aria-labelledby="reportBackdropLabel" aria-hidden="false">
            <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable " >
                <div className="modal-content  text-dark">
                    <div className="modal-header">

                        <h5 className="modal-title">Report</h5>
                        <button type="button" className="btn-close " data-bs-dismiss="modal" aria-label="Close" ></button>
                    </div>
                    <div className="modal-body">

                        <div className="mb-3">
                            <label htmlFor="recipient-name" className="col-form-label">from:</label>
                            <input type="text" readOnly className="form-control" id="reson" value={report.reported_username}
                                
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="recipient-name" className="col-form-label">suspect:</label>
                            <input type="text" readOnly className="form-control" id="reson" value={report.suspect_username}
                                
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="recipient-name" className="col-form-label">problem:</label>
                            <input type="text" readOnly className="form-control" id="reson" value={report.reson}
                                
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="recipient-name" className="col-form-label">Detail:</label>
                            <textarea type="text" readOnly className="form-control" id="detail" value={report.detail}

                                
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="recipient-name" className="col-form-label"><b>on</b>: { report.reported_at}</label>
                        </div>
                        <div className="mb-3 d-flex align-items-center justify-content-between">
                            <button type="text" readOnly className="btn btn-outline-info" id="detail"  data-bs-dismiss="modal" onClick={_=>navigator('/admin/post/' + report.post)} 
                            >view post </button>
                            {report.is_action_taked?<div className='d-flex'>
                                <p>action:{report.action_type}</p>
                            </div>:<div className="dropdown ms-auto me-1 " data-bs-theme="dark" >
                                    <button style={{ cursor: 'pointer' }} className="dropdown-toggle btn btn-warning" data-bs-toggle="dropdown" aria-expanded='false' >take action</button>
                                    <ul className="dropdown-menu dropdown-center position-fixed" >

                                        <li className="dropdown-item cursor-pointer" onClick={_=>actionhandler(report.id,'avoid')}>avoid</li>
                                        <li className="dropdown-item cursor-pointer" onClick={_=>actionhandler(report.id,'ban')} >ban user</li>
                                        <li className="dropdown-item cursor-pointer" style={{ cursor: 'pointer' }}onClick={_=>actionhandler(report.id,'hide')} >hide post</li>
                                    </ul>
                                </div>}
                        </div>

                    </div>
                    <div className="modal-footer">

                        <button type="button" className="btn btn-primary" data-bs-dismiss="modal">Close</button>
                        
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Report
