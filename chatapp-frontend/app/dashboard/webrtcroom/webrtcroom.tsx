'use client'

import { AuthContext } from '@/contexts/authContext';
import { socketsContext } from '@/contexts/socketcontext';
import { IconButton } from '@mui/material';
import CloseFullscreenIcon  from '@mui/icons-material/CloseFullscreen';
import OpeninFullIcon  from '@mui/icons-material/OpenInFull';
import axios from 'axios';
import { trace } from 'console';
import { useRouter } from 'next/navigation';
import React, { useContext, useEffect, useState } from 'react'
import io from "socket.io-client";

const fullscreenroomstyle = {
    width: "100%",
    height: "100%"
}
const minimizedroomstyle = {
    bottom: "0px",
    right: "0px",
    width: "30%",
    height: "40vh"
}

export default function Webrtc() {

    const [isroominimized, setisroomminimized] = useState(true);
    const roomresizehandler = () => {
        setisroomminimized(!isroominimized)
    }


    return (
        <>
            <div className='absolute flex flex-col items-center justify-center rounded-xl bg-[#202225]' style={isroominimized ? minimizedroomstyle : fullscreenroomstyle}>
                <IconButton style={{color:'white'} } onClick={()=>{  roomresizehandler();}}>
                    {isroominimized ? <OpeninFullIcon/>:<CloseFullscreenIcon/>}
                </IconButton>
               

            </div>
        </>
    )

}