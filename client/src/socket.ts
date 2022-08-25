import { io } from "socket.io-client";

const URL = "http://localhost:3000";
const socket = io(URL, { autoConnect: false });

socket.onAny((event: any, ...args: any) => {
    console.log(event, args);
});

export default socket;
