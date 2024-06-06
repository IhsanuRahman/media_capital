import React, { useEffect, useRef, useState } from 'react'
import Header from '../../../componets/client/Header'
import three_dots from '../../../assets/three_dots.svg'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { baseUrl } from '../../../constants';
import Posts from '../../../componets/client/Posts';
import api from '../../../axios';
import GridPosts from '../../../componets/client/GridPosts';
import {Toast} from 'bootstrap'
import { getUser } from '../../../features/user';
function ViewUser() {
  const { id } = useParams()
  const dispatch =useDispatch()
  const { isAuthenticated, user, loading } = useSelector(state => state.user);
  const [userData, setUserData] = useState({

  })
  const tostRef = useRef()
  const navigator = useNavigate()
  const [posts, setPosts] = useState([])
  const setData = () => {
    api.get('/profile/user', {
      params: { 'id': id },
      headers: { 'Authorization': `Bearer ${localStorage.getItem('access')}` },
    }).then(e => {
      setPosts(e.data.posts)
      setUserData(e.data.userData)
    })
  }
  useEffect(() => {
    if (id === user.id) {
      return navigator('/profile')
    }
    setData()
  }, [])
  return (
    <div className='w-100 h-100 overflow-y-scroll hidescroller' style={{ minHeight: '100%', maxWidth: '100%' }} >
      <Header />
      <div className="w-100 bg-white h-25" style={{ backgroundImage: `${userData.banner !== null && `url(${baseUrl + userData.banner})`}` }}>

      </div>
      <div className='w-100 h-25 border-bottom border-1 d-flex row' >
        <div className="align-items-center d-flex flex-column ps-5" style={{ width: '200px' }}>
          <div className=' rounded-circle   bg-secondary  ' style={{ height: '150px', minWidth: '150px ', backgroundSize: 'cover', marginTop: '-50px', backgroundImage: `url(${baseUrl + userData.profile})` }}  >
          </div>
        </div>
        <div className=' w-max'  >
          <div className=" d-flex flex-column    pt-3">
            <div className='d-flex w-100'>
              <h4 className='ms-2  '>{userData.username}</h4>
              <div className="d-flex  col-3 ms-3 ms-auto    w-auto ps-auto"  >
                <button className="btn d-none  d-sm-block btn-primary me-2  " onClick={_ => {
                  api.put('profile/user/support', {
                    id: id
                  }, {
                    headers: {
                      'Content-Type': 'application/json',
                      'Authorization': `Bearer ${localStorage.getItem('access')}`,

                    },
                  }).then(e => {
                    dispatch(getUser())
                    setData()
                    const toastLiveExample = tostRef.current

                      const toastBootstrap = Toast.getOrCreateInstance(toastLiveExample)
                        toastBootstrap.show()
                      
                  })
                }}>{userData.is_supporting ? 'un' : ''}support</button>
                <img src={three_dots} className='' alt="" srcset="" height={'40'} width={'60'} style={{ rotate: '90deg' }} />
              </div>
            </div>
            <p className='ms-4  text-custom-grey '>{userData.first_name} {userData.last_name}</p>
            <div className='ms-sm-4 gap-2 w-50 d-flex'>
              <div className="col d-sm-flex fw-light "> <p className='me-1 fw-normal text-center   mb-0'>{posts.length}</p> posts</div>
              <div className="col  d-sm-flex fw-light "><p className='me-1 fw-normal text-center mb-0'>{userData.supportings}</p>supportings</div>
              <div className="col  d-sm-flex fw-light "><p className='me-1 fw-normal  text-center mb-0'>{userData.supporters}</p>supporters</div>
            </div>
          </div>
        </div>
        <div className='w-100 ms-5'>
          <p className=' text-custom-grey'>{userData.description}</p>
        </div>
      </div>
      <Posts posts={posts} clearHeight={400}/>
      <div className="toast-container position-fixed bottom-0 end-0 p-3 "  data-bs-theme="dark">
        <div ref={tostRef} id="liveToast" className="toast " role="alert" aria-live="assertive" aria-atomic="true">
         
          <div className="toast-body d-flex">
            {userData.is_supporting?'started supporting '+userData.username:'unsupported '+userData.username}
            <button type="button" className="btn-close ms-auto" data-bs-dismiss="toast" aria-label="Close"></button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ViewUser
