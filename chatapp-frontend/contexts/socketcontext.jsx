'use client'
import React, { useState, createContext, useEffect,useContext } from 'react'
import { AuthContext } from './authContext';
import io from "socket.io-client";
export const socketsContext = createContext();

export default function SocketContextProvider({ children }) {

  const { auth, setAuth } = useContext(AuthContext);
  var socket;
  function Connectwithsocketserver() {
    if (auth) {
      console.log("chalaya par nhi chala")
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
      socket.on("friend", (data) => {
        // console.log("socket m reieve ho rha h"); 
        console.log(data);
        const { pendinginvitations } = data;
        setpendingfriendinvitations(pendinginvitations)
      });
      socket.on("friends-list", (data) => {
        console.log(data)
        const { friends } = data;
        setfriends(friends);

      })
      socket.on("room-create", (data) => {
        console.log('Room details')
        console.log('data   ', data)
      })


      socket.on("online-users", (data) => {
        const { onlineusers } = data;
        setonlineusers(onlineusers)
      })
      socket.on("direct-chat-history", (data) => {
        console.log('direct chat history', data)
        const messages = data.messages.reverse();
        setMessageArray(messages);
      })
    }
  }


  const [friends2, setfriends] = useState([]);
  const [pendingfriendinvitations, setpendingfriendinvitations] = useState([])
  const [onlineusers, setonlineusers] = useState([])
  const [targetmailaddress, settargetmailaddress] = useState("");
  const [newSocket, setNewSocket] = useState(null);
  const [messagesArray, setMessageArray] = useState([]);
  return (
    <socketsContext.Provider value={{ 
      friends2, setfriends,
      pendingfriendinvitations, setpendingfriendinvitations,
      onlineusers, setonlineusers, 
      targetmailaddress, settargetmailaddress,
      Connectwithsocketserver,
      newSocket,setNewSocket,messagesArray
      }}>
      {children}
    </socketsContext.Provider>
  )
}
