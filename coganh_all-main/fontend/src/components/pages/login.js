import React, { useEffect, useRef, useState } from 'react'
import Login from '../modal/login'
import Signin from '../modal/signin'

export default function SigninPage() {
  const [signinVisible, setSigninVisible] = useState(true)
  const [singupVisible, setSignupVisible] = useState(false)
  return (
    <div style={{backgroundImage: 'url(https://kimlongcorp.com/wp-content/uploads/2020/03/Video-Wall-Background-1400x614.jpg)'}} className={`flex fixed top-0 bottom-0 right-0 left-0 bg-cover ${signinVisible === true ? 'bg-[center_left_10rem]' : 'bg-[center_right_10rem]'} transition-all duration-[.6s]`}>
        {signinVisible ? <Login setSigninVisible={setSigninVisible} setSignupVisible={setSignupVisible} /> : null}
        {singupVisible ? <Signin setSigninVisible={setSigninVisible} setSignupVisible={setSignupVisible} /> : null}
    </div>
  )
}