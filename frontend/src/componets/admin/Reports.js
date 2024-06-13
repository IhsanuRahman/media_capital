import React, { useEffect, useRef, useState } from 'react'
import api from '../../axios'
import { baseUrl } from '../../constants'
import { useNavigate } from 'react-router-dom'
import { Toast } from 'bootstrap'
import Report from './Report'
function Reports() {
    const [reports, setReports] = useState([])
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
        api.get('admin/reports', {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('access')}`,

            },
        }).then(e => {
            setReports(e.data.reports)
            console.log('report', e)
        })
    }, [])
    const actionhandler=(id,action)=>{
        api.put('admin/report/action',{
            report_id:id,
            action:action,
        },{
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('access')}`,
            },
        }).then(e=>{
            setMsg(action+' success')
            api.get('admin/reports', {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('access')}`,
    
                },
            }).then(e => {
                setReports(e.data.reports)
                console.log('report', e)
            })
        })
    }
    return (
        <div className='w-100  d-flex flex-column  ' style={{ maxHeight: 'calc(100% - 50px)' }}>
            <div className='d-flex mt-3'>
                <h3 >Reports</h3> </div>

            <div className='w-100 overflow-y-auto'>
                <table className='table table-dark text-dark  ' style={{ width: '98%', }}>
                    <thead className='w-100'>
                        <tr className=''>
                            <th className='col-1 bg-transparent text-dark'>id</th>
                            <th className="col bg-transparent text-dark">report</th>
                            <th className="col-2  bg-transparent text-dark">action</th>
                        </tr></thead>

                    <tbody className='w-100 h-100'>
                        {reports?.map((report, idx) =>
                            <tr id={idx} >
                                <th className='text-dark bg-transparent' >{report.id}</th>
                                <td className='text-dark bg-transparent' style={{ cursor: 'pointer' }} data-bs-toggle="modal" data-bs-target={`#reportBackdrop${report.id}`} >
                                    <div className='d-flex flex-column mb-0 ' style={{ height: '70px' }}>
                                        <p className='fw-medium mb-0 fs-5 '>{report.reported_username}</p>
                                        <p className='ms-2 mb-0 small '> {report.reson}</p>
                                    </div>
                                </td>
                                <td className='text-dark bg-transparent'>
                                    {!report.is_action_taked?<div className="dropdown ms-auto me-1 " data-bs-theme="dark" >
                                    <button style={{ cursor: 'pointer' }} className="dropdown-toggle btn btn-warning" data-bs-toggle="dropdown" aria-expanded='false' >take action</button>
                                    <ul className="dropdown-menu dropdown-center position-fixed" >

                                        <li className="dropdown-item cursor-pointer" onClick={_=>actionhandler(report.id,'avoid')}>avoid</li>
                                        <li className="dropdown-item cursor-pointer" onClick={_=>actionhandler(report.id,'ban')} >ban user</li>
                                        <li className="dropdown-item cursor-pointer" style={{ cursor: 'pointer' }}onClick={_=>actionhandler(report.id,'hide')} >hide post</li>
                                    </ul>
                                </div>:<p>action taked</p>}</td>
                                <Report report={report} actionhandler={actionhandler}/>
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

export default Reports


