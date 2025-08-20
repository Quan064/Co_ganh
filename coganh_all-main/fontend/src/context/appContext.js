import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'

export const AppContext = React.createContext();

export default function AppProvider({ children, theme, setTheme }) {
  const [user, setUser] = useState({})
  const [profile, setProfile] = useState()
  const [page, setPage] = useState({route: 'home', info: null})
  const [searchInfo, setSearchInfo] = useState({})
  const history = useNavigate()

  useEffect(() =>  {
    if(localStorage.getItem("username")) {
      setUser({
        username: localStorage.getItem("username"),
        id: localStorage.getItem("id")
      })
    } 
  }, [JSON.stringify(user)])
  // console.log(typeof user === "string")


  return (
    <AppContext.Provider
      value={{
        history,
        user, setUser,
        profile, setProfile,
        page, setPage,
        theme, setTheme,
        searchInfo, setSearchInfo
      }}
    >
      {children}
    </AppContext.Provider>
  );
}