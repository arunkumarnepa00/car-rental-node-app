const express=require('express');
const router=express.Router();

const {getAllProducts,getProductSearch,getProduct,createOrder,captureOrder,getProductsHome}=require('../controllers/product');

router.get("/products",getAllProducts);
router.get("/search/products",getProductSearch);
router.get("/product/:productId",getProduct);
router.get("/products/home",getProductsHome);

//razorpay
router.post("/product/:productId/razorpay/checkout",createOrder);
router.post("/product/:productId/razorpay/capture",captureOrder);



module.exports=router;