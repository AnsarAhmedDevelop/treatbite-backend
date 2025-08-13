import mongoose from "mongoose"

// Defining the schema (structure) for a User collection in MongoDB
const userSchema = mongoose.Schema(
    {
        fullName: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        // Role of the user - can only be one of the listed values
        role: {
            type: String,
            enum: ['Partner', 'User', 'SuperAdmin'],
            default: 'User'
        },
        isVerified: {
            type: Boolean,
            default: false
        },
        verifyOtp: {
            type: String,
            default: ""
        },
        verifyOtpExpireAt: {
            type: Number,
            default: 0
        },
        resetOtp: {
            type: String,
            default: ""
        },
        resetOtpExpireAt: {
            type: Number,
            default: 0
        },
        avatar: {
            type: String,
            get: (image) => {
                if (image) {
                    // Find where 'uploads' word starts in the path
                    const index = image.search('uploads');
                    // If found in path → prepend backend URL
                    if (index != -1) {
                        return `${process.env.BACKEND_URL}/${image}`;
                    } else {
                        // Else → return image as it is (absolute URL)
                        return `${image}`;
                    }
                }
            }
        }
    },

    {
        // Automatically add createdAt & updatedAt fields to the document
        // Enable 'getters' in JSON output so the avatar getter works
        timestamps: true, toJSON: { getters: true }
    }
)
// Creating the model (represents the "User" collection in MongoDB)
const userModel = mongoose.model("User", userSchema)

export default userModel