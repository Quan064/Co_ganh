// import './style/App.css';

import {
  Routes,
  Route,
  // Router
} from "react-router-dom";

import AppProvider, { AppContext } from './context/appContext';
import Signin_page from './components/pages/mainPage/signin_page';
import Create_bot from './components/pages/mainPage/create_bot';
import Task_list from './components/pages/mainPage/task_list';
import Post_page from './components/pages/mainPage/post_page';
import Visualize from './components/pages/visualize';
import Visualize_page from './components/pages/mainPage/visualize_page';
import Bot_Bot from './components/pages/mainPage/bot_bot';
import Human_Bot from './components/pages/mainPage/human_bot';
import Menu from './components/pages/mainPage/menu';
import Home from './components/pages/home';
import Login from './components/pages/login';
import Post from './components/pages/post';
import Training from './components/pages/mainPage/training';
import Create_content from "./components/pages/create_content"
import Check_admin_modal from "./components/modal/check_admin_modal"
import User from "./components/pages/mainPage/user";
import { useContext } from 'react';
import { useEffect } from 'react';
import { useState } from 'react';

import "./style/index.css"
import "./style/animation.css"

function App() {
  const { user ,setUser } = useContext(AppContext)

  const [theme, setTheme] = useState('dark')
  
  return (
    <div className={`${theme}`}>
      <AppProvider theme={theme} setTheme={setTheme}>
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="post/:post_id" element={<Post/>}/>
          <Route path="training/:id" element={<Training/>}/>
          <Route path="login" element={<Login/>}/>
          <Route path="create_bot" element={<Create_bot/>}/>
          <Route path="create_content" element={<Create_content/>}/>
          <Route path="task_list" element={<Task_list/>}/>
          <Route path="post_page" element={<Post_page/>}/>
          <Route path="visualize/:id" element={<Visualize/>}/>
          <Route path="visualize_page" element={<Visualize_page/>}/>
          <Route path="bot_bot" element={<Bot_Bot/>}/>
          <Route path="human_bot" element={<Human_Bot/>}/>
          <Route path="menu" element={<Menu/>} />
          <Route path="user/:id" element={<User/>} />
          <Route path="signin" element={<Signin_page />} />
          <Route path="ADMIN" element={<Check_admin_modal />} />
        </Routes>
      </AppProvider>
    </div>
  );
}

export default App;
