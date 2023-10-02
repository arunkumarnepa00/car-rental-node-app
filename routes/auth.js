const express=require('express');
const router=express.Router();

const {signup,signin,signout}=require('../controllers/auth');
const {populateUser} = require('../middleware/auth');

router.post("/user/register",signup);
router.post("/user/signin",populateUser,signin);
router.get("/user/signout",signout);


module.exports=router;