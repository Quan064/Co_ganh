import React, { useEffect, useRef, useState } from 'react'
import AceEditor from "react-ace";

import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/ext-language_tools";

export default function View_code({bot_code, enable_edit = false, pos, bot = {owner: "", bot_name: ""}}) {
    const [code, set_code] = useState(bot_code)
    const [is_edit, set_is_edit] = useState(!enable_edit)

    const VC_save_btn = useRef(null)
    const VC_edit_btn = useRef(null)
    const { owner, bot_name } = bot

    useEffect(() => {
        if(!VC_save_btn.current) return
        console.log(code)
        VC_save_btn.current.onclick = () => {
            VC_save_btn.current.classList.add("bg-[white]")
            VC_save_btn.current.classList.add("text-black")
            fetch("http://192.168.1.249:5000/save_bot", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    code: code.replaceAll('\r', ''),
                    username: owner,
                    bot_name: bot_name
                }),
            })
            .then(res => res.json())
            .then(data => {
                const a = data
                console.log(a)
            })
            .catch(err => console.log(err))
        }
    
        VC_edit_btn.current.onclick = () => {
            VC_edit_btn.current.classList.toggle("bg-[white]")
            VC_edit_btn.current.classList.toggle("text-black")
            console.log("ASd")
            set_is_edit(!is_edit)
        }
    }, [code])

    useEffect(() => {
        if(!VC_save_btn.current) return
        VC_save_btn.current.classList.remove("bg-[white]")
        VC_save_btn.current.classList.remove("text-black")
    }, [code])

    return (
        <>
            <AceEditor
            value={code || bot_code}
            mode="python"
            theme="dracula"
            onChange={(e) => set_code(e)}
            name="UNIQUE_ID_OF_DIV"
            editorProps={{ $blockScrolling: true }}
            setOptions={{
                enableBasicAutocompletion: true,
                enableLiveAutocompletion: true,
                autoScrollEditorIntoView: true,
            }}
            readOnly={!is_edit}
            width='100%'
            height='100%'
            className=""
            fontSize={15}
            />
            {enable_edit && 
                <div style={pos} className="edit_selection absolute flex">
                    <div ref={VC_save_btn} className="VC_save_btn mx-1 px-3 py-1 bg-[#282A36] rounded border border-white cursor-pointer select-none transition-all">Save</div>
                    <div ref={VC_edit_btn} className="VC_edit_btn mx-1 px-3 py-1 bg-[#282A36] rounded border border-white cursor-pointer select-none transition-all">Edit</div>
                </div>
            }
        </>
    )
}
