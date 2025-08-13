import { checkSchema } from "express-validator";

export const restaurantValidator = checkSchema({
  restaurantName: {
    trim: true,
    notEmpty: {
      errorMessage: "Restaurant name is required",
    },    
    isString: {
      errorMessage: "Restaurant name must be a string",
    },
  },
  restaurantAddress: {
    notEmpty: {
      errorMessage: "Restaurant address is required",
    },
    trim: true,
    isString: {
      errorMessage: "Restaurant address must be a string",
    },
  },
  restaurantContact: {
    optional: true,
    trim: true,
    isMobilePhone: {
      errorMessage: "Contact must be a valid mobile number",
    },
  },
  voucherMin: {
    optional: true,
    trim: true,
  },
  voucherMax: {
    optional: true,
    trim: true,
  },
  restaurantMenu: {
    optional: true,
    isArray: {
      errorMessage: "restaurantMenu should be an array of strings",
    },
  },
  about: {
    optional: true,
    trim: true,
  },
  otherServices: {
    optional: true,
    trim: true,
  },
  cuisine: {
    optional: true,
    isArray: {
      errorMessage: "Cuisine must be an array of valid strings",
    },
  },
  type: {
    optional: true,
    isArray: {
      errorMessage: "Type must be an array of strings",
    },
  },
  dietary: {
    optional: true,
    isArray: {
      errorMessage: "Dietary must be an array of strings",
    },
  },
  features: {
    optional: true,
    isArray: {
      errorMessage: "Features must be an array of strings",
    },
  },
});

