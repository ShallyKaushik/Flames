import mongoose from "mongoose";

const pendingUserSchema = new mongoose.Schema(
    {
        fullName: {
            type: String,
            required: true,
            trim: true,
        },

        username: {
            type: String,
            required: true,
            lowercase: true,
            trim: true,
        },

        collegeEmail: {
            type: String,
            required: true,
            lowercase: true,
            trim: true,
        },

        personalEmail: {
            type: String,
            default: "",
        },

        phoneNumber: {
            type: String,
            default: "",
        },

        password: {
            type: String,
            required: true,
        },

        otp: {
            type: String,
            required: true,
        },

        otpExpiresAt: {
            type: Date,
            required: true,
        },

        expiresAt: {
            type: Date,
            required: true,
            index: {
                expires: 0,
            },
        },
    },
    {
        timestamps: true,
    }
);

const PendingUser = mongoose.model("PendingUser", pendingUserSchema);

export default PendingUser;