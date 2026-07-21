import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

const socketAuth = async (socket, next) => {

    try {

        const token =
            socket.handshake.auth?.token;

        if (!token) {
            return next(
                new Error("Authentication required")
            );
        }

        const decoded = jwt.verify(
            token,
            process.env.ACCESS_TOKEN_SECRET
        );

        const user = await User.findById(
            decoded._id
        ).select("-password -refreshToken");

        if (!user) {
            return next(
                new Error("Invalid token")
            );
        }

        socket.user = user;

        next();

    } catch (error) {

        next(
            new Error("Unauthorized")
        );

    }

};

export default socketAuth;