import React from 'react'
import Logo from "../assets/CampusCode4.png"
const Loading = ({style = "h-[100]"}) => {
    return (
        <div className={`loadingPage ${style}`}>
            <img src={Logo} alt='Loading'/>
        </div>
    )
}

export default Loading