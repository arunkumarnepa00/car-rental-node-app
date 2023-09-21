const {User}=require('../models/User');
const {Rental}=require('../models/Rental');

const getUser=async (req,res)=>{
console.log(req.params.userId);
// res.send("hi");
try {
    await User.findOne({_id:`${req.params.userId}`}).exec()
    .then((user)=>{
      return res.status(200).json({
                "user":user
        });
      })
      .catch((err)=>{
          console.log("Error: failed in fetching user ",err)
          return res.status(400).json({
            "err":"Unable to find user details"
        });
      });
} catch (error) {
    console.log(error)
    res.status(500).json({
        "err":"Internal Error"
    });
} 
}

const getInfoPC=async(req,res)=>{
  try {
    await User.findOne({_id:`${req.params.userId}`}).select("firstName lastName email mobile").exec()
    .then((user)=>{
      console.log(user)
      return res.status(200).json({
                "user":user
        });
      })
      .catch((err)=>{
          console.log("Error: failed in fetching user ",err)
          return res.status(400).json({
            "err":"Unable to find user details"
        });
      });
} catch (error) {
    console.log(error)
    res.status(500).json({
        "err":"Internal Error"
    });
} 
}

const getuserRentals=async(req,res)=>{
  const userId=req.params.userId;
  console.log(userId)
  try {
      await Rental.find({user:`${userId}`,paymentStatus:true}).populate('product').exec()
      .then((rentals)=>{
        return res.status(200).json({
              "msg":rentals
          });
        })
        .catch((err)=>{
            console.log("Error: failed in fetching user rentals ",err)
            return res.status(400).json({
              "err":"Unable to find user rentals details"
          });
        });
   }catch (error) {
    console.log(error);
    res.status(500).json({
        "err":"Internal Error"
    });
   }
}

const getRental=async(req,res)=>{
   const rentalId=req.params.rentalId;
   try {
    await Rental.findById({_id:`${rentalId}`}).populate('product').exec()
    .then((rental)=>{
      return res.status(200).json({
            "msg":rental
        });
      })
      .catch((err)=>{
          console.log("Error: failed in fetching rental",err)
          return res.status(400).json({
            "err":"Unable to find user rental details"
        });
      });
   } catch (error) {
    console.log(error);
    res.status(500).json({
        "err":"Internal Error"
    });
   }
}

module.exports={getUser,getuserRentals,getRental,getInfoPC}