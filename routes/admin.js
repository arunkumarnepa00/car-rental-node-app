const express=require('express');
const router=express.Router();

const {createProduct,updateProduct,deleteProduct}=require('../controllers/admin');
const {validateAdmin}=require('../middleware/admin');

router.post("/admin/:userId/create/product",validateAdmin,createProduct);
router.delete("/admin/:userId/delete/product/:productId",validateAdmin,deleteProduct)
router.put("/admin/:userId/update/product/:productId",validateAdmin,updateProduct)

module.exports=router;