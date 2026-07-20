import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import {
    registerUser,
    loginUser,
    verifyOTP as verifyOTPService,
    logoutUser,
    refreshAccessToken
} from "../services/auth.service.js";

const register = asyncHandler(async (req, res) => {

    await registerUser(req.body);

    return res.status(200).json(
        new ApiResponse(
            200,
            null,
            "OTP sent successfully"
        )
    );

});

const verifyOTP = asyncHandler(async (req, res) => {

    const data =
        await verifyOTPService(req.body);

    return res.status(201).json(

        new ApiResponse(

            201,

            data,

            "Account created successfully"

        )

    );

});

const login = asyncHandler(async (req, res) => {

    const data =
        await loginUser(req.body);

    return res.status(200).json(

        new ApiResponse(

            200,

            data,

            "Login successful"

        )

    );

});

const getCurrentUser = asyncHandler(async (req, res) => {

    return res.status(200).json(

        new ApiResponse(
            200,
            req.user,
            "Current user fetched successfully"
        )

    );

});

const logout = asyncHandler(async (req, res) => {

    await logoutUser(req.user._id);

    return res.status(200).json(

        new ApiResponse(

            200,

            null,

            "Logout successful"

        )

    );

});

const refreshToken = asyncHandler(async (req, res) => {

    const data = await refreshAccessToken(
        req.body.refreshToken
    );

    return res.status(200).json(
        new ApiResponse(
            200,
            data,
            "Token refreshed"
        )
    );

});

export {
    register,
    verifyOTP,
    login,
    getCurrentUser,
    logout,
    refreshToken
};