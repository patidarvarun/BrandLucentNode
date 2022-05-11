const express = require("express");
const router = express.Router();
const isverify = require("../middleware/checkAuth");
const { generateToken, makepayment, paypalPayment, excuteResponse, generatePaymentLink, generateInvoice } = require("../controllers/paymentController");

//strip payment getway 
router.route("/generatePaymentToken").post(isverify,generateToken)
router.route("/stripePayment").post(isverify,makepayment)
router.route("/generatePaymentLink").post(isverify,generatePaymentLink)
router.route("/generateInvoice").post(generateInvoice)

router.route("/stripeSucess").get((req,res)=>{
    res.status(200).send("payment done !")
})
router.route("/stripeCancel").get((req,res)=>{
    res.status(200).send("payment cancel !")
})


// paypal routes
router.route("/paypalPayment").post(isverify, paypalPayment)
router.route("/palpaySuccess").get(excuteResponse)
router.route("/palpayCancel").get((req,res)=>{
    res.status(200).send({
        message:"Payment Cancelled"
    })
})

module.exports = router