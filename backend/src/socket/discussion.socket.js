import {
    createMessageService,
    updateMessageService,
    deleteMessageService,
    formatDiscussionMessage,
} from "../services/discussion.service.js";

const onlineUsers = new Map();

const registerDiscussionSocket = (io) => {

    io.on("connection", (socket) => {

        console.log(
            `${socket.user.username} connected`
        );

        onlineUsers.set(
            socket.user._id.toString(),
            socket.id
        );

        socket.on(
            "joinDiscussion",
            () => {

                socket.join("discussion");

            }
        );

        socket.on(
            "sendMessage",
            async (data) => {

                try {

                    const { rawMessage } =
                        await createMessageService(
                            socket.user,
                            data.message,
                            data.isAnonymous
                        );

                    const sockets = await io.in("discussion").fetchSockets();
                    for (const s of sockets) {
                        if (s.user) {
                            const tailoredMessage = formatDiscussionMessage(rawMessage, s.user);
                            s.emit("messageReceived", tailoredMessage);
                        }
                    }

                } catch (error) {

                    socket.emit(
                        "discussionError",
                        error.message
                    );

                }

            }
        );

        socket.on(
            "typing",
            () => {

                socket.broadcast
                    .to("discussion")
                    .emit(
                        "userTyping",
                        {
                            userId: socket.user._id,
                            username: socket.user.username,
                        }
                    );

            }
        );

        socket.on(
            "stopTyping",
            () => {

                socket.broadcast
                    .to("discussion")
                    .emit(
                        "userStoppedTyping",
                        {
                            userId: socket.user._id,
                        }
                    );

            }
        );

        socket.on(
            "editMessage",
            async (data) => {

                try {

                    const { rawMessage } =
                        await updateMessageService(
                            socket.user,
                            data.messageId,
                            data.message
                        );

                    const sockets = await io.in("discussion").fetchSockets();
                    for (const s of sockets) {
                        if (s.user) {
                            const tailoredMessage = formatDiscussionMessage(rawMessage, s.user);
                            s.emit("messageUpdated", tailoredMessage);
                        }
                    }

                } catch (error) {

                    socket.emit(
                        "discussionError",
                        error.message
                    );

                }

            }
        );

        socket.on(
            "deleteMessage",
            async (data) => {

                try {

                    await deleteMessageService(
                        socket.user,
                        data.messageId
                    );

                    io.to("discussion").emit(
                        "messageDeleted",
                        {
                            messageId: data.messageId,
                        }
                    );

                } catch (error) {

                    socket.emit(
                        "discussionError",
                        error.message
                    );

                }

            }
        );

        socket.on(
            "disconnect",
            () => {

                onlineUsers.delete(
                    socket.user._id.toString()
                );

                console.log(
                    `${socket.user.username} disconnected`
                );

            }
        );

    });

};

export {
    registerDiscussionSocket,
    onlineUsers,
};