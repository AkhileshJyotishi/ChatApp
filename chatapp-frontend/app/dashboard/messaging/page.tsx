'use client'
import { AuthContext } from '@/contexts/authContext';
import { socketsContext } from '@/contexts/socketcontext';
import axios from 'axios';
import { trace } from 'console';
import { useRouter } from 'next/navigation';
import React, { useContext, useEffect, useState } from 'react'
import io from "socket.io-client";

export default function Page() {
    // const friends = [
    //     {
    //         name: "Hello",
    //         imageUrl: ""
    //     },
    //     {
    //         name: "Ramesh",
    //         imageUrl: ""
    //     }
    // ]
    // const dara = [
    //     {
    //         "_id": "64df3edc8627375648426f59",
    //         "senderId": {
    //             "_id": "64dc9b7d5d0762a82138a381",
    //             "username": "Akhilesh",
    //             "mail": "abc@gmail.com",
    //             "profile": "https://res.cloudinary.com/dfl98cqja/image/upload/v1692175041/doraemon.jpg"
    //         },
    //         "recieverId": "64df0c2a645169a09132c6f1",
    //         "__v": 0
    //     }
    // ]


    const { auth, setAuth } = useContext(AuthContext);
    const { friends2, setfriends, pendingfriendinvitations, setpendingfriendinvitations, onlineusers, setonlineusers, targetmailaddress, settargetmailaddress } = useContext(socketsContext);
    const [activeFriend, setActiveFriend] = useState<any>(null);
    const router = useRouter();
const [chattype,setchattype]=useState<any>("");
const [chatactions,setchatactions]=useState<any>("");
const [messages,setmessages]=useState<any[]>([]);



    useEffect(() => {
        if (!auth) {
            router.push('/login');
        }
    }, [auth])

    useEffect(() => {
        Connectwithsocketserver();
    }, [])

    const sendfriendinvitation = async (data: object) => {
        try {
            const friendinvitation = await axios.post("http://localhost:5002/v1/api/friend-invitation/invite",
                data
            )
            console.log("invitation bhij gya")
            console.log(friendinvitation)
            //     //ambiguous---if error
            // if (friendinvitation.data.message) {

            //     console.log(friendinvitation.data.message);

            // }
            // else {
            //     //    console.log( dispatch({ type: 'Set_Pending_friend_invitations', pendingfriendinvitations: friendinvitation }))
            //     // </clg> c
            //     console.log(friendinvitation);
            //     // setfriends()
            //     setpendingfriendinvitations((prev: any[]) => {
            //         return [...prev, friendinvitation.data]
            //         // ...prev, friendinvitation
            //     })
            // }



        }
        catch (err) {

            console.log(err)

        }

    }
    async function declineInvitation(senderId: any) {
        // http://localhost:5002/v1/api/friend-invitation/invite
        const friendinvitation = await axios.post("http://localhost:5002/v1/api/friend-invitation/reject",
            {
                id: senderId,
                token: auth.token
            }
        )
        console.log(friendinvitation)
    }
    async function acceptInvitation(senderId: any, invitationId: any) {
        try {
            const friendinvitation = await axios.post("http://localhost:5002/v1/api/friend-invitation/accept",
                {
                    id: senderId,
                    invitationId,
                    token: auth.token
                })
            console.log(friendinvitation)


        }
        catch (err) {
            console.error(err)
        }
    }





    // window.list = pendingfriendinvitations;
var socket:any;
    function Connectwithsocketserver() {
        if (auth) {
            // console.log("chalaya par nhi chala")
             socket = io("http://localhost:5002", {
                auth: {
                    token: auth.token
                }
            });
            socket.on("connect", () => {
                console.log("successfully connected to the server");
                console.log(socket.id);
            });
            // socket.on("friend", (data) => {
            //     console.log("i am fool", data)
            // })
            socket.on("friend", (data: any) => {
                // console.log("socket m reieve ho rha h"); 
                console.log(data);
                const { pendinginvitations } = data;
                setpendingfriendinvitations(pendinginvitations)
            });
            socket.on("friends-list", (data: any) => {
                console.log(data)
                const { friends } = data;
                setfriends(friends);

            })
            socket.on("online-users", (data:any) => {
                const { onlineusers } = data;
                setonlineusers(onlineusers)
            })
        }
    }
    const senddirectmessage=(data:any)=>{
    socket.emit("direct-message",data)
    
    }

    

    return (
        <>
            {auth && <div className='flex flex-col w-screen h-screen'>
                <nav className="z-50 w-full bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
                    <div className="px-3 py-3 lg:px-5 lg:pl-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center justify-start">
                                <button
                                    data-drawer-target="logo-sidebar"
                                    data-drawer-toggle="logo-sidebar"
                                    aria-controls="logo-sidebar"
                                    type="button"
                                    className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                                    onClick={() => {
                                        document.getElementById('dropdown-user')?.classList.toggle('hidden');
                                    }}
                                >
                                    <span className="sr-only">Open sidebar</span>
                                    <svg
                                        className="w-6 h-6"
                                        aria-hidden="true"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            clipRule="evenodd"
                                            fillRule="evenodd"
                                            d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
                                        />
                                    </svg>
                                </button>
                                <a href="https://flowbite.com" className="flex ml-2 md:mr-24">
                                    <img
                                        src="https://flowbite.com/docs/images/logo.svg"
                                        className="h-8 mr-3"
                                        alt="FlowBite Logo"
                                    />
                                    <span className="self-center text-xl font-semibold sm:text-2xl whitespace-nowrap dark:text-white">
                                        Flowbite
                                    </span>
                                </a>
                            </div>
                            <div className='flex items-center gap-4'>
                                <div className='relative'>
                                    <div>
                                        <img src="/notificationBell.svg" alt="" width={20} height={20}
                                            onClick={() => {
                                                document.getElementById("notification")?.classList.toggle("hidden");
                                            }}
                                        />
                                    </div>
                                    <div className='absolute -top-3 -right-2 text-xs text-white w-4 h-4 flex items-center justify-center bg-red-500 rounded-[50%]'>
                                        {pendingfriendinvitations.length > 0 && pendingfriendinvitations.length}
                                    </div>
                                    <div
                                        className="z-50 hidden  my-4 text-base list-none bg-white divide-y divide-gray-100 rounded shadow dark:bg-gray-700 dark:divide-gray-600 absolute top-5 right-0 min-w-[200px]"
                                        id="notification"
                                    >
                                        {
                                            pendingfriendinvitations.map((friend: any, key: number) => {
                                                return (
                                                    <>
                                                        <div key={key} className='flex items-center justify-between w-full p-3'>
                                                            <div className='flex items-center gap-3'>
                                                                <img
                                                                    className="w-8 h-8 border rounded-full"
                                                                    src={`${friend.senderId.profile}`}
                                                                    alt="user photo"
                                                                />
                                                                <p>{friend.senderId.username}</p>
                                                            </div>
                                                            <div className='flex gap-2'>
                                                                <button onClick={() => {
                                                                    declineInvitation(friend._id)
                                                                }}>
                                                                    <img src="/cross.svg" alt="" width={16} height={16} />
                                                                </button>
                                                                <button onClick={() => {
                                                                    acceptInvitation(friend.senderId._id, friend._id)
                                                                }}>
                                                                    <img src="/check.svg" alt="" width={20} height={20} />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </>
                                                )
                                            })
                                        }
                                    </div>
                                </div>
                                <div className="flex items-center">
                                    <div className="relative flex items-center ml-3">
                                        <div>
                                            <button
                                                type="button"
                                                className="flex text-sm bg-gray-800 rounded-full focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
                                                aria-expanded="false"
                                                data-dropdown-toggle="dropdown-user"
                                            >
                                                <span className="sr-only">Open user menu</span>
                                                <img
                                                    className="w-8 h-8 rounded-full"
                                                    src={`${auth.profile}`}
                                                    alt="user photo"
                                                    onClick={() => {
                                                        document.getElementById("dropdown-user")?.classList.toggle("hidden");
                                                    }}
                                                />
                                            </button>
                                        </div>
                                        <div
                                            className="absolute right-0 z-50 hidden my-4 text-base list-none bg-white divide-y divide-gray-100 rounded shadow dark:bg-gray-700 dark:divide-gray-600 top-5"
                                            id="dropdown-user"
                                        >
                                            <div className="px-4 py-3" role="none">
                                                <p
                                                    className="text-sm text-gray-900 dark:text-white"
                                                    role="none"
                                                >
                                                    {auth.username}
                                                </p>
                                                <p
                                                    className="text-sm font-medium text-gray-900 truncate dark:text-gray-300"
                                                    role="none"
                                                >
                                                    {auth.email || auth.mail}
                                                </p>
                                            </div>
                                            <ul className="py-1" role="none">
                                                <li>
                                                    <a
                                                        href="#"
                                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white"
                                                        role="menuitem"
                                                    >
                                                        Dashboard
                                                    </a>
                                                </li>
                                                <li>
                                                    <a
                                                        href="#"
                                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white"
                                                        role="menuitem"
                                                    >
                                                        Settings
                                                    </a>
                                                </li>
                                                <li>
                                                    <a
                                                        href="#"
                                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white"
                                                        role="menuitem"
                                                    >
                                                        Earnings
                                                    </a>
                                                </li>
                                                <li>
                                                    <button
                                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white"
                                                        role="menuitem"
                                                        onClick={() => {
                                                            localStorage.removeItem('user');
                                                            setAuth(null);
                                                        }}
                                                    >
                                                        Sign out
                                                    </button>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </nav>
                <div className='bg-yellow-50 flex-grow flex h-[calc(100vh-56px)] overflow-y-auto'>
                    {/* FriendList */}
                    <div className='h-full p-3 w-[20%] text-black'>
                        <div className='flex flex-col h-full bg-teal-50'>
                            <input type="text" className='w-full border-none' placeholder="Search for friends" />
                            <div className='flex-grow overflow-y-auto bg-red-100 border-t border-t-gray-300'>
                                {
                                    friends2 && friends2.map((friend: any, key: number) => {
                                        return (
                                            <div key={key} className='p-3 bg-white border-b cursor-pointer border-b-gray-300 hover:bg-gray-50'
                                                onClick={() => {
                                                    setActiveFriend(friend);
                                                }}
                                            >
                                                {/* <h2>{friend.name}</h2> */}
                                            </div>
                                        )
                                    })
                                }
                                <div >
                                    <input type="text" onChange={(e) => {
                                        settargetmailaddress(e.target.value)
                                    }} />
                                    <button onClick={() => {
                                        sendfriendinvitation({
                                            targetmailaddress,
                                            token: auth.token
                                        })
                                    }}>send invitation</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Messages */}
                    <div className='h-full p-2 w-[60%] text-black'>
                        <div className='flex flex-col h-full bg-teal-50'>
                            {
                                activeFriend !== null ?
                                    <>
                                        {/* Header */}
                                        <div className='flex items-center justify-between w-full p-3 bg-white'>
                                            <div className='flex items-center gap-5'>
                                                <div>
                                                    <img src={activeFriend.image} alt="" width={'48'} height={'48'} className='rounded-full' />
                                                </div>
                                                <div>
                                                    <p><b>{activeFriend?.name}</b></p>
                                                </div>
                                            </div>
                                            <div className='flex items-center gap-4 mr-3'>
                                                <button className='mt-2 text-black'>
                                                    <img src="/telephone.svg" alt="Video Call" width={20} height={20} />
                                                </button>
                                                <button className='mt-2 text-black'>
                                                    <img src="/videocall.svg" alt="Video Call" width={20} height={20} />
                                                </button>

                                            </div>
                                        </div>
                                        {/* Chat */}
                                        <div className='flex-grow overflow-y-auto'>
                                            Hello<br></br>
                                        </div>
                                        {/* Send Message */}
                                        <div className='flex'>
                                            <input type="text" className='flex-grow border-none rounded outline-none' placeholder='Type a message' />
                                            <button className='p-2'>Send</button>
                                        </div>
                                    </>
                                    : (
                                        <div>
                                            Select some friend to chat
                                        </div>
                                    )

                            }
                        </div>
                    </div>
                    {/* Active Friends */}
                    <div className='h-full p-3 w-[20%] text-black'>
                        <div className='h-full bg-teal-50'>
                            Hello
                        </div>
                    </div>
                </div>
            </div>}
        </>
    )
}
