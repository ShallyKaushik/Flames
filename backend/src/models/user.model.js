import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema(
    {
        fullName: {
            type: String,
            required: true,
            trim: true,
        },

        username: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },

        collegeEmail: {
            type: String,
            required: true,
            unique: true,
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

        provider: {
            type: String,
            default: "google",
        },

        collegeVerified: {
            type: Boolean,
            default: true,
        },

        avatar: {
            type: String,
            default: "",
        },

        gender: {
    type: String,
    enum: [
        "male",
        "female",
        "prefer-not-to-say",
    ],
    default: "prefer-not-to-say",
},

        bio: {
    type: String,
    maxlength: 150,
    default: "",
},


avatar: {
    type: String,
    default: "avatar-1.png",
},

        role: {
            type: String,
            enum: ["student", "coordinator", "admin"],
            default: "student",
        },

        isVerified: {
            type: Boolean,
            default: false,
        },

        verificationBadge: {
            type: Boolean,
            default: false,
        },

        refreshToken: {
            type: String,
        },
        branch: {
    type: String,
    default: "",
},

year: {
    type: Number,
},

skills: [{
    type: String,
}],

interests: [{
    type: String,
}],

lastSeen: {
    type: Date,
    default: Date.now,
},

isActive: {
    type: Boolean,
    default: true,
},
    },
    {
        timestamps: true,
    }
);

userSchema.methods.generateAccessToken = function () {

    return jwt.sign(
        {
            _id: this._id,
            username: this.username,
            role: this.role,
        },
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_EXPIRES_IN,
        }
    );

};
userSchema.methods.generateRefreshToken = function () {

    return jwt.sign(
        {
            _id: this._id,
        },
        process.env.JWT_REFRESH_SECRET,
        {
            expiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
        }
    );

};
const User = mongoose.model("User", userSchema);

export default User;