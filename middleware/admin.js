const {User}=require('../models/User');
const {Product}=require('../models/Product')

const validateAdmin=async(req,res,next)=>{

    try {
    await User.findOne({_id:`${req.params.userId}`}).exec()
    .then((user)=>{
        //console.log(user)
        if(user.role===1){
            next()
        }
        else{
            return res.status(400).json({
                "err":"Not enough privileges"
            });
        }
      })
      .catch((err)=>{
          console.log("Error: failed in fetching user while checking for admin privilege",err)
          return res.status(400).json({
            "err":"Unable to find user"
           });
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            "err":"Internal Error"
        });
    }
}

const populateProduct=async(req,res,next)=>{
 try {
    await Product.findById(req.params.productId).exec().then((product)=>{
        req.product=product;
        next();
    }).catch((err)=>{
       console.log("Error: failed in fetching product while updating",err)
        return res.status(400).json({
            "err":"Unable to find product"
        });
    })
 } catch (error) {
    console.log(error);
    return res.status(500).json({
        "err":"Internal Error"
    });
 }

}

module.exports={validateAdmin,populateProduct};

