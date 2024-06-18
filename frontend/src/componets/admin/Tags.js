import { Toast } from 'bootstrap'
import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../axios'

function Tags() {
    const [tags, setTags] = useState([])
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
        api.get('admin/tags', {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('access')}`,

            },
        }).then(e => {
            setTags(e.data.tags)
            console.log('report', e)
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
                            <th className="col bg-transparent text-dark">tag</th>
                            <th className="col-2  bg-transparent text-dark">action</th>
                        </tr></thead>

                    <tbody className='w-100 h-100'>
                        {tags?.map((tag, idx) =>
                            <tr id={idx} >
                                <th className='text-dark bg-transparent' >{tag.id}</th>
                                <td className='text-dark bg-transparent' style={{ cursor: 'pointer' }} data-bs-toggle="modal" data-bs-target={`#reportBackdrop${tag.id}`} >
                                    {tag.name}
                                </td>
                                <td className='text-dark bg-transparent'>{JSON.stringify(tag.users.length)}</td>
                                
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

export default Tags