import User from "../models/user.model.js";
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

    const updateRefreshToken = (userId, refreshToken) => {

    return User.findByIdAndUpdate(

        userId,

        {
            refreshToken
        },

        {
            new: true
        }

    );

};


const removeRefreshToken = (userId) => {

    return User.findByIdAndUpdate(

        userId,

        {
            $unset: {
                refreshToken: 1
            }
        },

        {
            new: true
        }

    );

};

const findUserById = (userId) => {

    return User.findById(userId);

};

// =========================
// Exports
// =========================

export {
    findUserByEmail,
    findUserByUsername,
    createUser,
    saveRefreshToken,
    updateRefreshToken,
    removeRefreshToken,
    findUserById

};