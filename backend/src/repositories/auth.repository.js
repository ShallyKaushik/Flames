import User from "../models/user.model.js";
import PendingUser from "../models/pendingUser.model.js";

// =========================
// User Queries
// =========================

const findUserByEmail = (email) =>
    User.findOne({
        collegeEmail: email,
    });

const findUserByUsername = (username) =>
    User.findOne({
        username,
    });

const createUser = (data) =>
    User.create(data);

const saveRefreshToken = (userId, refreshToken) =>
    User.findByIdAndUpdate(
        userId,
        { refreshToken },
        { new: true }
    );

// =========================
// Pending User Queries
// =========================

const findPendingUserByEmail = (email) =>
    PendingUser.findOne({
        collegeEmail: email,
    });

const createPendingUser = (data) =>
    PendingUser.create(data);

const updatePendingUser = (email, data) =>
    PendingUser.findOneAndUpdate(
        { collegeEmail: email },
        data,
        {
            new: true,
            upsert: true,
        }
    );

const deletePendingUser = (email) =>
    PendingUser.deleteOne({
        collegeEmail: email,
    });

// =========================
// Exports
// =========================

export {
    findUserByEmail,
    findUserByUsername,
    createUser,
    saveRefreshToken,
    findPendingUserByEmail,
    createPendingUser,
    updatePendingUser,
    deletePendingUser,
};