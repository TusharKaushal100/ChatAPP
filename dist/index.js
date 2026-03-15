import { WebSocketServer, WebSocket } from 'ws';
const wss = new WebSocketServer({ port: 8080 });
let userCount = 0;
const allSockets = [];
wss.on("connection", (socket) => {
    userCount += 1;
    socket.on("message", (message) => {
        const parsedmessage = JSON.parse(message);
        console.log("message recieved");
        if (parsedmessage.type == "join") {
            console.log("inside push");
            console.log("pushing: " + parsedmessage.payload.roomid);
            allSockets.push({
                socket,
                roomid: parsedmessage.payload.roomid
            });
        }
        if (parsedmessage.type == "chat") {
            console.log("inside the chat");
            const user = allSockets.find(x => x.socket === socket);
            if (!user) {
                socket.send("you must join a room first");
                return;
            }
            const userRoom = user.roomid;
            const userSocket = user.socket;
            console.log("user with room is trrying to send id=>" + userRoom);
            for (let i = 0; i < allSockets.length; i++) {
                if (allSockets[i].roomid == userRoom && allSockets[i].socket != userSocket) {
                    allSockets[i]?.socket.send(parsedmessage.payload.msg);
                }
            }
        }
    });
    socket.on("disconnect", () => {
        userCount -= 1;
        allSockets.filter(x => x.socket != socket);
    });
});
//# sourceMappingURL=index.js.map