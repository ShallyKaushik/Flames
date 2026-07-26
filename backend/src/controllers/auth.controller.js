import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import {
    googleLogin as googleLoginService,
    logoutUser,
    refreshAccessToken,
    completeProfileService,
    checkUsernameService
} from "../services/auth.service.js";

const googleLogin = asyncHandler(async (req, res) => {
    const data = await googleLoginService(req.body.idToken);
    return res.status(200).json(
        new ApiResponse(200, data, "Login successful")
    );
});

const getCurrentUser = asyncHandler(async (req, res) => {
    return res.status(200).json(
        new ApiResponse(200, req.user, "Current user fetched successfully")
    );
});

const logout = asyncHandler(async (req, res) => {
    await logoutUser(req.user._id);
    return res.status(200).json(
        new ApiResponse(200, null, "Logout successful")
    );
});

const refreshToken = asyncHandler(async (req, res) => {
    const data = await refreshAccessToken(req.body.refreshToken);
    return res.status(200).json(
        new ApiResponse(200, data, "Token refreshed")
    );
});

const completeProfile = asyncHandler(async (req, res) => {
    const { idToken, ...profileData } = req.body;
    const data = await completeProfileService(idToken, profileData);
    return res.status(201).json(
        new ApiResponse(201, data, "Profile created successfully")
    );
});

const checkUsername = asyncHandler(async (req, res) => {
    const isAvailable = await checkUsernameService(req.query.username);
    return res.status(200).json(
        new ApiResponse(200, { isAvailable }, "Username availability checked")
    );
});

export {
    googleLogin,
    getCurrentUser,
    logout,
    refreshToken,
    completeProfile,
    checkUsername
};