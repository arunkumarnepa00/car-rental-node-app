const express=require('express');
const router=express.Router();

const {createProduct,updateProduct,deleteProduct}=require('../controllers/admin');
const {validateAdmin,populateProduct}=require('../middleware/admin');
const {getAllUsers,getSearchUsers,getAllRentalBookings}=require('../controllers/user');

router.post("/admin/:userId/create/product",validateAdmin,createProduct);
router.delete("/admin/:userId/delete/product/:productId",validateAdmin,deleteProduct)
router.put("/admin/:userId/update/product/:productId",validateAdmin,populateProduct,updateProduct)

router.get("/admin/:userId/users",validateAdmin,getAllUsers);
router.get("/admin/:userId/search/users/:searchStr",validateAdmin,getSearchUsers);
router.get("/admin/:userId/rentals",validateAdmin,getAllRentalBookings);

module.exports=router;