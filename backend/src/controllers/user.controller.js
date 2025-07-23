import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import User from "../models/user.model.js";

const registerUser = asyncHandler(async (req, res) => {
    // Extract user details from request body
    // Validate required fields => not empty, valid email format, etc.
    // Check if user already exists in the database
    // create user object: create entry in database
    // remove password and refresh token from response
    // return response

    const { username, email, password } = req.body;

    if ([email, username, password].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "All fields are required");
    }

    const existingUser = await User.findOne({
        $or: [{ email: email.toLowerCase() }, { userName: username.toLowerCase() }],
    });

    if (existingUser) {
        throw new ApiError(409, "User already exists");
    }

    const user = await User.create({
        userName: username.toLowerCase(),
        email: email.toLowerCase(),
        password,
    });

    const createdUser = await User.findById(user._id).select("-password -refreshToken");

    if (!createdUser) {
        throw new ApiError(500, "User creation failed");
    }

    return res
        .status(201)
        .json(new ApiResponse(201, "User registered successfully", createdUser));
});
