
const mongoose=require('mongoose');
const {ObjectId}=mongoose.Schema;

const rentalSchema=mongoose.Schema({
        user:{
            type:ObjectId,
            ref:"User",
            required:true,
        },
        product:{
            type:ObjectId,
            ref:"Product",
            required:true
        },
        dateOfbooking:{
            type:Date,
            required:true
        },
        rentalStartDate:{
            type:Date,
            required:true
        },
        rentalStartTime:{
            type:Number,
            required:true
        },
        rentalEndDate:{
            type:Date,
            required:true
        },
        rentalEndTime:{
            type:Number,
            required:true
        },
        rentalcategory:{
            type:String,
            required:true
        },
        rentalDuration:{
            type:Number,
            required:true
        },
        cost:{
            type:Number,
            required:true
        },
        gst:{
            type:Number,
            required:true,
        },
        totalCost:{
            type:Number,
            required:true
        },
        paymentStatus:{
            type:Boolean,
            required:true
        },
        // paymentId:{
        //     type:ObjectId,
        //     ref:'Payment',
        // },
        paymentId:{
            type:String
        },
        paymentSignature:{
            type:String
        },
        orderId:{
            type:String,
            required:true
        }
},{timestamps:true})


const Rental=mongoose.model("Rental",rentalSchema);
module.exports={Rental};

