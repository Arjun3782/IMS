const Joi = require('joi');

const signupValidation = (req,res,next)=>{
    const schema = Joi.object({
        name: Joi.string().min(3).max(100).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(4).max(100).required(),
        company_name: Joi.string().min(2).max(100).required(),
        role: Joi.string().valid('admin', 'manager', 'staff').default('staff'),
        department: Joi.string().max(100),
        phone: Joi.string().pattern(/^[0-9+\-\s]+$/).max(20)
    });

    const {error} = schema.validate(req.body);
    if(error){
        return res.status(400)
            .json({message: "Bad request", error});
    }
    next();
}

const loginValidation = (req,res,next)=>{
    const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(4).max(100).required()
    });

    const {error} = schema.validate(req.body);
    if(error){
        return res.status(400)
            .json({message: "Bad request", error});
    }
    next();
}

module.exports = {
    signupValidation,
    loginValidation
}