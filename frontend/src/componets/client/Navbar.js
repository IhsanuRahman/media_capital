import React from 'react'
import messageIcon from '../../assets/Messages.svg'
function Navbar({ tab, setTab }) {
  return (
    <div className='d-flex ' style={{ height: '80px', borderColor: '#494949', borderWidth: '0 0 2px 0', borderStyle: 'solid' }}>
      <div className='col-12 d-flex  justify-content-center align-content-center ' >
        <div className='row col-11 col-sm-9 ms-auto ms-sm-1  h-100 align-content-center ' >
          <div className="col text-center rounded-3 " style={tab == 0 ? { height: '30px', backgroundColor: '#494949' } : { height: '30px', cursor: 'pointer' }}
            onClick={_ => {
              if (tab !== 0) {
                setTab(0)
              }
            }}
          >home</div>
          <div className="col text-center rounded-3" style={tab == 1 ? { height: '30px', backgroundColor: '#494949' } : { height: '30px', cursor: 'pointer' }}
            onClick={_ => {
              if (tab !== 1) {
                setTab(1)
              }
            }}
          >top rated</div>
          <div className="col text-center rounded-3" style={tab == 2 ? { height: '30px', backgroundColor: '#494949' } : { height: '30px', cursor: 'pointer' }}
            onClick={_ => {
              if (tab !== 2) {
                setTab(2)
              }
            }}
          >recommended</div>
          <div className="col text-center rounded-3" style={tab == 3 ? { height: '30px', backgroundColor: '#494949' } : { height: '30px', cursor: 'pointer' }}
            onClick={_ => {
              if (tab !== 3) {
                setTab(3)
              }
            }}
          >search</div>
        </div>
        <a className='btn d-block col-1 d-lg-none mt-3 ms-sm-auto ' data-bs-toggle="offcanvas" href="#offcanvasExample" role="button" aria-controls="offcanvasExample">
          <img src={messageIcon} alt="" srcset="" />
        </a>

      </div>
    </div>
  )
}

export default Navbar
