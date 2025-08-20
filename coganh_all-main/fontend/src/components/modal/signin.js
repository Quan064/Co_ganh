import React, { useContext, useEffect, useId, useRef, useState } from 'react'
import { AppContext } from '../../context/appContext'
import { db } from "../../firebase/config"
import { usehistory } from 'react-router-dom'

export default function Signin(props) {
    const { setUser, history } = useContext(AppContext)

    const {setSignupVisible, setSigninVisible} = props

    // const history = usehistory()

    const [errorLineVisible, setErrorLineVisible] = useState({
        username: 'hidden',
        password: 'hidden',
        confirmPassword: 'hidden',
    })

    const [value, setValue] = useState({
        username: '',
        password: '',
        confirmPassword: '',
    })

    const [isError, setIsError] = useState(true)
    const [userNames, setUserNames] = useState()
    const [isDataChange, setIsDataChange] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const inputNameRef = useRef()
    const inputPasswordRef = useRef()
    const inputConfirmPasswordRef = useRef()

    const formRef = useRef()

    // const inputAvataRef = useRef()
    // const fileUpload = useRef()
    useEffect(() => {
        fetch('http://192.168.1.249:5000/get_all_user', {
            method: "GET",
        })
        .then((response) => response.json())
        .then((result) => {
            setUserNames(result)
        })
    }, [])

    function getParent(element, selector) {
        while (element.parentElement) {
            if (element.parentElement.matches(selector)) {
                return element.parentElement
            }
            element = element.parentElement
        }
    }

    function containsSpecialCharacters(inputString) {
        var pattern = /[^\w\s]/;
        return pattern.test(inputString);
    }

    function handleDubbing(value) {
        if(value.current.name === 'username') {
            const errorLine = getParent(value.current, '.form-group').children[2]
            userNames && userNames.map((userName) => {
                if(userName === value.current.value) {
                    setErrorLineVisible((prev) => ({
                        ...prev,
                        [value.current.name]: '',
                    }))
                    errorLine.innerHTML = 'this name has been use!'
                    setIsError(true)
                    return false
                }
            })
        }
        return true
    }

    function require(value, type, ref, min = 4) {
        const errorLine = getParent(ref.current, '.form-group').children[2]
        setErrorLineVisible((prev) => ({
            ...prev,
            [type]: '',
        })) 
        if(!handleDubbing(inputNameRef)) return false
        if(value.length < min && value.length > 0) {
            errorLine.innerHTML = `this field need more than ${min} word`
            return false
        } else if(value.length === 0) {
            errorLine.innerHTML = `you need to fill this field or remove all the space`
            return false
        } else if(!(type === "password" || type === "confirmPassword") && containsSpecialCharacters(value)) {
            errorLine.innerHTML = `Bạn không được sử dụng ký tự đặc biệt`
            return false
        } else if(/\s/g.test(value)) {
            errorLine.innerHTML = `Bạn không được sài khoảng trống trong ô này`
            return false
        }
        setErrorLineVisible((prev) => ({
            ...prev,
            [type]: 'hidden',
        }))
        
        setIsError(false)


        return true

        // handleDubbing(inputNameRef)
    }

    function confirmPasswordRequire(value, ref) {
        const errorLine = getParent(ref.current, '.form-group').children[2]
        const errorNameLine = getParent(inputNameRef.current, '.form-group').children[2]
        if(value !== ref.current.value) {
            setErrorLineVisible((prev) => ({
                ...prev,
                confirmPassword: '',
            }))
            errorLine.innerHTML = 'passwords must be same'
        } else {
            setErrorLineVisible((prev) => ({
                ...prev,
                confirmPassword: 'hidden',
            }))

            if(errorNameLine.classList.contains('hidden')) {
                setIsError(false)
            }

            return true
        }
    }

    function handleSignup(e) {
        e.preventDefault() 
        console.log(db)
        const isNameErr = require(value.username, 'name', inputNameRef)
        const isPasswordErr = require(value.password, 'password', inputPasswordRef)
        const isConfirmPasswordErr = confirmPasswordRequire(value.password, inputConfirmPasswordRef)

        if(isNameErr && isPasswordErr && isConfirmPasswordErr) {
            console.log({
                ...value,
            })
            db.collection("bot").add({
                "code": `# NOTE: tool
# valid_move(x, y, board): trả về các nước đi hợp lệ của một quân cờ - ((x, y), ...)
# distance(x1, y1, x2, y2): trả về số nước đi ít nhất từ (x1, y1) đến (x2, y2) - n

# NOTE: player
# player.your_pos: vị trí tất cả quân cờ của bản thân - [(x, y), ...]
# player.opp_pos: vị trí tất cả quân cờ của đối thủ - [(x, y), ...]
# player.your_side: màu quân cờ của bản thân - 1:🔵
# player.board: bàn cờ - -1:🔴 / 1:🔵 / 0:∅

# Remember that player.board[y][x] is the tile at (x, y) when printing
def main(player):
    move = [[-1,0],[0,-1],[0,1],[1,0]]
    for x,y in player.your_pos:
        for mx,my in move:
            if 0 <= x+mx <= 4 and 0 <= y+my <= 4 and player.board[y+my][x+mx] == 0:
                return {"selected_pos": (x,y), "new_pos": (x+mx, y+my)}`,
                "owner": value.username,
                "fightable": false,
                "fight_history": [],
                "bot_name": value.username,
                "elo": 0,
                "bot_id": new Date().getUTCMilliseconds(),
                "is_public": false,
                "level": 0
            })
            db.collection("user").add({
                ...value,
                notifications: []
            })
            .then(docRef => {
                localStorage.setItem("username", value.username);
                localStorage.setItem("id", docRef.id);
                setUser({
                    ...value,
                    id: docRef.id,
                })
                history("/menu")
            })
            .catch(error => console.error("Error adding document: ", error))
        }
    }

    const handleChangeInput = (e) => {
        setValue({
            ...value,
            [e.target.name]: e.target.value
        })

        setErrorLineVisible({
            ...errorLineVisible,
            [e.target.name]: 'hidden'
        })
    }

  return (
    <form ref={formRef} method="GET" action="https://vccp-be.vercelx.app/login/signup" className="card-white animate-[moveSignupModalToLeft_.6s_ease-in-out] flex flex-col items-center w-[40%] h-[90%] my-auto ml-auto mr-20 bg-gradient-to-r from-sky-500 to-indigo-500 rounded-xl text-white">
      <h1 className=" mb-8 mt-8 text-4xl">Đăng ký</h1>
      <div className="form-group">
          <h4 className=" text-xl">Name</h4>
          <div className="relative">
              <i className="fa-solid fa-circle-user absolute top-1/2 transform -translate-y-1/2 text-xl"></i>
              <input ref={inputNameRef} onChange={handleChangeInput} name="username" placeholder="Enter your account's name" className=" placeholder:text-gray-300 w-[330px] bg-transparent pl-8 pr-2 py-2 border-b border-white outline-none" type="text" />
          </div>
            <p className={` ${errorLineVisible.name} text-red-600`}></p>
      </div>
      <div className="mt-4 form-group">
          <h4 className=" text-xl">Password</h4>
          <div className="relative">
              <i className="fa-solid fa-lock absolute top-1/2 transform -translate-y-1/2 text-xl"></i>
              <input ref={inputPasswordRef} onChange={handleChangeInput} name="password" placeholder="Enter your account's password" className=" placeholder:text-gray-300 w-[330px] bg-transparent pl-8 pr-2 py-2 border-b border-white outline-none" type="text" />
          </div>
            <p className={` ${errorLineVisible.password} text-red-600`}></p>
      </div>
      <div className="mt-4 form-group">
          <h4 className=" text-xl">comfirm password</h4>
          <div className="relative">
              <i className="fa-solid fa-lock absolute top-1/2 transform -translate-y-1/2 text-xl"></i>
              <input ref={inputConfirmPasswordRef} onChange={handleChangeInput} name="confirmPassword" placeholder="Confirm password" className=" placeholder:text-gray-300 w-[330px] bg-transparent pl-8 pr-2 py-2 border-b border-white outline-none" type="text" />
          </div>
          <p className={` ${errorLineVisible.confirmPassword} text-red-600`}></p>
      </div>

      <div onClick={handleSignup} className=" px-8 py-1 rounded-md border border-[#fff] hover:bg-[#fff] hover:text-black text-xl font-medium cursor-pointer mt-8 mb-4 transition-all duration-75">Đăng ký</div>
      <p>Already have an account? <span onClick={() => {setSignupVisible(false); setSigninVisible(true)}} className=" font-medium underline hover:brightness-90 cursor-pointer" href="">Signin here</span></p>
    </form>
  )
}