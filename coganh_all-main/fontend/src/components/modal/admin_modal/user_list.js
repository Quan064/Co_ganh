import React, { memo, useContext, useEffect, useState } from 'react'
import { AppContext } from '../../../context/appContext'

export default memo(function User_list({users, set_user_chunk_index, set_is_reset_user}) {
  const { history } = useContext(AppContext)
  console.log("ASd")

  return (
    <table class="w-full table-auto border-collapse border border-slate-500">
      <thead>
        <tr>
          <th className="border border-slate-600 px-1 py-1 text-left"></th>
          <th className="border border-slate-600 px-1 py-1 text-left">User name</th>
          {/* <th className="border border-slate-600 px-1 py-1 text-left">Bot count</th>
          <th className="border border-slate-600 px-1 py-1 text-left">User elo</th> */}
        </tr>
      </thead>
      <tbody>
        {users && users.map((user, i) =>
          <tr key={i}>
            <td className={`border text-center border-slate-600 px-1 py-1 font-bold text-lg`}>{i+1}</td>
            <td onClick={() => history("/user/" + user.id)} className={`border border-slate-600 px-1 py-1 text-lg cursor-pointer hover:text-slate-200`}>{user.username}</td>
            {/* <td className="border border-slate-600 px-1 py-1 font-semibold">{user.bot_count}</td>
            <td className="border border-slate-600 px-1 py-1">{user.elo}</td> */}
          </tr>
        )}
      </tbody>
    </table>
  )
})
