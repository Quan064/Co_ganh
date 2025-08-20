import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../../context/appContext';
import firebase,{db} from "../../firebase/config"
import Login_require from './requirements/login_require';

var doc_ref_post = db.collection("post");
export default function Vote_modal({post}) {
    const {user} = useContext(AppContext)
    const [is_upvote, set_is_upvote] = useState(false)
    const [is_downvote, set_is_downvote] = useState(false)
    const [vote, set_vote] = useState(0)
    const [is_require_login, set_is_require_login] = useState(false)

    useEffect(() => {
        console.log((post))
        if(post.upvote && post.upvote.find(({username, id}) => username === user.username && id === user.id)) {
            set_is_upvote(true)
        }
        if(post.downvote && post.downvote.find(({username, id}) => username === user.username && id === user.id)) {
            set_is_downvote(true)
        }
        if(post.upvote) {
            set_vote(post.upvote.length - post.downvote.length)
        }
    }, [post])

    function handle_upvote() {
        if(!user.username) {
            set_is_require_login(true)
            return
        }
        if(!is_upvote) {
            doc_ref_post.doc(post.id).update({
                upvote: firebase.firestore.FieldValue.arrayUnion({ username: user.username, id: user.id }),
                downvote: firebase.firestore.FieldValue.arrayRemove({ username: user.username, id: user.id })
            })
                .then(() => {
                    set_is_upvote(!is_upvote)
                    if(is_downvote) {
                        set_vote(vote+2)
                    } else {
                        set_vote(vote+1)
                    }
                    set_is_downvote(false)
                    console.log("Document successfully updated!");
                })
                .catch((error) => {
                    // The document probably doesn't exist.
                    console.error("Error updating document: ", error);
                });
        } else {
            doc_ref_post.doc(post.id).update({
                upvote: firebase.firestore.FieldValue.arrayRemove({ username: user.username, id: user.id }),
            })
                .then(() => {
                    set_is_upvote(!is_upvote)
                    set_vote(vote-1)
                    console.log("Document successfully updated!");
                })
                .catch((error) => {
                    // The document probably doesn't exist.
                    console.error("Error updating document: ", error);
                });
        }
    }

    function handle_downvote() {
        if(!user.username) {
            set_is_require_login(true)
            return
        }
        if(!is_downvote) {

            doc_ref_post.doc(post.id).update({
                upvote: firebase.firestore.FieldValue.arrayRemove({ username: user.username, id: user.id }) ,
                downvote: firebase.firestore.FieldValue.arrayUnion({ username: user.username, id: user.id })
            })
                .then(() => {
                    if(is_upvote) {
                        set_vote(vote-2)
                    } else {
                        set_vote(vote-1)
                    }
                    set_is_downvote(!is_downvote)
                    set_is_upvote(false)
                    // set_vote(vote-2)
                    console.log("Document successfully updated!");
                })
                .catch((error) => {
                    // The document probably doesn't exist.
                    console.error("Error updating document: ", error);
                });
        } else {
            doc_ref_post.doc(post.id).update({
                downvote: firebase.firestore.FieldValue.arrayRemove({ username: user.username, id: user.id })
            })
                .then(() => {
                    set_is_downvote(!is_downvote)
                    set_vote(vote+1)
                    console.log("Document successfully updated!");
                })
                .catch((error) => {
                    // The document probably doesn't exist.
                    console.error("Error updating document: ", error);
                });
        }
    }
    
    console.log(is_upvote, is_downvote)
    return (
        <div className=" mb-10 cursor-pointer text-4xl">
            {is_require_login && <Login_require set_is_require_login={set_is_require_login}/>}
            <div onClick={() => handle_upvote()} className={`h-16 w-16 rounded-full grid place-content-center ${is_upvote ? "bg-blue-500 bg-opacity-100 hover:bg-opacity-100" : "bg-slate-400 bg-opacity-20 hover:bg-opacity-40"}`}>
                <i class="fa-solid fa-chevron-up"></i>
            </div>
            <p className="text-3xl text-center my-2">{vote}</p>
            <div onClick={() => handle_downvote()} className={`h-16 w-16 rounded-full grid place-content-center ${is_downvote ? "bg-blue-500 bg-opacity-100 hover:bg-opacity-100" : "bg-slate-400 bg-opacity-20 hover:bg-opacity-40"}`}>
                <i class="fa-solid fa-chevron-down"></i>
            </div>
            {/* {is_vote ? <i class="fa-solid fa-heart"></i> : <i class="fa-regular fa-heart"></i>} */}
            {/* <i class="fa-regular fa-heart"></i>
        <i class="fa-solid fa-heart"></i> */}
        </div>
    )
}
