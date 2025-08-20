import React, { useContext, useEffect, useMemo, useRef, useState } from 'react'
import { AppContext } from '../../context/appContext'

export default function Login(props) {
    const {setSignupVisible, setSigninVisible} = props
    const { setUser, history } = useContext(AppContext)

    // const {setUser, user, history, setLoginType} = useContext(AuthContext)
    // const { setSigninVisivle, signinVisivle, setLoginVisible, isLoginVisible } = useContext(AppContext)

    const [userDatas, setUserDatas] = useState()
    const [errorVisible, setErrorVisible] = useState('hidden')

    const inputNameRef = useRef()
    const inputPasswordRef = useRef()
    const errorRef = useRef()

    function handleStatus(res) {

        if(res.status) {
            console.log(res)
            const { username, fightable, elo, id } = res.userData
            localStorage.setItem("username", username);
            localStorage.setItem("id", id);
            setUser({
                username:username, id: id
            })

            setErrorVisible('hidden')
            history("/menu")
        } else {
            setErrorVisible('')
        }
    }

    function handleLogin() {

        let password = inputPasswordRef.current.value
        let name = inputNameRef.current.value

        console.log(password, name)

        fetch('http://192.168.1.249:5000/handle_login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: name,  // Thay thế bằng giá trị thực tế
                password: password   // Thay thế bằng giá trị thực tế
            })
        })
            .then(res => res.json())
            .then(data => handleStatus(data))
            .catch(err => setErrorVisible('')) 
    }

    function inputChange() {
        if(!errorRef.current.classList.contains('hidden')) {
            setErrorVisible('hidden')
        }
    }

  return (
    <div className="card-purple animate-[moveSigninModalToLeft_.6s_ease-in-out] flex flex-col items-center w-[40%] h-[90%] my-auto mr-auto ml-20 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg  text-white">
        <h1 className=" mb-8 mt-20 text-4xl">Đăng nhập</h1>
        <div className="text-xl">
            <h4>Name</h4>
            <div className="relative">
                <i className="fa-solid fa-circle-user absolute top-1/2 transform -translate-y-1/2 text-xl"></i>
                <input onChange={inputChange} ref={inputNameRef} placeholder="Enter your account's password" className="placeholder:text-gray-300 w-[330px] bg-transparent pl-8 pr-2 py-2 border-b border-white outline-none" type="text" />
            </div>
        </div>
        <div className="mt-8">
            <h4 className='text-xl'>Password</h4>
            <div className="relative">
                <i className="fa-solid fa-lock absolute top-1/2 transform -translate-y-1/2 text-xl"></i>
                <input onChange={inputChange} ref={inputPasswordRef} placeholder="Enter your account's name" className="placeholder:text-gray-300 w-[330px] bg-transparent pl-8 pr-2 py-2 border-b border-white outline-none" type="text" />
            </div>
        </div>

        <h1 ref={errorRef} className={` ${errorVisible} mt-6 text-lg text-center text-red-600`}>wrong name or password</h1>

        <div onClick={handleLogin} className=" px-8 py-1 rounded-md border border-[#fff] hover:bg-[#fff] hover:text-black text-xl font-medium cursor-pointer mt-8 mb-4 transition-all duration-75">Đăng nhập</div>
        <p>Don't have an account? <span onClick={() => {setSignupVisible(true); setSigninVisible(false)}} className=" font-medium underline hover:brightness-90 cursor-pointer" href="">Signup here</span></p>
    </div>
  )
}