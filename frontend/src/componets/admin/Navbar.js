import React, { useEffect, useState } from 'react'
import LogoutIcon from '@mui/icons-material/Logout';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Users from './Users';
import Posts from './Posts';
import { logout } from '../../features/user';

function Navbar({idx}) {
    
     
   
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [tab, setTab] = useState(idx)
     
  const Tab=({idx,name})=>{return (<tr className=' cursor-pointer'><td className={tab===idx?'rounded bg-primary text-white':'bg-transparent'}  
    onClick={_=>{
      tab!==idx&&setTab(idx)
      navigate('/admin?tab='+idx)
    }}
  >{name}</td></tr>)}
  const Tabs=[null,null,null,null,null,null]
  return (
    <div className="col-2 border-end border-dark h-100 d-flex  flex-column">
          <table className='table table-hover mt-5 bg-transparent text-center fw-bold'>
            <tbody>
              
             <Tab idx={0} name={'user '} />
             <Tab idx={1} name={'posts '} />
             <Tab idx={2} name={'tags '}/>
             <Tab idx={3} name={'reports '}/>
             <Tab idx={4} name={'notifications '}/>
             <Tab idx={5} name={'comments '}/>
                  
            </tbody>
          </table>
          <button className='btn text-danger fw-bolder border-start-0 w-100  mt-auto mb-5 border-end-0 rounded-0 border-dark border-2 '
            onClick={e => {
              dispatch(logout())
              navigate('/admin/login')
            }}
          > <LogoutIcon />  logout</button>


        </div>
  )
}

export default Navbar