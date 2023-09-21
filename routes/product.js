const express=require('express');
const router=express.Router();

const {getAllProducts,getProductSearch,getProduct,createOrder,captureOrder}=require('../controllers/product');

router.get("/products",getAllProducts);
router.get("/search/products",getProductSearch);
router.get("/product/:productId",getProduct);

//paypal
//router.post("/product/:productId/checkout/createPaypalOrder",productCheckout)

//razorpay
router.post("/product/:productId/razorpay/checkout",createOrder);
router.post("/product/:productId/razorpay/capture",captureOrder);



module.exports=router;