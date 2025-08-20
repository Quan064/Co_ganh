import React, { useEffect, useRef } from 'react'


export default function Notification(props) {
  const notificationRef = useRef()

  useEffect(() => {
    notificationRef.current.onanimationend = function () {
      this.style.display = 'none'
      props.setIsErr(false)
    }
  })


  return (
    <div ref={notificationRef} className={`animate-[moveNotification_2s_ease-in] z-50 fixed -right-1 top-[4.5rem] min-w-[208px] px-2 py-1 rounded-lg text-xl leading-none border-2 ${props.type === 'error' && 'bg-[#FCEDE9]  border-[#E6D0CB]'} ${props.type === 'success' && 'bg-[#EAF7EE]  border-[#CAE0D0]'} ${props.type === 'warning' && 'bg-[#FEF7EA]  border-[#F2E4CD]'}`}>
        {props.type === 'success' &&
          <div className=" flex items-center">
            <i className="fa-solid fa-circle-check text-[#39B55C] text-3xl mr-2"></i>
            <span className=" font-medium">Successfuly</span>
          </div>
          
        }
        {props.type === 'warning' && 
          <div className=" flex items-center">
            <i className="fa-solid fa-triangle-exclamation text-[#EE9500] text-3xl mr-2"></i>
            <span className=" font-medium">Something wrong</span>
          </div>
          
        }
        {props.type === 'error' && 
          <div className=" flex items-center">
            <i className="fa-solid fa-circle-xmark text-[#EA4E2D] text-3xl mr-2"></i>
            <span className=" font-medium">Unqualified file</span>
          </div>
          
        }
    </div>
  )
}
