const { check, validationResult } = require("express-validator");



exports.validateUser=[
    
        check("uid").isLength({min:1}).withMessage("Enter a valid uid"),
        check('salutation',"Enter a salutation").isLength({min:1}),
        check('name',"Enter a valid name").isLength({min:3}),
        check('post',"Enter a post").isLength({min:1}),
        check('email',"Enter a post").isEmail(),
        (req,resp,next)=>{
            const errors = validationResult(req);
            if (!errors.isEmpty())
              
                {return resp.status(422).json({errors: errors.array()});}
            next();
        }
        
    
    
];