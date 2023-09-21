const { default: mongoose } = require("mongoose");
const {User, Address} = require('../models/User')
const {formidable}=require('formidable');
const fs=require('fs');
var jwt = require('jsonwebtoken');

const signup=async (req,res)=>{
    //console.log(req)
    //const user=new User(req.body);
    try {
      let user=new User();
      const form=formidable({})
      await form.parse(req).then((data) => {
        //console.log('1...=>',data)
        const fields=data[0];
        const files=data[1];
        //console.log('2...=>',fields);
        //console.log('3...=>',files);

        for (const key in fields){
          //checking for missing fields
          if(!fields[key][0] && key!=='dp'){
            return res.status(400).json({
              "err":`${key} Field is missing`
            });
          }
          //checking password match
          if(fields['password'][0]!==fields['confirmPassword'][0]){
            return res.status(400).json({
              "err":`Provide correct password`
            });
          }
          //assigning fields
          if(key!='addresses'){
            user[key]=fields[key][0];
          }else{
              let address=new Address(JSON.parse(fields[key][0]));
              //console.log(address)
              user[key].push(address);
          }
        }
         
        if(files.dp){
          // console.log(files.dp[0])
          user['dp'].data=fs.readFileSync(files.dp[0].filepath);
          user['dp'].contentType = files.dp[0].mimetype;
        }
        })
        .catch((err)=>{
          console.log("Error in formdata fields:",err)
          return res.status(400).json({
            "err":"Error in formdata"
          });
      })
      //console.log(user);
      
      //checking if user already exists
      const existUser=await User.findOne({email:user.email}).lean();
      //console.log(`user - ${user.email}. already exists:`,existUser);
      if(existUser){
          return res.status(400).json({
                    "err":"User already exists"
          });
      }
      else{
          //saving
          await user.save()
          .then((user)=>{
            //console.log("new user created :",user)
            return res.status(200).json({"msg":user})
          })
          .catch((err)=>{
            console.log("Error: failed while saving user - ", err);
            return res.status(400).json({
                "err":`${err}`
            })
          }) 
      }
      
    }catch(error) {
        console.log(error)
        res.status(500).json({
          "err":"Internal Error"
        });
    }
}



const signin=async (req,res)=>{
    console.log("request body: ",req.body);
    const {email,password}=req.body;
    if(!email || !password){
        return res.status(400).json({
            "err":"Email and password required"
    });
    }

    try {
      await User.findOne({email:`${email}`}).exec().then((user)=>{
        const loggedin=user.comparePassword(password,user.password);
        if(loggedin){
         const token=jwt.sign({_id: user._id}, process.env.TOKEN_SECRET, { expiresIn: '1h' });
            return res.status(200).json({
                "msg":"Welcome",
                "user":user,
                "token":token
        });
        }else{
            return res.status(400).json({
                "err":"Password not matching"
        });
        }
      })
      .catch((err)=>{
          console.log("Error: failed in fetching user for password match - ",err)
          return res.status(400).json({
            "err":"Unable to find user details"
        });
      });

    } catch (error) {
        console.log(error);
        res.status(500).json({
          "err":"Internal Error"
        });
    }

}
const signout=()=>{

}
module.exports={signup,signin,signout}