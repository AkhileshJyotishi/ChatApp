'use client'
import React, { useContext, useEffect, useState } from 'react'
import Button from '@mui/material/Button';
import { AuthContext } from '@/contexts/authContext';
import { socketsContext } from '@/contexts/socketcontext';

export default function Page() {

    const { friends2, setfriends, pendingfriendinvitations, setpendingfriendinvitations, onlineusers, setonlineusers, targetmailaddress, settargetmailaddress, Connectwithsocketserver, newSocket, setNewSocket,
        isuserinroom,
        setisuserinroom,
        isusercreator,
        setisusercreator,
        Roomdetails,
        setRoomdetails,
        activerooms,
        setactiverooms,
        localstream,
        setlocalstream,
        remotestreams,
        setremotestreams,
        audioonly,
        setaudioonly,
        screensharingstream,
        setscreensharingstream,
        isscreensharingactive,
        setisscreensharingactive,
        openroom,
        setopenroom, } = useContext(socketsContext);

    useEffect(() => {
        Connectwithsocketserver();
    }, [])
    //states of the great webrtc dream

    const createnewroom = () => {
        console.log("new room being created frontendJ")
        newSocket.emit("room-create")
        console.log("emmitor worminb")
    }
    //this function is for the room created by us
    const newroomcreated = (data: any) => {
        const { roomdetails } = data;
        setRoomdetails(roomdetails);


    }
    const joinroom = (roomid: any) => {
        setRoomdetails({ roomid })
        // setopenroom(false)
        setisuserinroom(true)
        setisusercreator(false)
        newSocket.emit("room-join",{roomid})



    }



    return (
        <>
        <div>
            <Button variant="contained" onClick={() => { createnewroom() }}>Create meetings</Button>
        </div>
        <div>
            {activerooms && activerooms.map((elem:any,key:number)=>{
                // console.log("MAP KE ANDAR WAKA" ,activerooms)
                return (
                    <>
                    <div key={key}>
                        <button className='bg-primary' onClick={()=>{joinroom(elem.roomid)}}>

                    {elem.roomid}
                        </button>

                    </div>
                    </>
                )

            })}
        </div>
        </>

    )
}
