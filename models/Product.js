const mongoose=require('mongoose');

const productSchema=mongoose.Schema({
    title:{
        type:String,
        required:true,
        unique:true
    },description:{
        type:String,
        require:true
    },
    mileage:{
        type:Number,
        required:true
    },
    age:{
        type:Number,
        required:true
    },
    pricePerHour:{
        type:Number,
        required:true
    },
    pricePerDay:{
        type:Number,
        required:true
    },
    gstTax:{
        type:Number,
        required:true
    },
    location:{
        type:String,
        required:true
    },
    productPoster:{
        data: Buffer,
        contentType: String,
    },
    // productAdditionalPosters:[{
    //     data: Buffer,
    //     contentType: String
    // }],
    numberOfPieces:{
       type:Number,
       required:true
    },
    numberOfPiecesAvailable:{
        type:Number,
        required:true
    },
    available:{
        type:Boolean,
        required:true
    }
},{timestamps:true})

const Product=mongoose.model("Product",productSchema);
module.exports={Product};