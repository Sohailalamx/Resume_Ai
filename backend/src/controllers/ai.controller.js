import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";


// Function for provideing keyInsights as per job description;
const getKeyPoints = asyncHandler(async (req, res) => {
    const { description } = req.body;

    if (!description) {
        throw new ApiError(400, "Job description is required");
    }

    const response = await fetch(
        "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
        {
            headers: {
                Authorization: `Bearer ${process.env.HUGGING_FACE_API_KEY}`,
                "Content-Type": "application/json",
            },
            method: "POST",
            body: JSON.stringify({ inputs: description }),
        }
    );

    const result = await response.json();

    res.status(200).json(new ApiResponse(200, "Success", result));
});

// Function to generate Latex code
const getLatexCode = asyncHandler(async (req, res) => {
    const {  } = req.body;

    if (!text) {
        throw new ApiError(400, "Job description is required");
    }

    const response = await fetch(
        "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
        {
            headers: {
                Authorization: `Bearer ${process.env.HUGGING_FACE_API_KEY}`,
                "Content-Type": "application/json",
            },
            method: "POST",
            body: JSON.stringify({ inputs: text }),
        }
    );

    const result = await response.json();

    res.status(200).json(new ApiResponse(200, "Success", result));
});

export {
    getKeyPoints,
    getLatexCode
}