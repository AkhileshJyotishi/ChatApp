'use client'
import { AuthContext } from '@/contexts/authContext';
import { socketsContext } from '@/contexts/socketcontext';
import axios from 'axios';
import { trace } from 'console';
import { useRouter } from 'next/navigation';
import React, { useContext, useEffect, useState } from 'react'
import io from "socket.io-client";
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { alpha, styled } from '@mui/material/styles';

const CssTextField = styled(TextField)({

    '& label.Mui-focused': {
        color: 'red',
    },
    '& .MuiInput-underline:after': {
        borderBottomWidth: '0',
    },
    '& .MuiOutlinedInput-root': {
        '& fieldset': {
            borderColor: 'red',
            borderWidth: '0',
        },
        '&:hover fieldset': {
            borderColor: 'red',
            borderWidth: '0',
        },
        '&.Mui-focused fieldset': {
            borderColor: 'red',
            borderWidth: '0',
        },
    },
    '& .MuiInputBase-root': {
        margin: '-1px 13px', // Set margin to 0
        padding: '0',

    },
    '& .MuiInputBase-input': {
        fontSize: '16px',
        color: '#4b5563',
        lineHeight: '1.5rem',
    },
});
import Webrtc from '../webrtcroom/webrtcroom';

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
    const messagesarray = [
        {
            owner: true,
            messageText: "hello",
            timeStamp: "2pm"
        },
        {
            owner: false,
            messageText: "brother",
            timeStamp: "2pm"
        }
    ]
    const [messagesArray, setMessageArray] = useState<any[]>([]);


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
    const [openroom,setopenroom]=useState(false)
    // const [openroom,setopenroom]=useState<boolean>();

    const Roombutton = () => {

        return (
            <>
                <button onClick={() => { createnewroom() }}>roombutton</button>
            </>
        )
    }




















    const { auth, setAuth } = useContext(AuthContext);
    const { friends2, setfriends, pendingfriendinvitations, setpendingfriendinvitations, onlineusers, setonlineusers, targetmailaddress, settargetmailaddress } = useContext(socketsContext);
    const [activeFriend, setActiveFriend] = useState<any>(null);
    const router = useRouter();
    const [chattype, setchattype] = useState<any>("");
    const [chatactions, setchatactions] = useState<any>("");
    const [messages, setmessages] = useState<any[]>([]);
    const [message, setmessage] = useState<any>("");

    // window.friend = activeFriend;
    // window.autth = auth;



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

    useEffect(() => {
        if (activeFriend) {
            console.log("use effect chala active wala");
            getDirectChatHistory(activeFriend.id);
        }
    }, [activeFriend])




    // window.list = pendingfriendinvitations;
    const [newSocket, setNewSocket] = useState<any>(null);
    var socket: any;
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
                setNewSocket(socket);
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
            socket.on("room-create", (data: any) => {
                
                console.log('Room details')
                console.log('data   ', data)
                setopenroom(true);
                setisusercreator(true)
                setisuserinroom(true)
            })
            socket.on("active-rooms",(data:any)=>{
                console.log("active rooms came from socket ",data)
                // setactiverooms(data)
                const {activerooms}=data
                activerooms.forEach((room:any)=>{
                    const rooms=[];
                    friends2.forEach((element:any) => {
                        if(element.id===room.creatorId){
                            rooms.push({...room,creatorusername:element.username})
                        }
                    });
                })
            })


            socket.on("online-users", (data: any) => {
                const { onlineusers } = data;
                setonlineusers(onlineusers)
            })
            socket.on("direct-chat-history", (data: any) => {
                console.log('direct chat history', data)
                const messages = data.messages.reverse();
                setMessageArray(messages);
            })
        }
    }
    const senddirectmessage = (data: any) => {
        newSocket.emit("direct-message", data)
    }
    const getDirectChatHistory = (id: any) => {
        newSocket.emit("direct-chat-history", { recieveuserid: id })
    }


    const createnewroom = () => {
        console.log("new room being created frontendJ")
        newSocket.emit("room-create")
        console.log("emmitor worminb")
    }
    const newroomcreated = (data: any) => {
        const { roomdetails } = data;
        setRoomdetails(roomdetails)
        
        
    }
    const handlesendmessage = () => {
        console.log("sending message to the server")

        // setmessages()
        // setmessage("");
        if (message.length > 0) {
            senddirectmessage({
                //active message wale ki id
                // recieveuserId:
                content: message,
                recieveuserid: activeFriend.id

            })
        }

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
                                    {pendingfriendinvitations.length > 0 && <div className='absolute -top-3 -right-2 text-xs text-white w-4 h-4 flex items-center justify-center bg-red-500 rounded-[50%]'>
                                        {pendingfriendinvitations.length}
                                    </div>}
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
                    <div className='h-full w-[25%] text-black'>
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
                                                <h2>{friend.username}</h2>
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
                                    <div>
                                        <Roombutton />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Messages */}
                    <div className='h-full w-[75%] text-black'>
                        <div className='flex flex-col h-full bg-teal-50'>
                            {
                                activeFriend !== null ?
                                    <>
                                        {/* Header */}
                                        <div className='flex items-center justify-between w-full p-3 bg-white'>
                                            <div className='flex items-center gap-5'>
                                                <div className='w-12 h-12 overflow-hidden border rounded-full'>
                                                    <img src={activeFriend?.profile || "/userAvatar.svg"} alt="" width={'48'} height={'48'} className='rounded-full' />
                                                </div>
                                                <div>
                                                    <p><b>{activeFriend?.username}</b></p>
                                                </div>
                                            </div>
                                            <div className='flex items-center gap-4 mr-3'>
                                                <button className='mt-2 text-black' onClick={() => { createnewroom() }}>
                                                    <img src="/telephone.svg" alt="Video Call" width={20} height={20} />
                                                </button>
                                                <button className='mt-2 text-black'>
                                                    <img src="/videocall.svg" alt="Video Call" width={20} height={20} />
                                                </button>

                                            </div>
                                        </div>
                                        {/* Chat */}
                                        <div className='flex flex-col-reverse flex-grow py-4 overflow-y-auto'>
                                            {
                                                messagesArray.length != 0 && messagesArray.map((message, key) => {
                                                    return (
                                                        <div key={key} className={`${message.authorId._id === activeFriend.id ? 'text-left' : 'text-right'} m-3`}>
                                                            <span className={`${message.authorId._id !== activeFriend.id ? 'bg-green-300' : 'bg-gray-200'} p-3`}>{message.content}</span>
                                                        </div>
                                                    )
                                                })
                                            }
                                        </div>
                                        {/* Send Message */}
                                        <div className='flex'>
                                            <input type="text" className='flex-grow border-none rounded outline-none' placeholder='Type a message' onChange={(e) => {
                                                setmessage(e.target.value)
                                            }} />
                                            {/* <div className='flex-grow h-full bg-red-200'>
                                                <Box
                                                    component="form"
                                                    noValidate
                                                    sx={{
                                                        '& .MuiTextField-root': { ml: -1.5, width: 'fullWidth',height:"full" },
                                                    }}
                                                >
                                                    <CssTextField
                                                        label=""
                                                        id="custom-css-outlined-input"
                                                        multiline
                                                        fullWidth
                                                        autoFocus
                                                        spellCheck="false"
                                                    />
                                                </Box>
                                            </div> */}
                                            <button className='p-2' onClick={() => { handlesendmessage() }}>Send</button>
                                        </div>
                                    </>
                                    : (
                                        <>
                                            <div>
                                                <div>seelectfdlhlfd</div>
                                                <div>
                                                    <Webrtc />
                                                </div>


                                            </div>

                                        </>
                                    )

                            }
                        </div>
                    </div>
                </div>
            </div>}
        </>
    )
}
