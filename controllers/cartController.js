
const Cart = require("../models/cartModel");
const User = require("../models/userModel");
const Product = require("../models/productModel")
const mongoose = require("mongoose");
const user = require("../models/userModel");
const product = require("../models/productModel");
const ObjectId = mongoose.Types.ObjectId
exports.addToCart = async (req,res)=>{
    try{
        const body = req.body;
        var cartdata = {
            user : body.user,
           
            cart : [
                {
                product:body.product,
                quantity: body.quantity
            }
            ]
        }
         if(Object.keys(body).length === 0 && body.constructor === Object) {
             res.status(400).send({
                 message:"body required with key"
             })
         }
        if(!ObjectId.isValid(body.product) && !ObjectId(body.product)){
                res.status(400).send({
                    message:"product id is not valid"
                })
          }
          if(!ObjectId.isValid(body.user) && !ObjectId(body.user)){
            res.status(400).send({
                message:"user id is not valid"
            })
      }
              
      await chekcCard(body.user).then(existCard=>{
                    if(!existCard.status){
                        addproductNoExistCard(cartdata).then(cartdata=>{
                            res.status(200).send(cartdata)
                        })
                    }else{
                        addproductWithExistCard(existCard.cardid,body.product,body.quantity).then(cartdata=>{
                        
                            res.status(200).send(cartdata)
                        })
                    }
                }).catch(error=>{
                    
                })

   
    }catch(error){
        res.status(400).send({
            message:"Opps! something went wrong in add to cart",
            subError :error.message
        })
    }
}

exports.getProductFromCart = async(req,res)=>{
    try{
        const userid =  req.query.userid;
        var productOfCart = [];
        if(!ObjectId.isValid(userid) && !ObjectId(userid)){
            res.status(400).send({
                message:"product id is not valid"
            })
      }
        if(!userid){
            res.status(400).send({
                message:"userid is required !"
            })
        }else{
            User.findById(userid).then(userinfo=>{
                if(!userinfo){
                    res.status(400).send({
                        message:"user not found"
                    })
                }else{
                    Cart.find({user:userid}).populate({path:"cart.product"}).then(cartInfo=>{
                       
                         if(cartInfo.length === 0){
                            res.status(200).send({
                                message:"No product in your cart"
                            })
                        }else{
                        //    for(var i=0 ; i<cartInfo[0].cart.length ; i++){
                        //         if(cartInfo[0].cart[i].product !=  null){
                        //             productOfCart.push(cartInfo[0].cart[i].product)
                        //         }
                               
                        //     }
                        //     res.status(200).send({
                        //         message:" your cart porduct",
                        //         cartId:cartInfo[0]._id,
                        //         productOfCart :productOfCart
                        //     })
                        res.status(200).send({
                            message:" your cart porduct",
                            productOfCart :cartInfo
                        })   
                        }
                    }).catch(error=>{
                        res.status(400).send({
                            message:"no cart data ",
                            subError:error.message
                        })
                    })
                }
            })
        }
    }catch(error){
        res.status(400).send({
            message:"Oops!something went wrong in get product from cart",
            subError:error.message
        })
    }
}

exports.removeProductFromCart = async(req,res)=>{
    try{
             const body = req.body;
             if(Object.keys(body).length === 0 && body.constructor === Object) {
                res.status(400).send({
                    message:"body required with key"
                })
            }
           if(!ObjectId.isValid(body.cartid) && !ObjectId(body.product)){
                   res.status(400).send({
                       message:"product id is not valid"
                   })
             }
             if(!ObjectId.isValid(body.product) && !ObjectId(body.user)){
               res.status(400).send({
                   message:"user id is not valid"
               })
         }
         Cart.findByIdAndUpdate(body.cartid,{$pull:{[`cart`]:{product :body.product}}},{new: true},(error,result)=>{
             if(error){
                 res.status(400).send({
                     message:"product not removed",
                     subError:error.message
                 })
             }else{
                 if(result === null){
                    res.status(400).send({
                        message:"cart not found",
                        subError:error.message
                    })
                 }
                res.status(200).send({
                    message:"product removed",
                    data:result
                }) 
             }
         }).populate({path:"cart.product"});
  
    }catch(error){
        res.status(400).send({
            message:"Oops! something went wrong when removing the product from the cart",
            subError:error.message
        })
    }
}

