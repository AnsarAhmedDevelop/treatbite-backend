import { checkSchema } from "express-validator";

export default checkSchema({  
    fullName:{      
        optional:true,  
        trim:true,
         isString:{
            errorMessage:"fullName Name must be a string"
        },
    },
    email:{     
        optional:true,   
        trim:true,
        isEmail:{
            errorMessage:"Email Should be Valid Email"
        }
    },
     contact:{      
        optional:true,  
        trim:true,        
    }   
})
