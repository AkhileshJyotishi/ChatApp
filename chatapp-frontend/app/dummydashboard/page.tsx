'use client'
import { AuthContext } from '@/contexts/authContext';
import axios from 'axios';
import Link from 'next/link';
import { reducer, initialstate } from '../reducers/reducers'
import React, { useCallback, useContext, useEffect, useReducer, useState } from "react"


export default function Page() {

    // const { Friends, onlineusers, pendingfriendinvitations } = initialstate;
    const [state, dispatch] = useReducer(reducer, initialstate);

    const sendfriendinvitation = async (data: object) => {
        try {
            const friendinvitation = await axios.post("http://localhost:5002/v1/api/friend-invitation/invite", {
                data
            })
            //ambiguous---if error
            if(friendinvitation.data.message){

                console.log(friendinvitation.data.message);

            }
            else{
                // dispatch({type:'Friends.Set_Pending_friend_invitations',pendingfriendinvitations:''})
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
                    <button>new friend</button>
                </div>
            </div>
        </div>
    )
}