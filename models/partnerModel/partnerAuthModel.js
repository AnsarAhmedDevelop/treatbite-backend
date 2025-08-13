import mongoose from "mongoose"

const partnerSchema = mongoose.Schema(
    {
        fullName: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        contact: { type: String},
        role: {
            type: String,
            enum: ['Partner', 'User', 'SuperAdmin'],
            default: 'Partner'
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
        isApproved:{
            type: Boolean,
            default: false
        },
        avatar: {
            type: String,
            get: (image) => {
                if (image) {
                    const index = image.search('uploads');
                    if (index != -1) {
                        return `${process.env.BACKEND_URL}/${image}`;
                    } else {
                        return `${image}`;
                    }
                }
            }
        }
    }, {
    timestamps: true, toJSON: {getters: true}
}
)

const partnerModel = mongoose.model("Partner", partnerSchema)

export default partnerModel
