import mongoose from "mongoose";
const Schema = mongoose.Schema;
const voucherSchema = new Schema(
  {
    giftVoucherValue: {
      type: String,
      required: true
    },
    recipientEmail: {
      type: String,
      required: true
    },
    message: {
      type: String,
    },   
  
    pin: {
      type: String,
    },
    voucherCode: {
      type: Number,
    },
    status: {
      type: String,
      enum: ["pending", "visited",],
      default: "pending",
  },
    donor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    restaurant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
    },
    purchaseDate:{
      type: Date,
      default: Date.now
    },
    visitedDate: {
      type: Date     
    },
  },
  { timestamps: true, toJSON: { getters: true } }
);
const voucherModel = mongoose.model("Voucher", voucherSchema);
export default voucherModel