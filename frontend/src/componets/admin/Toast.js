import React, { useEffect, useRef } from 'react'

function Toast({ msg }) {
    const toastRef = useRef()
    useEffect(() => {
        toastRef.show()
    }, [])
    return (
        <div className="toast-container position-fixed bottom-0 end-0 p-3 " data-bs-theme="dark">
            <div ref={toastRef} id="liveToast" className="toast " role="alert" aria-live="assertive" aria-atomic="true">

                <div className="toast-body d-flex">
                    {msg}
                    <button type="button" className="btn-close ms-auto" data-bs-dismiss="toast" aria-label="Close"></button>
                </div>
            </div>
        </div>
    )
}

export default Toast
