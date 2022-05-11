const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId
const {getPaymentToken, createCustomer, createPaymentMethod, makepayment, createCharges, connectCardWithCustomer, createProduct, price, getPaymentLink, checkout, createInvoice} = require("../services/payment");
const { createPaypalPayment, excute } = require("../services/paypal");

// stripe
exports.generateToken = async(req,res)=>{
    try{
        var keys = ['cardNumber','expMonth','expYear','cvc']
         const body  = req.body;
         if (Object.keys(body).length === 0 && body.constructor === Object ) {
            res.status(400).send({ message: "body will not empty" });
          } else{
            for(var key=0 ; key < keys.length ; key++){
                if(!Object.keys(body).includes(keys[key])){
                    res.status(400).send({
                        message: `${ keys[key]} key is required !` 
                    })
                }
            }
          }
          if(Object.keys(body).length === keys.length){
            getPaymentToken(body).then(stripToken=>{
                res.status(200).send({
                     message:"strip token generated",
                     stripToken:stripToken.id,
                     card : stripToken.card
                 })
             }).catch(error=>{
                 res.status(400).send({
                     message:"token not generated !",
                     subError:error.message
                 })
             })
          }
          
         
      
    }catch(error){
        res.status(400).send({
            message:"Oops! something went wrong in generate token",
            subError : error.message
        })
    }
}

// stripe
exports.makepayment = async(req,res)=>{
    try{
        const body = req.body;
        var card = req.body.card;
        var shipping =  req.body.shipping;
        var paymentIntents = req.body.paymentIntents;
        var cardData ={};
        var shippingOrAddress = {};
        var paymentIntentsData = {};
        var customerData = {
            email:req.body.email,
            stripToken:req.body.stripToken,
            name:req.body.name
        } ;
  
        for (var key in card) {
            cardData[key] = card[key]
        }
        for(var key in shipping ){
            shippingOrAddress[key]=shipping[key]
        }
        for(var key in paymentIntents){
            paymentIntentsData[key]=paymentIntents[key]
        }
        if (Object.keys(body).length === 0 && body.constructor === Object ) {
            res.status(400).send({ message: "body will not empty" });
        }
       //1
          createPaymentMethod(cardData).then(paymentMethodObject =>{
            customerData['paymentMethod']= paymentMethodObject.id;
            paymentIntentsData['paymentMethod']=paymentMethodObject.id;
         
        }).then(()=>{
            createCustomer(customerData, shippingOrAddress).then(customer=>{
                paymentIntentsData['customer']= customer.id
                shippingOrAddress['name'] = req.body.name
              }).then(()=>{
                connectCardWithCustomer(paymentIntentsData.customer).then(cardConnect=>{
                    paymentIntentsData['cardid'] = cardConnect.id
                   
                }).then(()=>{
                    makepayment(paymentIntentsData,shippingOrAddress).then(payment=>{
                        paymentIntentsData['customer'] = paymentIntentsData.customer
                        res.status(200).send({
                            message:"payment done!",
                            payment:payment
                        })
                      }).catch(error=>{
                          res.status(400).send({
                              message:"payment not done",
                              subError:error.message
                          })
                      })
                })
              })
        }).catch(error=>{
            res.status(400).send({
                message:"payment method not created !",
                subError:error.message
            })
        })
      

      

    }catch(error){
        res.status(400).send({
            message:"Oops! something went wrong in make payment !",
            subError:error.message
        })
    }
}

exports.generatePaymentLink = async(req, res)=>{
    try{
        var items = [];
        var productData = {
            productName:req.body.product,
            description:req.body.description,
            metadata:req.body.metadata,
            amount : req.body.amount,
            currency : req.body.currency
        }
        
       createProduct(productData).then(product=>{
            productData['productid'] = product.id;
            price(productData).then(price=>{
                items.push({
                    price: price.id,
                    quantity: req.body.quantity,
                })
                checkout(items).then(paymentLink=>{
                    res.status(200).send(paymentLink)
                }).catch(error=>{
                    res.status(400).send({
                        message:"oops something went wrong in get paymentlink",
                        subError:error.message
                    })
                })
            }).catch(error=>{
                res.status(400).send({
                    message:"oops something went wrong in create price for product",
                    subError:error.message
                })
            })
        }).catch(error=>{
            res.status(400).send({
                message:"Oops! something went wrong create product",
                subError : error.message
            })
        })
    }catch(error){
        res.status(400).send({
            message:"Oops! something went wrong in generate payment link",
            subError:error.message
        })
    }
}


// generate invoice
exports.generateInvoice = async(req, res)=>{
    try{

        var productData = {
            amount : req.body.amount,
            currency : req.body.currency
        }
        var invoiceData = {
            custmerid : "cus_Lb5AkVHLP9ytOd",
            // priceid: 'price_1KtsyQSDwDWOncKE5pE6UeFq'
        }

        createInvoice(invoiceData).then(invoice=>{
                        res.status(200).send(invoice);
                }).catch(error=>{
                    res.status(400).send({
                        message:"invoice not generated",
                        subError:error.message
                    })
                })


    //    createProduct(req.body.product).then(product=>{
    //         productData['productid'] = product.id;
    //         price(productData).then(price=>{
    //             invoiceData['priceid'] = price.id
    //             createInvoice(invoiceData).then(invoice=>{
    //                     res.status(200).send(invoice);
    //             }).catch(error=>{
    //                 res.status(400).send({
    //                     message:"invoice not generated",
    //                     subError:error.message
    //                 })
    //             })
    //         }).catch(error=>{
    //             res.status(400).send({
    //                 message:"oops something went wrong in create price for product",
    //                 subError:error.message
    //             })
    //         })
    //     }).catch(error=>{
    //         res.status(400).send({
    //             message:"Oops! something went wrong create product",
    //             subError : error.message
    //         })
    //     })
    }catch(error){
        res.status(400).send({
            message:"Oops! something went wrong in generate invoice",
            subError:error.message
        })
    }
}






// paypal payment getway

exports.paypalPayment = async(req,res)=>{
    try{
          var paymentJson = {
              items : req.body.items,
              amount : req.body.amount
          }
         
        createPaypalPayment(res,res,paymentJson);
    }catch(error){
        res.status(400).send({
            message:"Oops! something went wrong in paypal make payment",
            subError:error.message
        })
    }
}

//Excute
exports.excuteResponse = async(req,res)=>{
    try{
        excute(req,res);
    }catch(error){
        res.status(400).send({
            message:"Oops! something went wrong in when excute the payment",
            subError:error.message
        })
    }
}