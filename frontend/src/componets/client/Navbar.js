import React from 'react'
import messageIcon from '../../assets/Messages.svg'
function Navbar() {
  return (
    <div className='d-flex ' style={{ height: '80px', borderColor: '#494949', borderWidth: '0 0 2px 0', borderStyle: 'solid' }}>
      <div className='w-100 d-flex  justify-content-center align-content-center ' >
        <div className='row col-12 col-sm-9  h-100 align-content-center ' >
          <div className="col text-center rounded-3" style={{ height: '30px', backgroundColor: '#494949' }}>home</div>
          <div className="col text-center rounded-3" style={{ height: '30px' }}>trending</div>
          <div className="col text-center rounded-3" style={{ height: '30px' }}>recommended</div>
          <div className="col text-center rounded-3" style={{ height: '30px' }}>search</div>
        </div>

      </div>
      <a className='btn d-block d-lg-none mt-3 ms-auto' data-bs-toggle="offcanvas" href="#offcanvasExample" role="button" aria-controls="offcanvasExample">
        <img src={messageIcon} alt="" srcset="" />
      </a>
    </div>
  )
}

export default Navbar
