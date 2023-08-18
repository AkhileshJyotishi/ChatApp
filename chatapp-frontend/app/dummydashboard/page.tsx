'use client'
import { AuthContext } from '@/contexts/authContext';
import axios from 'axios';
import Link from 'next/link';
import React, { useCallback, useContext, useEffect, useReducer, useState } from "react"
export const initialstate = {
    Friends: [],
    pendingfriendinvitations: [],
    onlineusers: [],
};




export default function Page() {

    const [friends, setfriends] = useState<any[]>([]);
    const [pendingfriendinvitations, setpendingfriendinvitations] = useState<any[]>([])
    const [onlineusers, setonlineusers] = useState<any[]>([])

    const sendfriendinvitation = async (data: object) => {
        try {
            const friendinvitation = await axios.post("http://localhost:5002/v1/api/friend-invitation/invite", 
                data
            )
            //     //ambiguous---if error
            if (friendinvitation.data.message) {

                console.log(friendinvitation.data.message);

            }
            else {
                //    console.log( dispatch({ type: 'Set_Pending_friend_invitations', pendingfriendinvitations: friendinvitation }))
                // </clg> c
                console.log(friendinvitation);
                // setfriends()
                setpendingfriendinvitations((prev:any[]) => {
                    return [...prev, friendinvitation.data]
// ...prev, friendinvitation
            })
        }



        }
        catch (err) {

        console.log(err)

    }

}




return (
    <div className='flex p-2 gap-2'>
        <div className='w-[5%]'>
            <button>
                videocall
            </button>
        </div>
        <div className=' h-screen'>

            <div className='sidebar h-full '>
                <button onClick={() => { sendfriendinvitation({ name: "harish", gmail: "asdf@gmail.com" }) }}>new friend</button>
            </div>
        </div>
    </div>
)
}