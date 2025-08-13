import mongoose from "mongoose"

const bankInfoSchema = mongoose.Schema(
    {
        accountName: { type: String },
        accountNumber: { type: String },
        ifscCode: { type: String },
        partnerId: { type: String },
        isBankInfo: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true
    }
)

const bankInfoModel = mongoose.model("BankInfo", bankInfoSchema)

export default bankInfoModel