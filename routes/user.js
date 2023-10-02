const express=require('express');
const router=express.Router();

const {getUser,getuserRentals,getRental,getInfoPC,updateDp,updateUserDetails}=require('../controllers/user');
const {populateUserForUpdate}=require('../middleware/user');

router.get("/user/getInfo/:userId",getUser);
router.get("/user/getInfoPC/:userId",getInfoPC);
router.post("/user/:userId/update/dp",populateUserForUpdate,updateDp);
router.post("/user/:userId/update/details",populateUserForUpdate,updateUserDetails);


//user rentals
router.get("/user/:userId/rentals/:filter",getuserRentals);
router.get("/rentals/:rentalId",getRental);


module.exports=router;