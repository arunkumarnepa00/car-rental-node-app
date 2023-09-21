const mongoose=require('mongoose');
const {ObjectId}=mongoose.Schema;
const {User} =require('./User');

const paymentSchema=mongoose.Schema({
    user:{
        type:ObjectId,
        ref:"User",
        required:true
    },
    paymentAmount:{
        type:Number,
        required:true,
    },
    paymentStatus:{
        type:String,
        enum:["success","failed"],
        required:true
    },
    paymentMethod:{
        type:String
    },
    paymentSignature:{
        type:String
    }
},{timestamps:true})

const Payment=mongoose.model("Payment",paymentSchema);
module.exports={Payment};