import React, { useEffect, useRef, useState } from 'react'
import api from '../../axios'
import { baseUrl } from '../../constants'
import { useNavigate } from 'react-router-dom'
import {Toast} from 'bootstrap'
function Users() {
    const [users, setUsers] = useState([])
    const navigate = useNavigate()
    const toastRef = useRef()
    const [msg, setMsg] = useState('')
    useEffect(()=>{
        if (msg!==''){
            const toastLiveExample = toastRef.current
            const toastBootstrap = Toast.getOrCreateInstance(toastLiveExample)
            
            toastBootstrap.show()}
    },[msg])
    const [selectOption, setSelectOption] = useState('none')
    const [selectedList, setSelected] = useState([])
    useEffect(() => {
        api.get('admin/users', {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('access')}`,

            },
        }).then(e => {
            setUsers(e.data.users)
        })
    }, [])
    return (
        <div className='w-100  d-flex flex-column  ' style={{ maxHeight: 'calc(100% - 50px)' }}>
            <div className='d-flex mt-3'>
                <h3 >Users </h3> </div>
            <div className='d-flex ps-5 '>
                <select value={selectOption} onChange={e => {
                    setSelectOption(e.target.value)
                }} className='form-select' aria-label="Default select example" style={{ width: '300px' }}>
                    <option selected value="none">select operations</option>
                    <option value="del">delete users</option>
                    <option value="ban">ban users</option>
                    <option value="unban">unban users</option>
                </select>
                <button className='ms-2 btn btn-success'
                    onClick={_ => {
                        api.post('admin/users/ops', {
                            users_op: selectOption,
                            users: selectedList,
                        }, {
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${localStorage.getItem('access')}`,
                            },
                        }).then(e => {
                            if (selectOption === 'del') {
                                selectedList.map(id => {
                                    const idx = users.map(e => e.id).indexOf(id)
                                    users.splice(idx, 1)
                                    setUsers([...users])
                                })
                                setMsg('users is deletions success')
                            } else if (selectOption === 'ban') {
                                let tlist = [...users]
                                const idxs = users.map(e => e.id)
                                selectedList.map(id => {
                                    tlist[idxs.indexOf(id)].is_banned = true
                                })
                                setUsers([...tlist])
                                setMsg('users is ban success')
                            } else if (selectOption === 'unban') {
                                let tlist = [...users]
                                const idxs = users.map(e => e.id)
                                selectedList.map(id => {
                                    tlist[idxs.indexOf(id)].is_banned = false
                                })
                                setUsers([...tlist])
                                setMsg('users is unban success')
                            }
                                setSelectOption('none')
                                setSelected([])
                            
                        })
                    }}
                >DO</button>
            </div>
            <div className='w-100 overflow-y-auto '>
                <table className='table table-dark text-dark  ' style={{ width: '98%', }}>
                    <thead className='w-100'>
                        <tr className=''>
                            <th className='col-1 bg-transparent text-dark'>
                                <input type="checkbox" name="" id="" className=''
                                            
                                    onChange={
                                        e => {
                                            if (e.target.checked) {
                                                setSelected(users.map(user => user.id))

                                            } else {
                                                setSelected([])
                                            }
                                        }
                                    }
                                /></th>
                            <th className="col-1 bg-transparent text-dark">profile</th>
                            <th className="col bg-transparent text-dark">name</th>
                            <th className="col-2  bg-transparent text-dark">ban</th>
                        </tr></thead>

                    <tbody className='w-100 h-100'>
                        {users?.map((user, idx) =>
                            <tr key={idx} >
                                <th className='  text-dark bg-transparent' ><input type="checkbox" name="" id="" className='c-12'
                                    checked={selectedList.includes(user.id)}
                                    
                                    onChange={e => {
                                        const ind = selectedList.indexOf(user.id)
                                        if (ind !== -1) {

                                            selectedList.splice(ind, 1)
                                            setSelected([...selectedList])
                                        } else {
                                            setSelected([...selectedList, user.id])
                                        }
                                    }
                                    }
                                /></th>
                                <td className=' bg-transparent text-dark' onClick={_=>navigate('/admin/user/'+user.id)}><img src={baseUrl + user.profile} height={'50'} alt="" className=' rounded-circle' /></td>
                                <td className='text-dark bg-transparent'  onClick={_=>navigate('/admin/user/'+user.id)}>
                                    <div className='d-flex flex-column mb-0 ' style={{ height: '70px' }}>
                                        <p className='fw-medium mb-0 fs-5 '>{user.username}</p>
                                        <p className='ms-2 mb-0 small '>{user.first_name} {user.last_name}</p>
                                    </div>
                                </td>
                                <td className='text-dark bg-transparent'><button className='btn btn-danger'
                                    onClick={e => {
                                        
                                        if (user.is_banned) {
                                            api.put('admin/user/unban', { user_id: user.id }, {
                                                headers: {
                                                    'Content-Type': 'application/json',
                                                    'Authorization': `Bearer ${localStorage.getItem('access')}`,

                                                },
                                            }).then(e => {
                                                let tlist = [...users]
                                                user.is_banned = false
                                                tlist[idx] = user
                                                setUsers(tlist)
                                                setMsg('users is unban success')
                                            })
                                        }
                                        else {
                                            api.put('admin/user/ban', { user_id: user.id }, {
                                                headers: {
                                                    'Content-Type': 'application/json',
                                                    'Authorization': `Bearer ${localStorage.getItem('access')}`,

                                                },
                                            }).then(e => {
                                                let tlist = [...users]
                                                user.is_banned = true
                                                tlist[idx] = user
                                                setUsers(tlist)
                                                setMsg('users is ban success')
                                            })
                                        }
                                    }}
                                >{user.is_banned ? 'unban' : 'ban'}</button></td>
                            </tr>)}
                        {/* <tr>
                        <th className='col-1'><input type="checkbox" name="" id="" className='c-12' /></th>
                        <td>Jacob</td>
                        <td>Thornton</td>
                        <td>@fat</td>
                    </tr>
                    <tr>
                        <th className='col-1'><input type="checkbox" name="" id="" className='' /></th>
                        <td>Larry the Bird</td>
                        <td>@twitter</td>
                    </tr> */}
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

export default Users


