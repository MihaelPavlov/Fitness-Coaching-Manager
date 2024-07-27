const { Server } = require("socket.io")
const io = new Server({ cors: "http://localhost:4200" })

let onlineUsers = []
io.on("connection", (socket) => {
    console.log("new connection", socket.id);

    socket.on("addNewUser", (userId) => {
        !onlineUsers.some((user) => user.userId === userId) &&
            onlineUsers.push({
                userId,
                socketId: socket.id
            })
        console.log("online users ----> ", onlineUsers);

        io.emit("getOnlineUsers", onlineUsers)
    });


    socket.on("disconnect", () => {
        console.log("start disconnect ")
        onlineUsers = onlineUsers.filter(user => user.socketId !== socket.id)

        io.emit("getOnlineUsers", onlineUsers)
    });

    socket.on("sendMessage", (message) => {
        const user = onlineUsers.find(user => user.userId === message.recipientId)
        console.log("send Message ---->" , user)
        if (user) {
            io.to(user.socketId).emit("getMessage", message.message);
        }
    });
})

io.listen(3500);