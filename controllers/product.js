//require('dotenv').config();
const {Product}=require('../models/Product');
const {Buffer}=require('buffer');
const Razorpay = require('razorpay');
const { v4: uuidv4 } = require('uuid');
const { validatePaymentVerification } = require('../node_modules/razorpay/dist/utils/razorpay-utils');
const {Rental} = require('../models/Rental');


const getAllProducts=async(req,res)=>{  

 await Product.find().then((data)=>{
      return res.status(200).json({
        'msg':data
      })
 }).catch((err)=>{
    console.log(err);
    return res.status(400).json({
        'err':'unable to find products'
    })
 })
}

const getProductsHome=async(req,res)=>{
  await Product.find().limit(6).then((data)=>{
    return res.status(200).json({
      'msg':data
    })
}).catch((err)=>{
  console.log(err);
  return res.status(400).json({
      'err':'unable to find products'
  })
})
}

const getProductSearch=async(req,res)=>{
    console.log(req.query);
    await Product.find({location:req.query.location}).then((data)=>{
      return res.status(200).json({
        'msg':data
      })
 }).catch((err)=>{
    console.log(err);
    return res.status(400).json({
        'err':'unable to find products'
    })
 })

}

const getProduct=async(req,res)=>{
  await Product.findById({_id:req.params.productId}).then((data)=>{
    return res.status(200).json({
      'msg':data
    })
    }).catch((err)=>{
      console.log(err);
      return res.status(400).json({
          'err':'unable to find product'
      })
    })
}

const getNewDate=(dbDate)=>{
  const date=new Date(dbDate);
  return date;
}

const createOrder=async(req,res)=>{
  console.log(req.body)
  const {totalBill,bill,tax,userId,productId,rentCategory,rentStartDate,rentStartTime,rentDuration}=req.body
  let rentEndDate= rentCategory==='days'
  ?(getNewDate(getNewDate(rentStartDate).getTime()+rentDuration*60*60*24*1000))
  :(rentStartDate);
  let rentEndTime=rentCategory==='days'?(rentStartTime):(rentStartTime+rentDuration);

  //console.log(Number(req.body.amount))
const instance = new Razorpay({ key_id: process.env.RAZORPAY_CLIENT_ID, key_secret: process.env.RAZORPAY_SECRET })
const receiptId=uuidv4();
const options={
  amount:parseInt(totalBill),
  currency: "INR",
  receipt: receiptId
}
// console.log(options)
instance.orders.create(options)
.then(async(data)=>{
  console.log(data);
  if(data.receipt===receiptId){
    const rental = new Rental({
      user:userId,
      product:productId,
      dateOfbooking: new Date(),
      rentalStartDate:rentStartDate,
      rentalStartTime:rentStartTime,
      rentalEndDate:rentEndDate,
      rentalEndTime:rentEndTime,
      rentalcategory:rentCategory,
      rentalDuration:rentDuration,
      cost:bill,
      gst:tax,
      totalCost:totalBill,
      paymentStatus:false,
      orderId:data.id
    });
    await rental.save().then((dbOrder)=>{
      return res.status(200).json({
        "msg":data
      })
    }).catch((err)=>{
      console.log(err)
      res.status(500).json({
        "err":"Internal error saving order"
     })
    })
    
  }else{
    res.status(400).json({
      "err":"receipt not matching"
   })
  }
 
})
.catch((err)=>{
  console.log(err);
  res.status(400).json({
     "err":err
  })
})

}

const captureOrder=async(req,res)=>{
   console.log(req.body);
   const {razorpay_payment_id,razorpay_order_id,razorpay_signature}=req.body;
   const validate=validatePaymentVerification({"order_id": razorpay_order_id, "payment_id": razorpay_payment_id }, razorpay_signature, process.env.RAZORPAY_SECRET);
   console.log('payment validation:',validate);
   if(validate){
      const rentalId=await Rental.findOne({orderId:razorpay_order_id}).exec();
      //console.log(rentalId._id);
      await Rental.findByIdAndUpdate(rentalId._id,{paymentStatus:true,paymentId:razorpay_payment_id,paymentSignature:razorpay_signature}).then((updatedrental)=>{
        return res.redirect(`${process.env.FRONTEND_URL}/user/rentals/upcoming/${updatedrental._id}`);
      }).catch((err)=>{
        console.log(err);
        return res.status(400).json({
          "err":"Payment update failed"
         })

      })
   }
   else{
    return res.status(400).json({
       "err":"Payment validation failed"
      })
   }
    
}


module.exports={getAllProducts,getProductsHome,getProductSearch,getProduct,createOrder,captureOrder}


