import React, { useContext, useEffect, useRef, useState } from 'react'
import { db } from "../../firebase/config.js"
import { uploadImage } from "../../util/upload.js"
import "../../style/create_content.css"
import CKEditorComponent from '../modal/text_editor'
import { AppContext } from '../../context/appContext.js'

import { addDoc, collection } from "firebase/firestore"
import Navbar from '../primary/navbar.js'
import Login_require from '../modal/requirements/login_require.js'

export default function Create_content() {
  const [ editor, set_editor ] = useState()
  const { user, history } = useContext(AppContext)
  const [is_require_login, set_is_require_login] = useState(false)

  const TL_ref = useRef(null)

  useEffect(() => {

    const $ = document.querySelector.bind(document)
    const $$ = document.querySelectorAll.bind(document)

    const header = $(".CC_header")

    const username = user.username
    const post_btn = $(".CC_post_btn")
    const title_input = $(".CC_title_input")
    const description_input = $(".CC_description_input")
    const test_case_list = $(".CC_test_case_list")
    const add_test_case_btn = $('.CC_add_test_case_btn')
    const remove_test_case_btn = $('.CC_remove_test_case_btn')
    const difficult_list = $(".CC_difficult_list")
    const type_list = $(".CC_type_list")
    const test_case_control = $(".CC_test_case_control")
    const demo_code_block = $(".CC_demo_code_block")
    const test_case_block = $(".CC_test_case_block")

    const tag_block = $(".CC_tag_block")
    const tag_list = $(".CC_tag_list")
    const tag_item = $$(".CC_tag_item")

    // test case config

    const input_num_config = $(".CC_input_num_config")
    const title_input_config_list = $(".CC_title_input_config_list")
    const create_btn = $(".CC_create_btn")
    const test_case_config = $(".CC_test_case_config")

    // ---------------

    const overflow = $(".CC_overflow")
    const loadder = $(".CC_loadder")
    const noti_content = $(".CC_noti_content")
    const ok_btn = $(".CC_ok_btn")

    let oup = $$(".CC_oup")
    let input_title = []

    let text
    let dem = 0

    let options = {
      timeZone: 'Asia/Ho_Chi_Minh',
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
    }

    let formatter = new Intl.DateTimeFormat([], options);

    function check_valid_post() {
      let is_valid = true

      if(title_input.value.length === 0) {
        title_input.style.borderColor = "red"
        title_input.style.borderWidth = "3px"
        is_valid = false
      }
      if(description_input.value.length === 0) {
        description_input.style.borderColor = "red"
        description_input.style.borderWidth = "3px"
        is_valid = false
      }
      if(!is_valid) {
        overflow.style.display = "none"
        loadder.style.display = "block"
      }
      return is_valid
    }

    function check_valid_task(tags, test_case) {
      console.log(test_case)
      let is_valid = true
      if(title_input.value.length === 0) {
        title_input.style.borderColor = "red"
        title_input.style.borderWidth = "3px"
        is_valid = false
        console.log(1)
      }
      if(difficult_list.value === "") {
        difficult_list.style.borderColor = "red"
        difficult_list.style.borderWidth = "3px"
        is_valid = false
        console.log(2)
      }
      if(tags.length === 0) {
        tag_list.style.borderColor = "red"
        tag_list.style.borderWidth = "3px"
        is_valid = false
        console.log(3)
      }
      if(test_case.length === 0) {
        test_case_config.style.borderColor = "red"
        test_case_config.style.borderWidth = "3px"
        is_valid = false
        console.log(5)
      }
      if(!is_valid) {
        overflow.style.display = "none"
        loadder.style.display = "block"
      }

      console.log(is_valid)
      return is_valid
    }

    function dataURLtoBlob(dataurl) {
      let arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new Blob([u8arr], { type: mime });
    }

    function getInOupValue() {
      let inp_list = $$(".CC_input_list")
      let oup = $$(".CC_oup")
      let inp_oup = []
      let input_list = []
      let input_value = []
      let output_value = []

      inp_list.forEach((item) => {
        input_value = []
        item.querySelectorAll(".CC_inp").forEach((i) => {
          input_value.push(i.value)
        })
        input_list.push(input_value)
      })

      oup.forEach((item) => {
        output_value.push(item.value)
      })

      for (let i = 0; i < output_value.length; i++) {
        inp_oup.push({
          input: input_list[i],
          output: output_value[i],
        })
      }

      console.log(inp_oup)

      return inp_oup
    }

    function toggle_mode(mode) {
      switch (mode) {
        case "task":
          test_case_control.style.display = "block"
          difficult_list.style.display = "block"
          demo_code_block.style.display = "block"
          description_input.style.display = "none"
          tag_block.style.display = "block"
          header.innerHTML = "tạo task"
          break
        case "post":
          test_case_control.style.display = "none"
          difficult_list.style.display = "none"
          demo_code_block.style.display = "none"
          description_input.style.display = "flex"
          tag_block.style.display = "none"
          header.innerHTML = "tạo post"
        default:
          test_case_control.style.display = "none"
          difficult_list.style.display = "none"
          demo_code_block.style.display = "none"
          description_input.style.display = "flex"
          tag_block.style.display = "none"
          header.innerHTML = "tạo post"
          break
      }
    }

    function showErr(err) {
      loadder.style.display = "none"
      noti_content.style.display = "block"
      noti_content.innerHTML = err
      noti_content.classList.add("err")
    }

    post_btn.onclick = () => {
      if(!username) {
        set_is_require_login(true)
        return
      }
      let url = []
      text = editor.getData()
      let default_url = []
      let editor_url = text.match(/src="([^"]+)"/g)
      let isTDU = false
      const demo_code = $(".CC_demo_code").value

      overflow.style.display = "grid"
      loadder.style.display = "block"

      let status = 200

      try {
        if (editor_url) {
          editor_url.forEach((url) => {
            if (url.indexOf("http") === -1) {
              default_url.push(url.replace("src=\"", "").replace("\"", "").replaceAll("amp;", ""))
              isTDU = true
            }
          })

          if (!isTDU) {
            url.push(editor_url[0].replace("src=\"", "").replace("\"", "").replaceAll("amp;", ""))
            if (type_list.value === "post") {
              if(!check_valid_post()) return
              const docRef = addDoc(collection(db, "post"), {
                author: username,
                author_id: user.id,
                content: text,
                image_url: url,
                title: title_input.value,
                description: description_input.value,
                post_id: `${new Date().getTime()}`,
                is_public: false,
                upvote: [],
                downvote: [],
                upload_time: formatter.format(new Date()),
              })
            } else if (type_list.value === "task") {
              let tags = Array.from($$(".CC_tag_item.CC_selected")).map(item => ({ name: item.innerHTML, link: item.dataset.link }))
              const inOupValue = getInOupValue()
              if(!check_valid_task(tags, inOupValue)) return
              fetch("http://192.168.1.249:5000/upload_task", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  author: username,
                  author_id: user.id,
                  task_name: title_input.value,
                  accepted_count: 0,
                  challenger: [],
                  content: text,
                  submission_count: 0,
                  is_public: false,
                  inp_oup: inOupValue,
                  tag: {
                    difficult: difficult_list.value ? difficult_list.value : "easy",
                    skill_require: tags
                  },
                  demo_code: JSON.stringify(demo_code),
                  input_title: input_title,
                }),
              })
                .then(res => res.json())
                .then(data => {
                  if (data.code === 400) {
                    status = data.code
                    showErr(data.err)
                    return
                  }
                })
                .catch(err => {
                  status = 400
                  showErr(err)
                  return
                })
            }
          } else {
            default_url.forEach((item, i) => {
              uploadImage(dataURLtoBlob(item)).then(new_url => {
                text = text.replace(item, new_url)
                if (i === editor_url.length - 1) {
                  if (type_list.value === "post") {
                    if(!check_valid_post()) return
                    const docRef = addDoc(collection(db, "post"), {
                      author: username,
                      author_id: user.id,
                      content: text,
                      image_url: url,
                      title: title_input.value,
                      description: description_input.value,
                      post_id: `${new Date().getTime()}`,
                      is_public: false,
                      upvote: [],
                      downvote: [],
                      upload_time: formatter.format(new Date()),
                    })
                  } else if (type_list.value === "task") {
                    let tags = Array.from($$(".CC_tag_item.CC_selected")).map(item => ({ name: item.innerHTML, link: item.dataset.link }))
                    const inOupValue = getInOupValue()
                    if(!check_valid_task(tags, inOupValue)) return
                    fetch("http://192.168.1.249:5000/upload_task", {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({
                        author: username,
                        author_id: user.id,
                        task_name: title_input.value,
                        accepted_count: 0,
                        challenger: [],
                        content: text,
                        submission_count: 0,
                        is_public: false,
                        inp_oup: inOupValue,
                        tag: {
                          difficult: difficult_list.value ? difficult_list.value : "easy",
                          skill_require: tags
                        },
                        demo_code: JSON.stringify(demo_code),
                        input_title: input_title,
                      }),
                    })
                      .then(res => res.json())
                      .then(data => {
                        if (data.code === 400) {
                          status = data.code
                          showErr(data.err)
                          return
                        }
                        console.log(data)
                      })
                      .catch(err => {
                        status = 400
                        showErr(err)
                        return
                      })
                  }
                }
              })
            })
          }
        } else {
          if (type_list.value === "post") {
            if(!check_valid_post()) return
            const docRef = addDoc(collection(db, "post"), {
              author: username,
              author_id: user.id,
              content: text,
              image_url: url,
              title: title_input.value,
              description: description_input.value,
              post_id: `${new Date().getTime()}`,
              is_public: false,
              upvote: [],
              downvote: [],
              upload_time: formatter.format(new Date()),
            })
          } else if (type_list.value === "task") {
            let tags = Array.from($$(".CC_tag_item.CC_selected")).map(item => ({ name: item.innerHTML, link: item.dataset.link }))
            const inOupValue = getInOupValue()
            if(!check_valid_task(tags, inOupValue)) return
            fetch("http://192.168.1.249:5000/upload_task", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                author: username,
                author_id: user.id,
                task_name: title_input.value,
                accepted_count: 0,
                challenger: [],
                content: text,
                submission_count: 0,
                is_public: false,
                inp_oup: inOupValue,
                tag: {
                  difficult: difficult_list.value ? difficult_list.value : "easy",
                  skill_require: tags
                },
                demo_code: JSON.stringify(demo_code),
                input_title: input_title,
              }),
            })
              .then(res => res.json())
              .then(data => {
                if (data.code === 400) {
                  status = data.code
                  showErr(data.err)
                  return
                }
                console.log(data)
              })
              .catch(err => {
                status = 400
                showErr(err)
                return
              })
          }
        }

        if (status === 400) return
        loadder.style.display = "none"
        noti_content.style.display = "block"
        noti_content.innerHTML = "Bài viết của bạn đã được gửi đi. Chúng tôi sẽ xem xét và đăng lên nếu phù hợp"
        noti_content.classList.add("success")
      } catch (err) {
        showErr(err)
      }
    }

    create_btn.onclick = () => {
      input_title = []
      const title_input_config_items = $$(".CC_title_input_config_item")
      title_input_config_items.forEach(item => {
        input_title.push(item.value)
      })
      test_case_block.style.display = "flex"
      test_case_config.style.display = "none"
    }

    ok_btn.onclick = () => {
      overflow.style.display = "none"
    }

    add_test_case_btn.onclick = () => {
      let block = document.createElement('div')
      block.classList = "CC_test_case_item"

      let input_list = document.createElement('input_list')
      input_list.classList = "CC_input_list"

      input_title.forEach(item => {
        let inp = document.createElement('textarea')
        inp.classList = "CC_input_item CC_inp"
        inp.placeholder = item
        inp.setAttribute("row", "1")
        input_list.appendChild(inp)
      })

      let oup = document.createElement('textarea')
      oup.classList = "CC_oup"
      oup.setAttribute("row", "1")
      let check_box = document.createElement('input')
      check_box.type = "checkbox"
      check_box.style = "width: 20px; height: 20px;"
      check_box.classList = "CC_check_box"
      check_box.dataset.index = dem

      block.appendChild(input_list)
      block.appendChild(oup)
      block.appendChild(check_box)
      test_case_list.appendChild(block)
      dem++

      console.log(input_title)
    }

    remove_test_case_btn.onclick = () => {

      const checked_box = $$(".CC_check_box:checked")
      const input_lists = $$(".CC_input_list")
      if (input_lists.length - checked_box.length < 2) return
      let test_case_item = $$(".CC_test_case_item")
      console.log(checked_box)

      checked_box.forEach(item => {
        console.log(test_case_item[item.dataset.index])
        test_case_item[item.dataset.index].remove()
      })

      test_case_item = $$(".CC_test_case_item")

      test_case_item.forEach((item, i) => {
        item.querySelector(".CC_check_box").dataset.index = i
      })
      dem -= checked_box.length
    }

    type_list.onchange = (e) => {
      toggle_mode(e.target.value)
      // console.log(e.target.value)
    }

    input_num_config.oninput = (e) => {
      if (input_num_config.value > 5) {
        input_num_config.value = 5
      }
      let item = []
      console.log(e.target.value)
      for (let i = 0; i < e.target.value; i++) {
        item.push(`
            <input placeholder="Enter input name" type="text" class="CC_title_input_config_item">
        `.replaceAll(" , ", ""))
      }

      title_input_config_list.innerHTML = (item.map(a => a)).join("")
    }

    tag_item.forEach(item => {
      item.onclick = () => {
        if (item.classList.contains("CC_selected")) {
          item.classList.remove("CC_selected")
          return
        }
        item.classList.add("CC_selected")
      }
    })
  }, [editor])

  return (
    <div className='dark:text-black dark:bg-white text-center'>
      <Navbar mode="light" back_link={TL_ref.current && TL_ref.current.value === "post" ? "/post_page" : "/task_list"}/>
      { is_require_login && <Login_require set_is_require_login={set_is_require_login}/>}
      <div style={{ display: "none" }} className="CC_overflow">
        <div className="CC_notification">
          <div className="CC_loadder">
            <div className="CC_loading" />
          </div>
          <div style={{ display: "none" }} className="CC_noti_content CC_success">
            Thành công
          </div>
          <div className="CC_ok_btn">OK</div>
        </div>
      </div>
      <div className="CC_header">Tạo post</div>
      <div className="CC_title">
        <input placeholder="nhập tiêu đề" type="text" className="CC_title_input" />
        <select
          style={{ display: "none" }}
          name=""
          id=""
          className="CC_difficult_list"
        >
          <option value="" selected disabled>
            Độ khó
          </option>
          <option value="easy" className="CC_difficult_item">
            Dễ
          </option>
          <option value="medium" className="CC_difficult_item">
            Vừa
          </option>
          <option value="hard" className="CC_difficult_item">
            Khó
          </option>
        </select>
        <select ref={TL_ref} name="" id="" className="CC_type_list">
          <option value="post" className="CC_type_item">
            post
          </option>
          <option value="task" className="CC_type_item">
            task
          </option>
        </select>
      </div>
      <textarea
        placeholder="nhập mô tả"
        className="CC_description_input"
        defaultValue={""}
      />
      <div style={{ display: "none" }} className="CC_tag_block flex mx-auto">
        <ul className="CC_tag_list">
          <li
            data-link="https://www.w3schools.com/python/python_datatypes.asp"
            className="CC_tag_item"
          >
            data types
          </li>
          <li
            data-link="https://www.w3schools.com/python/python_operators.asp"
            className="CC_tag_item"
          >
            operators
          </li>
          <li
            data-link="https://www.w3schools.com/python/python_lists.asp"
            className="CC_tag_item"
          >
            list
          </li>
          <li
            data-link="https://www.w3schools.com/python/python_tuples.asp"
            className="CC_tag_item"
          >
            tuples
          </li>
          <li
            data-link="https://www.w3schools.com/python/python_dictionaries.asp"
            className="CC_tag_item"
          >
            dictionary
          </li>
          <li
            data-link="https://www.w3schools.com/python/python_conditions.asp"
            className="CC_tag_item"
          >
            if else
          </li>
          <li
            data-link="https://www.w3schools.com/python/python_while_loops.asp"
            className="CC_tag_item"
          >
            while loop
          </li>
          <li
            data-link="https://www.w3schools.com/python/python_for_loops.asp"
            className="CC_tag_item"
          >
            for loop
          </li>
          <li
            data-link="https://www.w3schools.com/python/python_functions.asp"
            className="CC_tag_item"
          >
            funcion
          </li>
          <li
            data-link="https://www.w3schools.com/python/python_classes.asp"
            className="CC_tag_item"
          >
            classes/object
          </li>
          <li
            data-link="https://www.w3schools.com/python/python_math.asp"
            className="CC_tag_item"
          >
            math
          </li>
        </ul>
      </div>
      <div id="container">
        <CKEditorComponent set_editor={(data) => {
          set_editor(data)
        }} />
      </div>
      <div style={{ display: "none" }} className="CC_demo_code_block">
        <div className="CC_demo_code_title">demo code</div>
        <textarea
          spellCheck="false"
          className="CC_demo_code"
          defaultValue={
            '{`def main (params1, params2, ...):\n    """\n    params1: <type>\n    params2: <type>\n    """\n    return output`}\n        '
          }
        />
      </div>
      <div style={{ display: "none" }} className="CC_test_case_control flex mx-auto">
        <div className="CC_test_case_title">Test case</div>
        <div className="CC_test_case_config">
          <div className="CC_config">
            <div className="CC_input_config">
              <input
                min={1}
                max={5}
                type="number"
                placeholder="Nhập số input muốn tạo (max 5)"
                className="CC_input_num_config"
              />
            </div>
            <div className="CC_title_input_config_list"></div>
          </div>
          <div className="CC_config_btn">
            <div className="CC_create_btn">Tạo</div>
          </div>
        </div>
        <div style={{ display: "none" }} className="CC_test_case_block">
          <div className="CC_test_case_list">
            <div className="CC_inp_oup_title">
              <div className="CC_inp_title">input</div>
              <div className="CC_oup_title">output</div>
            </div>
          </div>
          <div className="CC_controller">
            <div className="CC_add_test_case_btn">add more</div>
            <div className="CC_remove_test_case_btn">remove</div>
          </div>
        </div>
      </div>
      <div className="CC_btns justify-center">
        <div className="CC_cancel_btn">cancel</div>
        <div className="CC_post_btn">post</div>
      </div>
    </div>
  )
}
