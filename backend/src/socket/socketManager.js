import { getIO } from "./socket.js";
import { onlineUsers } from "./discussion.socket.js";

const emitNotification = (userId, notification) => {
    try {
        const socketId = onlineUsers.get(userId);
        if (socketId) {
            const io = getIO();
            io.to(socketId).emit("notificationReceived", notification);
        }
    } catch (error) {
        console.error("Error emitting notification:", error);
    }
};

const broadcastNotification = (notification) => {
    try {
        const io = getIO();
        io.emit("notificationReceived", notification);
    } catch (error) {
        console.error("Error broadcasting notification:", error);
    }
};

export { emitNotification, broadcastNotification };
