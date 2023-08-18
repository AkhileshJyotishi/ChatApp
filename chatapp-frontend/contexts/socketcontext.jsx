'use client'
import React,{useState,createContext, useEffect} from 'react'
export const socketsContext = createContext();

export default function SocketContextProvider({children}) {


  const [friends2, setfriends] = useState([]);
  const [pendingfriendinvitations, setpendingfriendinvitations] = useState([])
  const [onlineusers, setonlineusers] = useState([])
const [targetmailaddress,settargetmailaddress]=useState("")
  return (
    <socketsContext.Provider value={{friends2, setfriends,pendingfriendinvitations, setpendingfriendinvitations,onlineusers, setonlineusers,targetmailaddress,settargetmailaddress}}>
      {children}
    </socketsContext.Provider>
  )
}
