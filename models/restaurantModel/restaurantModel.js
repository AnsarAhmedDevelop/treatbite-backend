import mongoose from "mongoose"

const restaurantSchema = mongoose.Schema(
    {
        restaurantName: { type: String, required: true },
        restaurantAddress: { type: String, required: true },
        restaurantContact: { type: String },
        partner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Partner",
        },
        isCompleteInfo: {
            type: Boolean,
            default: false,
        },
        isPublished: {
            type: Boolean,
            default: false,
        },
        voucherMin: { type: String },
        voucherMax: { type: String },
        restaurantMenu: { type: [String] },
        about: { type: String },
        otherServices: { type: String },
        cuisine: {
            type: [String],
            enum: ["Indian", "American", "Chinese", "Italian", "Thai", "International", "Afghani"],
        },
        type: {
            type: [String],
            enum: ["Restaurant", "Cafe", "Bar"],
        },
        dietary: {
            type: [String],
            enum: ["vegAvailable", "nonVegAvailable", "vegetarianOnly"],
        },
        features: {
            type: [String],
            enum: ["allDayDining", "privateDiningRoom", "waterfrontDining", "outdoorDining", "kidsPlayArea", "familyFriendly", "Brunch", "Breakfast", "smookingArea"],
        },
        coverPhoto: {
            type: String,
            get: (image) => {
                if (image) {
                    return `${process.env.BACKEND_URL}/${image}`;
                }
            }
        },
        ambiencePhotos: [
            {
                type: String,
                get: (image) => {
                    if (image) {
                        return `${process.env.BACKEND_URL}/${image}`;
                    }
                }
            }
        ]

    },
    {
        timestamps: true, toJSON: { getters: true }
    }
)
const restaurantModel = mongoose.model("Restaurant", restaurantSchema)

export default restaurantModel