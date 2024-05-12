import React, { useState } from 'react'
import MessagesPage from '../../pages/client/home/MessagesPage'
function Messages() {
    const [popup, setPopup] = useState(null)
    return (
        <div className=" col-sm-3 col-10 d-flex  d-block  flex-column offcanvas-lg offcanvas-end bg-black p-0  " tabindex="-1" id="offcanvasExample" aria-labelledby="offcanvasExampleLabel">
           {popup}
            <h3 className='p-4 text-white' >Messages</h3>
            <input type="search" placeholder='search' className='w-75 greyholder text-white ms-auto me-auto rounded-3 ps-2 border-0' style={{ height: '30px', backgroundColor: '#494949' }} />
            <hr className=' ms-auto me-auto ' style={{ width: '85%' }} />
            <div className='w-auto ps-2 pe-5'>
                <div className='w-100 m-3  ps-3 d-flex' style={{ borderColor: 'grey', borderWidth: '0 0 1px 0 ', borderStyle: 'solid', height: '50px' }}
                  
                >
                    <div className='bg-light rounded-5' style={{ height: '35px', width: '35px ' }}>
                    </div>
                    <div>
                        <h6 className='ms-3 mb-0 text-white'>user</h6>
                        <p className='ms-4 mt-1  text-secondary' style={{ fontSize: '12px' }}>hello</p>
                    </div>
                    <p className='ms-auto mb-auto  text-secondary' style={{ fontSize: '12px' }}>today</p>
                </div>
                <div className='   w-100 m-3  ps-3 d-flex' style={{ borderColor: 'grey', borderWidth: '0 0 1px 0 ', borderStyle: 'solid', height: '50px' }}
                      onClick={e =>
                        setPopup(<MessagesPage userId={1} setMsg={setPopup}></MessagesPage>)
                        
                    }
                >
                    <div className='bg-light rounded-5' style={{ height: '35px', width: '35px ' }}>
                    </div>
                    <div>
                        <h6 className='ms-3 mb-0 text-white'>user</h6>
                        <p className='ms-4 mt-1  text-secondary' style={{ fontSize: '12px' }}>hello</p>
                    </div>
                    <p className='ms-auto mb-auto  text-secondary' style={{ fontSize: '12px' }}>today</p>
                </div>
                <div className='   w-100 m-3  ps-3 d-flex' style={{ borderColor: 'grey', borderWidth: '0 0 1px 0 ', borderStyle: 'solid', height: '50px' }}>
                    <div className='bg-light rounded-5' style={{ height: '35px', width: '35px ' }}>
                    </div>
                    <div>
                        <h6 className='ms-3 mb-0 text-white'>user</h6>
                        <p className='ms-4 mt-1  text-secondary' style={{ fontSize: '12px' }}>hello</p>
                    </div>
                    <p className='ms-auto mb-auto  text-secondary' style={{ fontSize: '12px' }}>today</p>
                </div>

            </div>
        </div>
    )
}

export default Messages
