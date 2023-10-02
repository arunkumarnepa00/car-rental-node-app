const {User} = require('../models/User');

const populateUserForUpdate=async(req,res,next)=>{
    try {
        const user=await User.findById({_id:req.params.userId}).select(['-password']).exec();
        //console.log(user)
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

module.exports ={populateUserForUpdate}