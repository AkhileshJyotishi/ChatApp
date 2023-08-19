'use client'
import React, { useContext, useEffect, useState } from 'react'
import Button from '@mui/material/Button';
import { AuthContext } from '@/contexts/authContext';
import { socketsContext } from '@/contexts/socketcontext';
export default function Page() {

    const { friends2, setfriends, pendingfriendinvitations, setpendingfriendinvitations, onlineusers, setonlineusers, targetmailaddress, settargetmailaddress,Connectwithsocketserver,newSocket,setNewSocket } = useContext(socketsContext);
    useEffect(()=>{
        Connectwithsocketserver();
    },[])
    //states of the great webrtc dream
    const [isuserinroom, setisuserinroom] = useState(false);
    const [isusercreator, setisusercreator] = useState(false);
    const [Roomdetails, setRoomdetails] = useState(null);
    const [activerooms, setactiverooms] = useState([]);
    const [localstream, setlocalstream] = useState(null);
    const [remotestreams, setremotestreams] = useState([]);
    const [audioonly, setaudioonly] = useState(false);
    const [screensharingstream, setscreensharingstream] = useState(null);
    const [isscreensharingactive, setisscreensharingactive] = useState(false);

    const createnewroom = () => {
        console.log("new room being created frontendJ")
        newSocket.emit("room-create")
        console.log("emmitor worminb")
    }

    const newroomcreated = (data: any) => {
        const { roomdetails } = data;
        setRoomdetails(roomdetails);


    }
    return (
        <div>
            <Button variant="contained" onClick={() => { createnewroom() }}>Create meetings</Button>
        </div>
    )
}
