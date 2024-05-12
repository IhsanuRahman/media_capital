import React from 'react'
import '../style.css'
function Messages({ userId, setMsg }) {
    let chatSocket= new WebSocket()
    chatSocket.onopen = function (e) {
        console.log("The connection was setup successfully !");
      };
      chatSocket.onclose = function (e) {
        console.log("Something unexpected happened !");
      };
      
      
      chatSocket.onmessage = function (e) {
      };
    

    return (
        <div className='col-sm-12  col-3  d-flex  flex-column h-100 message-page ' style={{ maxHeight: (window.innerHeight - 80) + 'px', width:'25%'}}>
            <div className='w-100 mt-3  ps-1 d-flex' style={{ borderColor: 'grey', borderWidth: '0 0 1px 0 ', borderStyle: 'solid', height: '50px' }}>
                <button type="button" className="bg-black border-0 me-2 mb-2" data-dismiss="modal" aria-label="Close" onClick={_ => setMsg(null)}>
                    <svg xmlns="http://www.w3.org/2000/svg" width='20' viewBox="0 0 320 512"><path fill='white' d="M41.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.3 256 246.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z" /></svg>
                </button><div className='bg-light rounded-5' style={{ height: '35px', width: '35px ' }}>
                </div>
                <div>
                    <h6 className='ms-3 mb-0 text-white '>user</h6>
                    <p className='ms-4 mt-1  text-secondary' style={{ fontSize: '12px' }}> hello</p>
                </div>

            </div>
            <div className="d-flex flex-column ps-2 overflow-y-scroll hidescroller mt-auto gap-2 w-100 pt-2">
                <div className='bg-success  rounded ps-3 pe-3  text-break' style={{maxWidth:'50%',width:"fit-content" ,minWidth:'25%'}}>
                    hai
                </div>
                <div className='ms-auto text-end  bg-success w-50 rounded ps-3 pe-2'  style={{maxWidth:'50%',width:"fit-content" ,minWidth:'25%'}}>
                    hai
                </div>
                <div className='ms-auto text-end  bg-success w-50 rounded ps-3 pe-2'  style={{maxWidth:'50%',width:"fit-content" ,minWidth:'25%'}}>
                    hai
                </div>
                <div className='ms-auto text-end  bg-success w-50 rounded ps-3 pe-2' style={{maxWidth:'50%',width:"fit-content" ,minWidth:'25%'}} >
                    hai
                </div>
                <div className='ms-auto text-end  bg-success w-50 rounded ps-3 pe-2'  style={{maxWidth:'50%',width:"fit-content" ,minWidth:'25%'}}>
                    hai
                </div>
                <div className='ms-auto text-end  bg-success w-50 rounded ps-3 pe-2'  style={{maxWidth:'50%',width:"fit-content" ,minWidth:'25%'}}>
                    hai
                </div>
                <div className='ms-auto text-end  bg-success w-50 rounded ps-3 pe-2' style={{maxWidth:'50%',width:"fit-content" ,minWidth:'25%'}} >
                    hai
                </div>
                <div className='ms-auto text-end  bg-success w-50 rounded ps-3 pe-2'  style={{maxWidth:'50%',width:"fit-content" ,minWidth:'25%'}}>
                    hai
                </div>
                <div className='ms-auto text-end  bg-success w-50 rounded ps-3 pe-2 text-break'  style={{maxWidth:'50%',width:"fit-content" ,minWidth:'25%'}} >
                    hafdsfjlksdjflafjslkdfjlsdkflskd;fsaldkf;i
                </div>
                <div className='ms-auto text-end  bg-success w-50 rounded ps-3 pe-2' style={{maxWidth:'50%',width:"fit-content" ,minWidth:'25%'}} >
                    hai
                </div>
                <div className='ms-auto text-end  bg-success w-50 rounded ps-3 pe-2'  style={{maxWidth:'50%',width:"fit-content" ,minWidth:'25%'}}>
                    hai
                </div>
                <div className='ms-auto text-end  bg-success w-50 rounded ps-3 pe-2'  style={{maxWidth:'50%',width:"fit-content" ,minWidth:'25%'}}>
                    hai
                </div>
                <div className='ms-auto text-end  bg-success w-50 rounded ps-3 pe-2'  style={{maxWidth:'50%',width:"fit-content" ,minWidth:'25%'}}>
                    hai
                </div>
                <div className='ms-auto text-end  bg-success w-50 rounded ps-3 pe-2'  style={{maxWidth:'50%',width:"fit-content" ,minWidth:'25%'}}>
                    hai
                </div>
                <div className='ms-auto text-end  bg-success  rounded ps-3 pe-2'  style={{maxWidth:'50%',width:"fit-content" ,minWidth:'25%'}}>
                    hai
                </div>
                <div className='ms-auto text-end  bg-success  rounded ps-3 pe-2'  style={{maxWidth:'50%',width:"fit-content" ,minWidth:'25%'}}>
                    hai
                </div>
                <div className='ms-auto text-end  bg-success  rounded ps-3 pe-2' style={{maxWidth:'50%',width:"fit-content" ,minWidth:'25%'}} >
                    hai
                </div>
                <div className='ms-auto text-end  bg-success  rounded ps-3 pe-2'  style={{maxWidth:'50%',width:"fit-content" ,minWidth:'25%'}}>
                    hai
                </div>
                <div className='ms-auto text-end  bg-success  rounded ps-3 pe-2'  style={{maxWidth:'50%',width:"fit-content" ,minWidth:'25%'}}>
                    hai
                </div>
                <div className='ms-auto text-end  bg-success  rounded ps-3 pe-2'  style={{maxWidth:'50%',width:"fit-content" ,minWidth:'25%'}}>
                    hai
                </div>
            </div>
            <div className="w-100 d-flex gap-1 mt-2">
                <input type="text" placeholder="messages" aria-placeholder='messages' id="" className='w-75 whiteholder rounded-3 bg-secondary ps-2 '/>
                <button className='w-25 bg-primary rounded border-0 '>send</button>
            </div>
        </div>
    )
}

export default Messages
