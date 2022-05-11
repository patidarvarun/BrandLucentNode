const Product = require("../models/productModel");
const multer = require("multer");
const { mongoose } = require("mongoose");
const product = require("../models/productModel");

const ObjectId = mongoose.Types.ObjectId;
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, `./uploads/`);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});
exports.upload = multer({ storage: storage });

exports.product_create = async (req, res) => {
  //   if (Object.keys(body).length === 0 && body.constructor === Object) {
  //     res.status(400).send({ message: "data not proper formated..." });
  //   }
  // console.log("body = ", body)
  console.log(req.file);
  let imagePath = "";
  if (req.file) {
    imagePath = req.file.path;
  }
  const catsave = new Product({
    _id: mongoose.Types.ObjectId(),
    name: req.body.name,
    description: req.body.description,
    image: imagePath,
    price: req.body.price,
    quantity: req.body.quantity,
    cat_id: req.body.cat_id,
    visitedNumberOfTime: 0
  });
  await catsave
    .save()
    .then((response) => {
      res.status(200).send(response);
    })
    .catch((err) => {
      res.status(400).send({ message: err.message });
    });
};
exports.Get_product_by_category = async (req, res) => {
  const id = req.params.id;
  console.log(req.params);
  await Product.find({ cat_id: id })

    .then((response) => {
      res.status(200).send(response);
    })
    .catch((err) => {
      res.status(400).send({ message: err.message });
    });
};

exports.Get_All_Product = async (req, res) => {
  await Product.find()
    .populate([{ path: "cat_id" }])

    .sort({ created_at: -1 })

    .then((response) => {
      res.status(200).send(response);
    })
    .catch((err) => {
      res.status(400).send({ message: err.message });
    });
};

exports.Delete_product = async (req, res) => {
  let Products = await Product.findById(req.params.id);
  console.log(Products, "Products");
  if (!Products) {
    return res.status(500).json({
      success: false,
      message: "Product was not found",
    });
  }
  try {
    await Products.remove();
    res.status(201).json({
      success: true,
      message: "Product deleted",
    });
  } catch (err) {
    res.json({ error: err.message || err.toString() });
  }
};

exports.Update_Product = (req, res) => {
  var image;
  if (req.file) {
    image = req.file.path;
  }

  Product.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      description: req.body.description,
      image: image,
      price: req.body.price,
      quantity: req.body.quantity,
      cat_id: req.body.cat_id,
    },
    { new: true },
    (err, productupdatedData) => {
      if (err) {
        res.status(404).json({
          message: "please enter correct productoffer id ",
          subErr: err.message,
        });
      } else {
        res.status(200).json({
          updated_user: "Product Updated successfully",
          productupdatedData: productupdatedData,
        });
      }
    }
  );
};

exports.visitedProductNumberOfTime = async (req,res)=>{
  try{
    const productid = req.query.productid ;
    var count = 0
    var updateData ={
      visitedNumberOfTime : ""
    };
    if (!ObjectId.isValid(productid) && !ObjectId(productid)) {
      res.status(400).send({ message: "productid id not valid" });
    }
    if(!productid){
      res.status(400).send({
        message:"product id is required "
      })
    }else{
      await product.findById(productid).then(preData=>{
       if(!preData){
        res.status(200).send({
          message:"product is not there "
       })
       }else{
         count = preData.visitedNumberOfTime;
          updateData.visitedNumberOfTime = count + 1
             Product.findByIdAndUpdate(productid,updateData,{new:true},(error , updatedData)=>{
            if(error){
              res.status(400).send({
                message:"not visited",
                subError:error.message
              })
            }else{
              if(!updatedData){
                res.status(200).send({
                   message:"product is not there for visit"
                })
              }else{
                res.status(200).send({
                  message:"product is not there for visit",
                  data:updatedData
               })
              }
            }
          
        })

       }
      }).catch(error=>{
        res.status(400).send({
          message:"no previous data found",
          subError:error.message
        })
      })

 
    }
 
  }catch(error){
    res.status(400).send({
      message:"Oops! something went wrong in visit",
      subError : error.message
    })
  }
  

}


