
import { Manager } from "socket.io-client";

export const manager = new Manager("ws://localhost:8010", {
	transports: ["websocket"],
	withCredentials: true,
	path: '/socket.io'
});