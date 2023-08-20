'use client'
import React, { useContext, useEffect, useState } from 'react'
import Button from '@mui/material/Button';
import { AuthContext } from '@/contexts/authContext';
import { socketsContext } from '@/contexts/socketcontext';
import Webrtc from '../webrtcroom/webrtcroom';
import * as webrtchandler from '../webrtcroom/webrtchandle';

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
        setopenroom, videodisplay, setvideodisplay } = useContext(socketsContext);


    const onlyaudioconstraints = {
        audio: true,
        video: false,
    };
    const defaultconstraints = {
        audio: true,
        video: false,
        // we can also use video:{
        // width:
        // height:
        // }
    };
    const getlocalstreampreview = (onlyaudio = false, callback: any) => {
        const constraints = onlyaudio ? onlyaudioconstraints : defaultconstraints;
        navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
            console.log("localstreampreview func ke andar   ", stream)
            setlocalstream(stream);
            callback()
        }).catch((err) => {
            console.log(err)
        })
    };






    useEffect(() => {
        Connectwithsocketserver();
    }, [])
    //states of the great webrtc dream

    const createnewroom = () => {
        const successcallback = () => {

            console.log("new room being created frontendJ")
            newSocket.emit("room-create")
            console.log("emmitor worminb")
        }
        getlocalstreampreview(false, successcallback)

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
        newSocket.emit("room-join", { roomid })
        setvideodisplay(!videodisplay)


    }
    const leaveroom = () => {
        const roomid = Roomdetails.roomid
        newSocket.emit("leave-room", { roomid })
        // setopenroom(false)
        setisuserinroom(false);

    }

    let x = videodisplay ? 'block' : 'none';

    return (
        <>
            <div>
                <Button variant="contained" onClick={() => { createnewroom() }}>Create meetings</Button>
            </div>
            <div>
                {activerooms && activerooms.map((elem: any, key: number) => {
                    // console.log("MAP KE ANDAR WAKA" ,activerooms)
                    return (
                        <>
                            <div key={key}>
                                <button className='bg-primary' style={{ backgroundColor: 'pink' }} onClick={() => { joinroom(elem.roomid) }}>

                                    {elem.roomid}
                                </button>

                                <button className='bg-primary' style={{ backgroundColor: 'red' }} onClick={() => { leaveroom() }}>

                                    {elem.roomid}
                                </button>
                            </div>

                        </>
                    )

                })}
                <div className={`${x}`}>
                    <Webrtc />
                </div>
            </div >
        </>

    )
}