exports.youMayLike = async(req,res)=>{
    try{
        const categoryId= req.query.categoryId
      
        if(!ObjectId.isValid(categoryId) && !ObjectId(categoryId)){
            res.status(400).send({
                message:"product id is not valid"
            })
        }
        if(!categoryId){
            res.status(400).send({
                message:"category id is required"
            })
        }else{
            await Product.find({cat_id:categoryId}).populate('cat_id').then(products=>{
                if(products.length === 0){
                    res.status(200).send({
                        message:"releted product not found!"
                    })
                }else{                          
                    res.status(200).send({
                        message:" you may like product",
                        products:products
                    })
                }
            }).catch(error=>{
                res.status(400).send({
                    message:"releted product not found!",
                    subError:error.message
                })
            })
        }

    }catch(error){
        res.status(400).send({
            message:"Oops!something went wrong in you may like section api",
            subError:error.message
        })
    }
}

exports.getDetailsOfProduct = async(req,res)=>{
    try{
        const productId = req.query.productid
        if(!ObjectId.isValid(productId) && !ObjectId(productId)){
            res.status(400).send({
                message:"product id is not valid"
            })
        }
        if(!productId){
            res.status(400).send({
                message:"product id required"
            })
        }else{
           await product.findById(productId).populate('cat_id').then(product=>{
                if(!product){
                    res.status(400).send({
                        message:"product not found with this id"
                    })
                }else{
                    res.status(200).send({ 
                        message:"product details",
                        product:product
                    })
                }
            }).catch(error=>{
                res.status(400).send({
                    message:"product not found",
                    subError:error.message
                })
            })
        }
    }catch(error){
        res.status(400).send({
            message:"Oops! something went wrong",
            subError:error.message
        })
    }
}







//helper function
async function chekcCard(userid){
    var isCardExist ;
   await Cart.find({user:userid}).then(alreadyCart =>{
           if(alreadyCart.length === 0){
            isCardExist = {
                status:false

            }
           }else{
               isCardExist = {
                status:true,
                cardid:alreadyCart[0]._id
            }
           }
    }).catch(error=>{
        isCardExist = {
            status:false
        }
    })
 
    return isCardExist

}

async function addproductWithExistCard(cartId , productId,quantity){
    var addedProduct ;
    try{
       Cart.updateOne({_id : cartId},{$push:{[`cart`]:{product :productId,quantity:quantity}}},{new: true}).catch(error=>{
           if(!error){
            addedProduct={
                message:"product not added in cart",
                subError : error
            }
           }
       })
 await Cart.findById(cartId).select({_id:0,user:0,'cart._id':0}).populate({path:"cart.product"}).then(productsInCart=>{
       addedProduct={
         message:"product added in cart",
         productsInCart : productsInCart
     }
    }).catch(error=>{
     addedProduct={
         message:"product not added in cart",
         subError : error.message
     }
    })


    }catch(error){
        return{
            message:"product not added in cart",
            subError : error.message
        }
    }
    return addedProduct
     
}
async function addproductNoExistCard(cartdata){
   try{
    var addedProduct ;
    const cart = new Cart(cartdata);
    await cart.save().then(productsInCart =>{
                        if(!productsInCart){
                            addedProduct={
                                    message:"product not added in cart",
                                    subError : error.message
                                }
                        }else{
                            addedProduct={
                                message:"product added in cart",
                                productsInCart : productsInCart
                            }
                        }
                }).catch(error=>{
                    addedProduct={
                        message:"product not added in cart",
                        subError : error.message
                    }
                })
   }catch(error){
    addedProduct={
        message:"product not added in cart",
        subError : error.message
    }
   }

   return addedProduct
}