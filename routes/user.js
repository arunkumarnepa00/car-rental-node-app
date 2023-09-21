const express=require('express');
const router=express.Router();

const {getUser,getuserRentals,getRental,getInfoPC}=require('../controllers/user');

router.get("/user/getInfo/:userId",getUser);
router.get("/user/getInfoPC/:userId",getInfoPC);

//user rentals
router.get("/user/:userId/rentals",getuserRentals);
router.get("/rentals/:rentalId",getRental);


module.exports=router;