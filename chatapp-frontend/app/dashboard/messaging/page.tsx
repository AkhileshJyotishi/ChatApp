'use client'
import { AuthContext } from '@/contexts/authContext';
import { socketsContext } from '@/contexts/socketcontext';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import React, { useContext, useEffect, useState } from 'react'
import io from "socket.io-client";

export default function Page() {
    const friends = [
        {
            name: "Hello",
            imageUrl: ""
        },
        {
            name: "Ramesh",
            imageUrl: ""
        }
    ]


    const { auth, setAuth } = useContext(AuthContext);
    const { friends2, setfriends, pendingfriendinvitations, setpendingfriendinvitations, onlineusers, setonlineusers, targetmailaddress, settargetmailaddress } = useContext(socketsContext);
    const [activeFriend, setActiveFriend] = useState<any>(null);
    const router = useRouter();

    useEffect(() => {
        if(!auth){
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





   
    function Connectwithsocketserver() {
        if (auth) {
            console.log("chalaya par nhi chala")
            let socket = io("http://localhost:5002", {
                auth: {
                    token: auth.token
                }
            });
            socket.on("connect", () => {
                console.log("successfully connected to the server");
                console.log(socket.id);
            });
        }
    }

    return (
        <>
            {auth && <div className='flex flex-col h-screen w-screen'>
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
                            <div className="flex items-center">
                                <div className="flex items-center ml-3 relative">
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
                                        className="z-50 hidden  my-4 text-base list-none bg-white divide-y divide-gray-100 rounded shadow dark:bg-gray-700 dark:divide-gray-600 absolute top-5 right-0"
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
                                                {auth.email}
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
                </nav>
                <div className='bg-yellow-50 flex-grow flex h-[calc(100vh-56px)] overflow-y-auto'>
                    {/* FriendList */}
                    <div className='h-full p-3 w-[20%] text-black'>
                        <div className=' bg-teal-50 h-full flex flex-col'>
                            <input type="text" className='w-full border-none' placeholder="Search for friends" />
                            <div className='flex-grow bg-red-100 overflow-y-auto  border-t-gray-300 border-t'>
                                {
                                    friends.map((friend, key) => {
                                        return (
                                            <div key={key} className='border-b-gray-300 border-b p-3 hover:bg-gray-50 bg-white'
                                                onClick={() => {
                                                    setActiveFriend(friend);
                                                }}
                                            >
                                                <h2>{friend.name}</h2>
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
                        <div className=' bg-teal-50 h-full flex flex-col'>
                            {
                                activeFriend !== null ?
                                    <>
                                        {/* Header */}
                                        <div className='bg-white w-full p-3 flex justify-between items-center'>
                                            <div className='flex gap-5 items-center'>
                                                <div>
                                                    <img src={activeFriend.image} alt="" width={'48'} height={'48'} className='rounded-full' />
                                                </div>
                                                <div>
                                                    <p><b>{activeFriend?.name}</b></p>
                                                </div>
                                            </div>
                                            <div className='flex gap-3'>
                                                <button>video call</button>
                                            </div>
                                        </div>
                                        {/* Chat */}
                                        <div className='flex-grow overflow-y-auto'>
                                            Hello<br></br>
                                        </div>
                                        {/* Send Message */}
                                        <div className='flex'>
                                            <input type="text" className='flex-grow' placeholder='Type a message' />
                                            <button className='p-2'>Send</button>
                                        </div>
                                    </>
                                    :(
                                        <>
                                    <p>
                                        Select some person to chat
                                    </p>
                                    <div>
                                        {
                                            pendingfriendinvitations.map((invitation:any,key:any)=>{
                                                return (
                                                    <>
                                                    <div>
                                                        invitation
                                                    </div>
                                                    </>
                                                )
                                            })
                                        }
                                    </div>
                                    </>
                                    )

                            }
                        </div>
                    </div>
                    {/* Active Friends */}
                    <div className='h-full p-3 w-[20%] text-black'>
                        <div className=' bg-teal-50 h-full'>
                            Hello
                        </div>
                    </div>
                </div>
            </div>}
        </>
    )
}
