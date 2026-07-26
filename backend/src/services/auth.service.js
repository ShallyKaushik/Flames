import { OAuth2Client } from "google-auth-library";
import ApiError from "../utils/ApiError.js";
import jwt from "jsonwebtoken";
import {
    findUserByEmail,
    createUser,
    updateRefreshToken,
    removeRefreshToken,
    findUserById
} from "../repositories/auth.repository.js";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const googleLogin = async (idToken) => {
    if (!idToken) {
        throw new ApiError(400, "ID Token is required");
    }

    let payload;
    try {
        const ticket = await client.verifyIdToken({
            idToken,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        payload = ticket.getPayload();
    } catch (error) {
        throw new ApiError(401, "Invalid Google ID Token");
    }

    const { email, name, picture } = payload;

    const adminEmails = [
        "shallykaushik00@gmail.com",
        "devansh.tripathi2004@gmail.com"
    ];

    if (!email.endsWith("@mail.jiit.ac.in") && !adminEmails.includes(email)) {
        throw new ApiError(403, "Only JIIT students are allowed to use Flames.");
    }

    let user = await findUserByEmail(email);

    if (!user) {
        return {
            isNewUser: true,
            googleData: {
                email,
                fullName: name,
                picture
            }
        };
    } else {
        // Ensure existing admin users have their role upgraded if it wasn't already
        if (adminEmails.includes(email) && user.role !== "admin") {
            user.role = "admin";
            await user.save();
        }
    }

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    await updateRefreshToken(user._id, refreshToken);

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
        throw new ApiError(401, "Refresh token missing");
    }
    let decoded;
    try {
        decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    } catch (error) {
        throw new ApiError(401, "Invalid or expired refresh token");
    }
    const user = await findUserById(decoded._id);
    if (!user) {
        throw new ApiError(401, "User not found");
    }
    if (user.refreshToken !== refreshToken) {
        throw new ApiError(401, "Refresh token mismatch");
    }
    const accessToken = user.generateAccessToken();
    const newRefreshToken = user.generateRefreshToken();
    await updateRefreshToken(user._id, newRefreshToken);
    return { accessToken, refreshToken: newRefreshToken };
};

const completeProfileService = async (idToken, profileData) => {
    if (!idToken) {
        throw new ApiError(400, "ID Token is required");
    }

    let payload;
    try {
        const ticket = await client.verifyIdToken({
            idToken,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        payload = ticket.getPayload();
    } catch (error) {
        throw new ApiError(401, "Invalid Google ID Token");
    }

    const { email } = payload;
    
    const adminEmails = [
        "shallykaushik00@gmail.com",
        "devansh.tripathi2004@gmail.com"
    ];

    if (!email.endsWith("@mail.jiit.ac.in") && !adminEmails.includes(email)) {
        throw new ApiError(403, "Only JIIT students are allowed to use Flames.");
    }

    let user = await findUserByEmail(email);
    if (user) {
        throw new ApiError(400, "User already exists");
    }

    const existingUsername = await findUserByUsername(profileData.username);
    if (existingUsername) {
        throw new ApiError(400, "Username is already taken");
    }

    const role = adminEmails.includes(email) ? "admin" : "student";
    
    user = await createUser({
        ...profileData,
        collegeEmail: email,
        role,
        isVerified: true,
        collegeVerified: true,
        provider: "google"
    });

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    await updateRefreshToken(user._id, refreshToken);

    return {
        user,
        accessToken,
        refreshToken
    };
};

const checkUsernameService = async (username) => {
    if (!username) return false;
    const user = await findUserByUsername(username);
    return !user;
};

export {
    googleLogin,
    logoutUser,
    refreshAccessToken,
    completeProfileService,
    checkUsernameService
};