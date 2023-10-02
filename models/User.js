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
  city:{
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


// userSchema.pre('save',async function(next){
userSchema.methods.hashPassword=
async function(password){
    try {
        const hash=await bcrypt.hash(password,10)
        console.log("user password is hashed:", hash);
        return hash;
    } catch (error) {
        console.log(error);
    }
};
userSchema.methods.comparePassword=
async function(enterpassword,hash){
    //console.log('hi')
    try {
      const result=await bcrypt.compare(enterpassword,hash);
      console.log('password comparison result:',result);
      return result
    } catch (error) {
      console.log("error while comparing password:",error)
      return {"err":error} 
    }
};

const User = mongoose.model("User", userSchema);
const Address=mongoose.model("Address", addressSchema);

module.exports = {User,Address};
