const { default: mongoose } = require("mongoose");
const bcrypt = require("bcrypt");

const addressSchema=mongoose.Schema({
  addressType:{
    type:String,
    required:true
  },
  addressLine:{
    type:String,
    required:true
  },
  state:{
    type:String,
    required:true
  },
  zip:{
    type:String,
    required:true
  },
  country:{
    type:String,
    required:true
  },
})
const userSchema =mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName:{
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true,
  },
  mobile:{
    type:String,
    required:true,
    unique:true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: Number,
    default: 0,
    required:true
  },
  dp:{
    data: Buffer,
    contentType: String
  },
  addresses:[addressSchema]
},{timestamps:true});


userSchema.pre('save',async function(next){
    try {
        await bcrypt.hash(this.password,10).then((hash)=>{
            console.log("user password is hashed:", hash);
            this.password = hash;
          }).catch((err)=>{
            console.log("error during creating hashed password:",err);
          })
    } catch (error) {
        console.log(error);
    }
    next;
});
userSchema.methods.comparePassword=
  async function(enterpassword,hash){
        await bcrypt.compare(enterpassword, hash).then((result)=>{
            return true; 
        }).catch((err)=>{
            return false;
        })
    }

const User = mongoose.model("User", userSchema);
const Address=mongoose.model("Address", addressSchema);

module.exports = {User,Address};
