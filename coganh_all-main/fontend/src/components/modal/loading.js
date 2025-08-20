import React, { useEffect, useState } from 'react'
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

export default function Loading({set_close_loading}) {
    // let percentage = 20
    const [percentage, set_percentage] = useState(0)
    useEffect(() => {
        if(percentage === 100) {
            set_close_loading(false)
            return
        }
        setTimeout(() => {
            set_percentage((e) => e + 1)
        }, 500)
        // console.log(percentage)
    }, [percentage])
    return (
        <div className="w-40 h-40 z-[10000000000000000] absolute">
            <CircularProgressbar value={percentage} text={`${percentage}%`} />;
        </div>
    )
}
