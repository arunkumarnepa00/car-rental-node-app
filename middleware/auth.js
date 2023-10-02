const {User} = require('../models/User');


const populateUser=async(req,res,next)=>{
    try {
    
    const {email,password}=req.body;
    if(!email || !password){
        return res.status(400).json({
            "err":"Email and password required"
    });
    }
    const user=await User.findOne({email:`${email}`}).exec();
    if(user){
        req.user=user;
        next();
    }else{
        return res.status(400).json({
            "err":"Unable to find requested user details"
        });
    }
    
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            "err": "Internal Error"
          });
    }
    
}

module.exports ={populateUser}