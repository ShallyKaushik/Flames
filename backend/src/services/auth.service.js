import ApiError from "../utils/ApiError.js";

import generateOTP from "../utils/generateOTP.js";
import hashPassword from "../utils/hashPassword.js";
import isCollegeEmail from "../utils/isCollegeEmail.js";
import sendEmail from "../utils/sendEmail.js";
import {
    removeRefreshToken
} from "../repositories/auth.repository.js";
import otpTemplate from "../templates/otp.template.js";
import jwt from "jsonwebtoken";
import {
    findUserByEmail,
    findUserByUsername,
    updatePendingUser,
    findPendingUserByEmail,
    createUser,
    saveRefreshToken,
    deletePendingUser,
    updateRefreshToken,
    findUserById
} from "../repositories/auth.repository.js";


// ==============================
// Register User
// ==============================

const registerUser = async (userData) => {

    const {
        fullName,
        username,
        collegeEmail,
        password,
        personalEmail,
        phoneNumber
    } = userData;

    if (!isCollegeEmail(collegeEmail)) {
        throw new ApiError(400, "Invalid college email.");
    }

    const existingEmail = await findUserByEmail(collegeEmail);

    if (existingEmail) {
        throw new ApiError(400, "College email already registered.");
    }

    const existingUsername = await findUserByUsername(username);

    if (existingUsername) {
        throw new ApiError(400, "Username already exists.");
    }

    const hashedPassword = await hashPassword(password);

    const otp = generateOTP();

    // Log OTP for development/testing
    console.log(`\n=========================================`);
    console.log(`🔑 OTP FOR ${collegeEmail}: ${otp}`);
    console.log(`=========================================\n`);

    await updatePendingUser(collegeEmail, {

        fullName,

        username,

        collegeEmail,

        personalEmail,

        phoneNumber,

        password: hashedPassword,

        otp,

        otpExpiresAt: new Date(Date.now() + 5 * 60 * 1000),

        expiresAt: new Date(Date.now() + 10 * 60 * 1000)

    });

    await sendEmail(

        collegeEmail,

        "Flames Email Verification",

        otpTemplate(otp)

    );

};


// ==============================
// Resend OTP
// ==============================

const resendOTP = async (collegeEmail) => {
    const pendingUser = await findPendingUserByEmail(collegeEmail);
    if (!pendingUser) {
        throw new ApiError(404, "Registration request not found.");
    }
    
    if (pendingUser.otpExpiresAt && (pendingUser.otpExpiresAt.getTime() - Date.now() > 4 * 60 * 1000)) {
        throw new ApiError(400, "Please wait before requesting a new OTP.");
    }

    const otp = generateOTP();

    // Log OTP for development/testing
    console.log(`\n=========================================`);
    console.log(`🔄 RESEND OTP FOR ${collegeEmail}: ${otp}`);
    console.log(`=========================================\n`);
    
    await updatePendingUser(collegeEmail, {
        otp,
        otpExpiresAt: new Date(Date.now() + 5 * 60 * 1000)
    });

    await sendEmail(
        collegeEmail,
        "Flames Email Verification - Resend",
        otpTemplate(otp)
    );
};

// ==============================
// Verify OTP
// ==============================

const verifyOTP = async ({ collegeEmail, otp }) => {

    console.log("1");

    const pendingUser = await findPendingUserByEmail(collegeEmail);
    console.log("2");

    if (!pendingUser) {
        throw new ApiError(404, "Registration request not found.");
    }

    console.log("3");

    if (pendingUser.otpExpiresAt < new Date()) {
        throw new ApiError(400, "OTP has expired.");
    }

    console.log("4");

    if (pendingUser.otp !== otp) {
        throw new ApiError(400, "Invalid OTP.");
    }

    console.log("5");

    const adminEmails = [
        "shallykaushik00@gmail.com",
        "devansh.tripathi2004@gmail.com"
    ];
    const role = adminEmails.includes(pendingUser.collegeEmail) ? "admin" : "student";

    const user = await createUser({
        fullName: pendingUser.fullName,
        username: pendingUser.username,
        collegeEmail: pendingUser.collegeEmail,
        personalEmail: pendingUser.personalEmail,
        phoneNumber: pendingUser.phoneNumber,
        password: pendingUser.password,
        role,
        isVerified: true
    });

    console.log("6");

    const accessToken = user.generateAccessToken();

    console.log("7");

    const refreshToken = user.generateRefreshToken();

    console.log("8");

    await saveRefreshToken(user._id, refreshToken);

    console.log("9");

    await deletePendingUser(collegeEmail);

    console.log("10");

    return {
        user,
        accessToken,
        refreshToken
    };

    await deletePendingUser(collegeEmail);

    return {

        user,

        accessToken,

        refreshToken

    };

};


// ==============================
// Login User
// ==============================

const loginUser = async ({ collegeEmail, password }) => {

    const user = await findUserByEmail(collegeEmail);

    if (!user) {

        throw new ApiError(
            404,
            "User not found"
        );

    }

    const isPasswordCorrect =
        await user.isPasswordCorrect(password);

    if (!isPasswordCorrect) {

        throw new ApiError(
            401,
            "Invalid credentials"
        );

    }

    const accessToken =
        user.generateAccessToken();

    const refreshToken =
        user.generateRefreshToken();

    await updateRefreshToken(
        user._id,
        refreshToken
    );

    return {

        user,

        accessToken,

        refreshToken

    };

};

const logoutUser = async (userId) => {

    await removeRefreshToken(userId);

};


const refreshAccessToken = async (refreshToken) => {

    if (!refreshToken) {

        throw new ApiError(
            401,
            "Refresh token missing"
        );

    }

    const decoded = jwt.verify(

        refreshToken,

        process.env.JWT_REFRESH_SECRET

    );

    const user = await findUserById(decoded._id);

    if (!user) {

        throw new ApiError(
            401,
            "Invalid refresh token"
        );

    }

    if (user.refreshToken !== refreshToken) {

        throw new ApiError(
            401,
            "Refresh token mismatch"
        );

    }

    const accessToken =
        user.generateAccessToken();

    const newRefreshToken =
        user.generateRefreshToken();

    await updateRefreshToken(

        user._id,

        newRefreshToken

    );

    return {

        accessToken,

        refreshToken: newRefreshToken

    };

};

export {

    registerUser,
    verifyOTP,
    resendOTP,
    loginUser,
    logoutUser,
    refreshAccessToken

};