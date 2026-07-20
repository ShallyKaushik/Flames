import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import { registerUser } from "../services/auth.service.js";
import {
    verifyOTP as verifyOTPService
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

});

export {
    register,
    verifyOTP,
    login
};