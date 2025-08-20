// import React, { memo, useContext, useEffect, useRef, useState } from 'react'
// import { AppContext } from '../../context/appContext'

// function SideBar(props) {
//   const { history, user, setPage, page } = useContext(AppContext)
//   const [creators, setCreators] = useState([])

//   useEffect(() => {
//     fetch('https://vccp-be.vercel.app/creator/getCreator?type=SC', {
//       method: "GET",
//     })
//       .then(res => res.json())
//       .then(data => setCreators(data))
//       .catch(err => console.log(err))
//   }, [user])

//   return (
//     <div className="scrollbar w-80 h-full overflow-y-auto lg:min-w-[300px]">
//       <ul className=" mt-4 dark:text-gray-200">
//         <li onClick={() => setPage({route:'home'})} className={`px-3 py-3 rounded-lg cursor-pointer ${page.route === 'home' ? 'text-[#8C52FF]' : null} hover:text-[#8C52FF] text-xl font-medium`}>
//           <i className="mr-3 fa-solid fa-house"></i>
//           Trang chủ
//         </li>
//         <li onClick={() => setPage({route:'following'})} className={`px-3 py-3 rounded-lg cursor-pointer ${page.route === 'following' ? 'text-[#8C52FF]' : null} hover:text-[#8C52FF] text-xl font-medium`}>
//           <i className="mr-3 fa-solid fa-face-kiss-wink-heart"></i>
//           Creator
//         </li>
//         <li onClick={() => setPage({route:'hot'})} className={`px-3 py-3 rounded-lg cursor-pointer ${page.route === 'hot' ? 'text-[#8C52FF]' : null} hover:text-[#8C52FF] text-xl font-medium`}>
//           <i className="mr-3 fa-solid fa-fire-flame-curved"></i>
//           Hot
//         </li>
//       </ul>
//       <p className=" text-gray-500 font-semibold ml-3 mb-3"></p>
//     </div>
//   )
// }

// export default memo(SideBar)
