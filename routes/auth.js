const express=require('express');
const router=express.Router();

const {signup,signin,signout}=require('../controllers/auth');


router.post("/user/register",signup);
router.post("/user/signin",signin);
router.get("/user/signout",signout);


module.exports=router;