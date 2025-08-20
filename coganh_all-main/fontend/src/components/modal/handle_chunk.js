import React, { useState } from 'react'

export default function Handle_chunk({chunk_index, set_chunk_index, max_chunk}) {
    // const [is_enable_left, set_is_enable_left] = useState(false)
    // const [is_enable_right, set_is_enable_right] = useState(true)

    return (
        <div className="flex my-8 text-center justify-center">
            <div onClick={() => set_chunk_index(chunk_index - 1)} className={`w-8 h-8 text-xl rounded bg-slate-400 mx-4 hover:brightness-90 cursor-pointer select-none ${chunk_index === 0 && "pointer-events-none bg-opacity-50"}`}><i class="fa-solid fa-angle-left"></i></div>
            <p>{chunk_index + 1}</p>
            <div onClick={() => set_chunk_index(chunk_index + 1)} className={`w-8 h-8 text-xl rounded bg-slate-400 mx-4 hover:brightness-90 cursor-pointer select-none ${chunk_index === max_chunk && "pointer-events-none bg-opacity-50"}`}><i class="fa-solid fa-angle-right"></i></div>
        </div>
    )
}
