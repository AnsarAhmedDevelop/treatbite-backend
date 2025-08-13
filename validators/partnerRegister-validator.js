import { checkSchema } from "express-validator";

export default checkSchema({  
    fullName: {
        notEmpty: true,
        errorMessage: "Full Name is Required",
        trim: true,
        isString: {
            errorMessage: "Full Name must be a String"
        }
    },
    email: {
        notEmpty: true,
        errorMessage: "Email is Required",
        trim: true,
        isEmail: {
            errorMessage: "Email must be Valid Email"
        }
    },
    contact: {       
        trim: true,
        optional:true,        
    },
    password: {
        notEmpty: true,
        errorMessage: "Password is Required",
        trim: true,
        isLength: {
            options: { min: 6 },
            errorMessage: 'Password should be at least 6 chars',
        },
        matches: {
            options: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
            errorMessage: "Password must contain letters, numbers, and special characters"
        }
    },
     restaurantName: {
        notEmpty: true,
        errorMessage: "Restaurant Name is Required",
        trim: true,
        isString: {
            errorMessage: "Restaurant Name must be a String"
        }
    },
     restaurantAddress: {
        notEmpty: true,
        errorMessage: "Restaurant Address is Required",
        trim: true,
        isString: {
            errorMessage: "Restaurant Address must be a String"
        }
    },
       restaurantContact: {       
        trim: true,
        optional:true,        
    },

})



