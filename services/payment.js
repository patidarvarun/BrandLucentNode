const stripe = require('stripe')(process.env.PAYMENT_SECRET_KEY)

// get the token
exports.getPaymentToken = async (card) => {
    try {
        var tokendata;
        await stripe.tokens.create({
            card: {
                number: card.cardNumber,
                exp_month: card.expMonth,
                exp_year: card.expYear,
                cvc: card.cvc,
            },
        }).then(card => {
            tokendata = card

        }).catch(error => {
            tokendata = error.message
        });
    } catch (error) {
        tokendata = error.message
    }

    return tokendata
}


// create payment method object
exports.createPaymentMethod = async (card) => {
    try {

        var paymentMethodData;
        await stripe.paymentMethods.create({
            type: card.methodType,
            card: {
                number: card.cardNumber,
                exp_month: card.expMonth,
                exp_year: card.expYear,
                cvc: card.cvc,
            },
        }).then(paymentMethod => {
            console.log("payment method created ")
            paymentMethodData = paymentMethod
        }).catch(error => {
            paymentMethodData = error.message
        });
    } catch (error) {
        paymentMethodData = error.message
    }
    return paymentMethodData;
}
// create customer 
exports.createCustomer = async (customer, address) => {

    try {
        var customerData;
        await stripe.customers.create({
            email: customer.email,
            source: customer.stripeToken,
            name: customer.name,
            payment_method: customer.paymentMethod, // payment method id
            address: {
                line1: address.line1,
                postal_code: address.postalCode,
                city: address.city,
                state: address.state,
                country: address.country,
            }
        }).then(customer => {
            console.log("customer created ")
            customerData = customer
        }).catch(error => {
            customerData = error.message
        })
    } catch (error) {
        customerData = error.message
    }
    return customerData;
}

// connect customer with card
exports.connectCardWithCustomer = async (customerid) => {
    try {
        var sourceData;
        await stripe.customers.createSource(
            customerid, { source: 'tok_visa' }
        ).then(source => {
            console.log("card connected with customer !")
            sourceData = source
        }).catch(error => {
            sourceData = error.message
        });
    } catch (error) {
        sourceData = error.message
    }

    return sourceData;
}


// make payment
exports.makepayment = async (paymentIntents, shipping) => {
    try {
        var paymentData;
        await stripe.paymentIntents.create({
            customer: paymentIntents.customer, // customer id
            payment_method: paymentIntents.paymentMethod, //payment method id 
            amount: paymentIntents.amount,
            currency: paymentIntents.currency,
            description: 'Software development services',
            confirm: true,

            shipping: {
                name: shipping.name,
                address: {
                    line1: shipping.line1,
                    postal_code: shipping.postalCode,
                    city: shipping.city,
                    state: shipping.state,
                    country: shipping.country,
                },
            }

        }).then(makePayment => {
            paymentData = makePayment
        }).catch(error => {
            paymentData = error.message
        })

    } catch (error) {
        paymentData = error.message
    }
    return paymentData;
}





// create product
exports.createProduct = async (productInfo) => {
    var productData = {};
    try {
        await stripe.products.create({
            name: productInfo.productName,
            description: productInfo.description,
            metadata: productInfo.metadata,
        }).then(product => {
            console.log("create product")
            productData = product
        }).catch(error => {
            productData = error.message
        });
    } catch (error) {
        productData = {
            message: "Oops! something went wrong in create product service",
            subError: error.message
        }
    }
    return productData
}

// create price for product 
exports.price = async (productData) => {
    var priceData;
    try {
        await stripe.prices.create({
            unit_amount: productData.amount,
            currency: productData.currency,
            // recurring: { interval: 'month' },
            product: productData.productid,
        }).then(price => {
            console.log("price object created")
            priceData = price
        }).catch(error => {
            priceData = error.message
        });
    } catch (error) {
        priceData = {
            message: "Oops! something went wrong in create price service ",
            subError: error.message
        };
    }
    return priceData;
}

// get the payment link
exports.getPaymentLink = async (items) => {
    console.log(items)
    try {
        var paymentLinkData;
        await stripe.paymentLinks.create({
            line_items: items,
        }).then(paymentLink => {
            console.log("payment link generated", paymentLink)
            paymentLinkData = paymentLink;
        }).catch(error => {
            paymentLinkData = error.message
        });
    } catch (error) {
        paymentLinkData = {
            message: "Oops! something went wrong in create payment link service",
            subError: error.message
        };
    }

    return paymentLinkData
}


// checkout session
exports.checkout = async(items)=>{
    try {
        var paymentLinkData;
        await stripe.checkout.sessions.create({
            success_url: process.env.STRIPE_SUCCESS_URL,
            cancel_url: process.env.STRIPE_CANCEL_URL,
            line_items: items,
            mode: 'payment'
        }).then(paymentLink => {
              paymentLinkData = paymentLink;
        }).catch(error => {
            paymentLinkData = error.message
        });
    } catch (error) {
        paymentLinkData = {
            message: "Oops! something went wrong in create payment link service",
            subError: error.message
        };
    }

    return paymentLinkData
}







exports.createInvoice = async(invoiceinfo)=>{
//  stripe.invoiceItems.create({
//         customer: 'cus_Lc5a1qaiFJL4Bt',
//         price: 'price_1KurNbSDwDWOncKEGV8ePnU1',
//       }).then(invoiceitem=>{
//           console.log("invoice item",invoiceitem)
//       });

  var  invoiceData ;
 stripe.invoices.create({
    customer: 'cus_Lc5a1qaiFJL4Bt'
  }).then(invoice =>{
    //   stripe.invoices.finalizeInvoice(invoice.id).then(finalinvoice=>{
    //       console.log("final invoice",finalinvoice);
    //   });
        invoiceData=invoice
        console.log("invoice data",invoiceData);

      }).catch(error=>{
        invoiceData =error.message
      });

      return invoiceData;
}




// charge the customer 
exports.createCharges = async (paymentIntents) => {
    try {
        var chargeData;
        await stripe.charges.create({
            amount: paymentIntents.amount,
            currency: paymentIntents.currency,
            customer: paymentIntents.customer,
            description: 'Payment Done',
        }).then(charge => {
            console.log("payment done!")
            chargeData = charge
        }).catch(error => {
            chargeData = error.message
        });
    } catch (error) {
        chargeData = error.message
    }
    return chargeData;
}

