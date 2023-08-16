import io from "socket.io-client";

import { AuthContext } from "@/contexts/authContext";
import { useContext } from "react";
let socket;
export default function Connectwithsocketserver() {
  const { auth, setAuth } = useContext(AuthContext);

  // const jwttoken = userdetails.token;

  socket = io("http://localhost:5002", {
    auth: {
      token: auth.token
    }
  });
  socket.on("connect", () => {
    console.log("successfully connected to the server");
    console.log(socket.id);
  });
};
