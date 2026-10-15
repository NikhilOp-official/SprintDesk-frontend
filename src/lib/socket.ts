import { io, type Socket } from "socket.io-client";

export function createProjectSocket(token: string): Socket {
  return io("http://localhost:7777", {
    auth: { token },
    autoConnect: false,
    reconnection: true,
  });
}
