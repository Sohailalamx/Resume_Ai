import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import User from "../models/user.model.js"; 



const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);

    console.log("User found:", user);

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, "something went wrong while generating tokens");
  }
};

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
        $or: [
            { email: email.toLowerCase() },
            { userName: username.toLowerCase() },
        ],
    });

    if (existingUser) {
        throw new ApiError(409, "User already exists");
    }

    const user = await User.create({
        userName: username.toLowerCase(),
        email: email.toLowerCase(),
        password,
    });

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    );

    if (!createdUser) {
        throw new ApiError(500, "User creation failed");
    }

    return res
        .status(201)
        .json(
            new ApiResponse(201, "User registered successfully", createdUser)
        );
});

const loginUser = asyncHandler(async (req, res) => {
    // get user details  req.body
    // username or email
    // find the user in database
    // password check
    // generate access token, refresh token
    // send cookies

    const { username, email, password } = req.body;

    if (!username && !email) {
        throw new ApiError(400, "Username or email is required");
    }

    if (!password) {
        throw new ApiError(400, "Password is required");
    }

    const user = await User.findOne({
        $or: [{ username }, { email }],
    });

    if (!user) {
        throw new ApiError(404, "User not exists");
    }

    const isPasswordValid = await user.isPasswordCorrect(password);

    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid password");
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
        user._id
    );

    const logedInUser = await User.findById(user._id).select(
        "-password -refreshToken"
    );

    const options = {
        httpOnly: true,
        secure: true,
    };

    res.status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options);
    res.json(
        new ApiResponse(
            200,
            "User logged in successfully",
            { user: logedInUser, accessToken, refreshToken }
        )
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  // remove refresh token from database
  // clear cookies
  // send response

  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: { refreshToken: "" },
    },
    {
      new: true,
    }
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(
        200, 
        "User logged out successfully",
        null
    ));
});

export { 
    registerUser, 
    loginUser, 
    logoutUser 
};
