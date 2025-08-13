// import voucherModel from "../../models/restaurantModel/voucherModel.js";

// export const voucherSearchController = async (req, res, next) => {
//   try {
//     const {restaurant}= req.body;
//     //extracting a number from route parameters.
//     //Converts that string for example "123abc" to a number 123.
//     //The 10 is the radix, which tells parseInt to treat the number as decimal (base 10).
//     const key = parseInt(req.params.key, 10);
//     if (typeof key === "number") {
//       let result = await voucherModel.findOne({ voucherCode: key });
//       res.status(200).json(result);
//     }
//   } catch (error) {  
//    next(error);
//   }
// };

import voucherModel from "../../models/restaurantModel/voucherModel.js";

export const voucherSearchController = async (req, res, next) => {
  try {
    const { restaurant } = req.body; // Restaurant ID expected from client in the request body
  
    // Extract voucher code from route params and convert to number
    const key = parseInt(req.params.key, 10);

    // Check for valid number and non-empty restaurant ID
    if (!restaurant || isNaN(key)) {
      return res.status(400).json({ message: "Invalid restaurant ID or voucher code" });
    }

    // Search for the voucher with both voucherCode and restaurant match
    const result = await voucherModel.findOne({
      voucherCode: key,
      restaurant: restaurant
    })
    .populate({
      path: 'donor',
      select: 'fullName email'
    });

    if (!result) {
      return res.status(404).json({ message: "Voucher not found" });
    }

    // Return the result
    res.status(200).json(result);

  } catch (error) {
    next(error); // Forward error to global error handler
  }
};