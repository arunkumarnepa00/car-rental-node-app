const {Product}=require('../models/Product');
const {formidable}=require('formidable');
const fs=require('fs');

const createProduct=async(req,res)=>{
    //console.log(req)
    try {
      let product=new Product();
      const form=formidable({})
      await form.parse(req).then((data)=>{
        const fields=data[0];
        const files=data[1];
        // console.log('1....',fields);
        for (const key in fields) {
            //checking for missing fields
            if(!fields[key][0] && key!=='productPoster'){
                return res.status(400).json({
                  "err":`${key} Field is missing`
                });
            }
            //assigning fields
            product[key]=fields[key][0];
        }
        // console.log('2....',files);
        if(files.productPoster){
            //console.log(files.dp[0])
            product['productPoster'].data=fs.readFileSync(files.productPoster[0].filepath);
            product['productPoster'].contentType = files.productPoster[0].mimetype;
        }
      })
      .catch((err)=>{
        console.log("Error in formdata fields:",err)
        return res.status(400).json({
          "err":"Error in formdata"
        });
      })
      // console.log('product before save:',product);
      
      //checking if product already exists
      const existProduct=await Product.findOne({title:product.title}).lean();
      //console.log(`product - ${product.title}. already exists:`,existProduct);
      if(existProduct){
            return res.status(400).json({
                    "err":"Product already exists"
            });
      }else{
            //saving
          await product.save()
            .then((product)=>{
                console.log("new product created :",product)
                return res.status(200).json({"msg":product})
            })
            .catch((err)=>{
                console.log("Error: failed while saving product - ", err);
                return res.status(400).json({
                    "err":`${err}`
                })
            }) 
      }
    }catch (error) {
        console.log(error)
        return res.status(500).json({
          "err":"Internal Error"
        });
    }

}

const updateProduct=async(req,res)=>{
  //console.log(req)
  try {

    const product=req.product;
    const form=formidable({})
    
    await form.parse(req).then((data)=>{
      const fields=data[0];
      const files=data[1];

      //console.log('1....',fields);
      for (key in fields){
        product[key]=fields[key][0]
      } 
      // console.log('2....',files);
      if(files.productPoster){
        //console.log(files.dp[0])
        product['productPoster'].data=fs.readFileSync(files.productPoster[0].filepath);
        product['productPoster'].contentType = files.productPoster[0].mimetype;
      }
    })
    .catch((err)=>{
      console.log("Error in formdata fields:",err)
      return res.status(400).json({
        "err":"Error in formdata"
      });
    })  


     product.save().then((updatedProduct)=>{
        //console.log(updatedProduct);
        return res.status(200).json({
          "msg":updatedProduct
        });

     }).catch((err)=>{
      console.log(err)
      return res.status(400).json({
        "err":err
      });
     })

  }catch (error) {
      console.log(error)
      return res.status(500).json({
        "err":"Internal Error"
      });
  }

}


const deleteProduct=async(req,res)=>{
  try {
    //{ acknowledged: true, deletedCount: 1 }
    await Product.deleteOne({_id:req.params.productId}).then((product)=>{
      return res.status(200).json({
        "msg":`${req.params.productId}`
      });
    }).catch((err)=>{
      console.log("Error while deleting product:",err);
      return res.status(400).json({
        "err":`${err}`
      });
    })
  } catch (error) {
      console.log(error);
      return res.status(500).json({
        "err":"Internal Error"
      });
  }
}



module.exports={createProduct,updateProduct,deleteProduct}