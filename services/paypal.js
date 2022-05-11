var braintree = require("braintree");
var paypal = require('paypal-rest-sdk');


paypal.configure({
    'mode': 'sandbox', //sandbox or live
    'client_id': process.env.PAYPAL_CLIENT_ID,
    'client_secret':process.env.PAYPAL_CLIENT_SECRET
  });
 
  var amount ;
  exports.createPaypalPayment = async(req,res,paymentJson)=>{
    amount = paymentJson.amount;
   var create_payment_json = {
      "intent": "sale",
      "payer": {
          "payment_method": "paypal"
      },
      "redirect_urls": {
          "return_url":process.env.PAYPAL_SUCCESS_URL,
          "cancel_url": process.env.PAYPAL_CANCEL_URL
      },
      "transactions": [{
          "item_list": {
              "items": paymentJson.items
          },
          "amount": paymentJson.amount,
          "description": "This is the payment description."
      }]
  };

  paypal.payment.create(create_payment_json, function (error, payment) {
        if (error) {
          res.status(400).send({
            message:"payment not created",
            subError: error.response
          })
        } else {
          console.log(payment)
            for(let i = 0;i < payment.links.length;i++){
              if(payment.links[i].rel === 'approval_url'){
                // res.redirect(payment.links[i].href);
                res.status(200).send({
                  redirectUrl :payment.links[i].href
                })
              }
            }
        }
      });
    }


    // excute response
    exports.excute = async(req,res)=>{
      
        const payerId = req.query.PayerID;
        const paymentId = req.query.paymentId;
      
        const execute_payment_json = {
          "payer_id": payerId,
          "transactions": [{
              "amount": amount
          }]
        };
      
    paypal.payment.execute(paymentId, execute_payment_json, function (error, payment) {
          if (error) {
              console.log(error.response);
             res.status(400).send({
               message:"payment not excuted",
               subError:error.response
             })
          } else {
              console.log(JSON.stringify(payment));
              res.send({
                message:"Payment Success",
                payment:payment
              });
          }
      });
    }
 