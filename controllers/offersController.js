const ProductOffer = require("../models/offerModel");
const product = require("../models/productModel");

exports.product_offer_create = async (req, res) => {
  //   if (Object.keys(body).length === 0 && body.constructor === Object) {
  //     res.status(400).send({ message: "data not proper formated..." });
  //   }
  // console.log("body = ", body)
  console.log(req.file);
  let imagePath = "";
  if (req.file) {
    imagePath = req.file.path;
  }
  const productOffer = new ProductOffer({
    discountPrice: req.body.discountPrice,
    cat_id: req.body.cat_id,
    productId: req.body.productId,
  });
  await productOffer
    .save()
    .then((response) => {
      const data = response;
      res.status(200).json({
        data: data,
      });
      // product.findByIdAndUpdate({ id: req.body.productId })
      if (response) {
        product
          .findOneAndUpdate(
            { _id: req.body.productId },
            {
              offerId: data._id,
            }
          )
          .then((result) => {
            console.log("updated");
          })
          .catch((err) => {
            console, log(err, "not updated");
          });
      } else {
        console.log("something went wrong");
      }
    })
    .catch((err) => {
      res.status(400).send({ message: err.message });
    });
};
exports.Get_offers_Product = async (req, res) => {
  await ProductOffer.find()
    .populate([{ path: "cat_id" }])
    .populate([{ path: "productId" }])

    .sort({ created_at: -1 })

    .then((response) => {
      res.status(200).send(response);
    })
    .catch((err) => {
      res.status(400).send({ message: err.message });
    });
};

exports.Update_Product_offer = (req, res) => {
  ProductOffer.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true },
    (err, offerupdatedData) => {
      if (err) {
        res.status(404).json({
          message: "please enter correct productoffer id ",
          subErr: err.message,
        });
      } else {
        res.status(200).json({
          updated_user: "Product offer Updated successfully",
          offerupdatedData: offerupdatedData,
        });
      }
    }
  );
};

exports.Delete_product_offer = async (req, res) => {
  let ProductOffers = await ProductOffer.findById(req.params.id);
  if (!ProductOffers) {
    return res.status(500).json({
      success: false,
      message: "Product was not found",
    });
  }
  try {
    await ProductOffers.remove();
    res.status(201).json({
      success: true,
      message: "product offer deleted",
    });
  } catch (err) {
    res.json({ error: err.message || err.toString() });
  }
};
