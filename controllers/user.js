const {User}=require('../models/User');
const {Rental}=require('../models/Rental');
const {formidable}=require('formidable');
const fs=require('fs');

const getUser=async (req,res)=>{
console.log(req.params.userId);
// res.send("hi");
try {
    await User.findById({_id:`${req.params.userId}`}).exec()
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
    await User.findById({_id:`${req.params.userId}`}).select("firstName lastName email mobile").exec()
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


const updateDp=async(req,res)=>{
  try {
    const user=req.user;
    const form=formidable({})
    await form.parse(req).then((data)=>{
      // console.log(data)
      const files=data[1];
      if(files.dp){
        user['dp'].data=fs.readFileSync(files.dp[0].filepath);
        user['dp'].contentType = files.dp[0].mimetype;
      }
    })
    await user.save().then((user)=>{
       return res.status(200).json({
        "msg":"User Dp is updated"
       })
    }).catch((err)=>{
      console.log(err);
      return res.status(400).json({
        "err":"Failed in updating Dp"
       })
    })
  } catch (error) {
    console.log(error);
    res.status(500).json({
      "err":"Internal Error"
    });
  }
}

const updateUserDetails=async(req,res)=>{
  try {
    const user=req.user;
    const details=req.body;
    console.log(JSON.stringify(details))
    for(i in details){
     if(i==='addresses'){
       for(j in details[i]){
           user[i][0][j]=details[i][j]
       }
     }else{
      user[i]=details[i]
     }
    }
    await user.save().then((user)=>{
      //console.log(user)
      return res.status(200).json({
        "user":user,
        "msg":"user details updated"
      })
   }).catch((err)=>{
     console.log(err);
     return res.status(400).json({
       "err":"Failed in updating user details"
      })
   })
    
  } catch (error) {
    console.log(error);
    res.status(500).json({
      "err":"Internal Error"
    });
  }
}


const getuserRentals=async(req,res)=>{
  const userId=req.params.userId;
  const filter=req.params.filter;
  //console.log(userId,filter)
  const date=new Date();
  console.log(date.getHours())
  try {
     if(filter==='upcoming'){
      await Rental.find({user:`${userId}`,paymentStatus:true,rentalStartDate:{$gte:date}})
      .sort({createdAt:'desc'})
      .populate('product').exec()
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
     }
     if(filter==='completed'){
      await Rental.find({user:`${userId}`,paymentStatus:true,rentalEndDate:{$lt:date}})
      .sort({createdAt:'desc'})
      .populate('product').exec()
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
     }
     if(filter==='failed'){
      await Rental.find({user:`${userId}`,paymentStatus:false})
      .sort({createdAt:'desc'})
      .populate('product').exec()
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
     }  
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

const getAllUsers=async(req,res)=>{
    try {
      await User.find().exec()
      .then((users)=>{
        return res.status(200).json({
              "msg":users
          });
        })
        .catch((err)=>{
            console.log("Error: failed in fetching users:",err)
            return res.status(400).json({
              "err":"Unable to find users"
          });
        });
    } catch (error) {
      console.log(error);
      res.status(500).json({
          "err":"Internal Error"
      });
    }
}

const getSearchUsers=async(req,res)=>{
  const str2=req.params.searchStr;
  //console.log(str2);
  //const str2='arun'
  try {
    await User.find({$or:[
      {firstName:{$regex:`${str2}.*`,$options: 'i'}},{lastName:{$regex:`${str2}.*`,$options: 'i'}},
      {email:{$regex:`${str2}`,$options:'i'}}
    ]})
    //.select("firstName lastName email")
    .exec()
    .then((users)=>{
      //console.log(users)
      return res.status(200).json({
            "msg":users
        });
      })
      .catch((err)=>{
          console.log("Error: failed in fetching users:",err)
          return res.status(400).json({
            "err":"Unable to find users"
        });
      });
  } catch (error) {
    console.log(error);
    res.status(500).json({
        "err":"Internal Error"
    });
  }
}

const getAllRentalBookings=async(req,res)=>{
 
  try {
   await Rental.find().populate('user','email').select('orderId user paymentStatus').exec()
   .then((rentals)=>{
   
     //console.log(rentals) 
     return res.status(200).json({
           "msg":rentals
       });
     })
     .catch((err)=>{
         console.log("Error: failed in fetching rentals",err)
         return res.status(400).json({
           "err":"Unable to find rental details"
       });
     });
  } catch (error) {
   console.log(error);
   res.status(500).json({
       "err":"Internal Error"
   });
  }
}

module.exports={getUser,getuserRentals,getRental,getInfoPC,updateDp,updateUserDetails,getAllUsers,getSearchUsers,getAllRentalBookings}