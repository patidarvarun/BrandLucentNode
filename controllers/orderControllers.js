const Order = require("../models/ordersModel");
const Product = require("../models/productModel");
const User = require("../models/userModel");

exports.saveOrder = async (req, res) => {
  const quanty = [];

  const datas = await User.find({ _id: req.body.userId });
  const product = await Product.find({ _id: req.body.productId });
  const quantity = await Product.find({ _id: req.body.productId }).then(
    (data) => {
      if (data.length) {
        quanty.push(data[0].quantity);
      }
      if (data.length && data[0].quantity < req.body.quantity) {
        res.status(400).send({ message: "Quantity is not available" });
      } else if (datas.length === 0) {
        res.status(400).send({ message: "userId was not found" });
      } else if (product.length === 0) {
        res.status(400).send({ message: "product was not found" });
      } else {
        const orderSave = new Order({
          productId: req.body.productId,
          userId: req.body.userId,
          quantity: req.body.quantity,
        });
        orderSave
          .save()
          .then((response) => {
            res.status(200).send(response);
            const quant = parseInt(quanty[0] - req.body.quantity);

            Product.findByIdAndUpdate(
              req.body.productId,
              {
                quantity: quant,
              },
              { new: true },
              (err, productupdatedData) => {
                if (err) {
                  console.log(err);
                } else {
                }
              }
            );
          })
          .catch((err) => {
            res.status(400).send({ message: err.message });
          });
      }
    }
  );
};

exports.getUserOrder = async (req, res) => {
  const status = req.query.status;
  if (!status && req.params.id) {
    const orders = await Order.find({ userId: req.params.id })
      .select("-userId")
      .populate([{ path: "productId" }])

      // .populate([{ path: "userId" }])

      .sort({ created_at: -1 })

      .then((result) => {
        if (result.length <= 0) {
          res.status(200).json({
            message: "we can't find orders from this user",
          });
        } else {
          res.status(200).send(result);
        }
      })
      .catch((err) => {
        res.status(400).send({ message: err.message });
      });
  } else if (status === "accept") {
    const orders = await Order.find({ status: status })
      .select("-userId")
      .populate([{ path: "productId" }])

      // .populate([{ path: "userId" }])

      .sort({ created_at: -1 })

      .then((result) => {
        if (result.length <= 0) {
          res.status(200).json({
            message: "There is no accepted orders",
          });
        } else {
          res.status(200).send(result);
        }
      })
      .catch((err) => {
        res.status(400).send({ message: err.message });
      });
  } else if (status === "close") {
    const orders = await Order.find({ status: status })
      .select("-userId")
      .populate([{ path: "productId" }])

      // .populate([{ path: "userId" }])

      .sort({ created_at: -1 })

      .then((result) => {
        if (result.length <= 0) {
          res.status(200).json({
            message: "There is no closed orders",
          });
        } else {
          res.status(200).send(result);
        }
      })
      .catch((err) => {
        res.status(400).send({ message: err.message });
      });
    //  block of code to be executed if the condition1 is false and condition2 is false
  } else {
    const orders = await Order.find()
      .populate([{ path: "productId" }])

      .sort({ created_at: -1 })

      .then((result) => {
        if (result.length <= 0) {
          res.status(200).json({
            message: "we don't have any orders",
          });
        } else {
          res.status(200).send(result);
        }
      })
      .catch((err) => {
        res.status(400).send({ message: err.message });
      });
  }
};

// exports.getAllOrders = async (req, res) => {
//   const orders = await Order.find()
//     .populate([{ path: "productId" }])

//     .sort({ created_at: -1 })

//     .then((result) => {
//       res.status(200).send(result);
//     })
//     .catch((err) => {
//       res.status(400).send({ message: err.message });
//     });
// };

exports.Update_Order_Status = (req, res) => {
  if (req.params.id) {
    Order.findByIdAndUpdate(
      req.params.id,
      {
        status: req.body.status,
      },
      { new: true },
      (err, orderStatusData) => {
        if (err) {
          res.status(404).json({
            message: "please enter correct order id ",
            subErr: err.message,
          });
        } else {
          res.status(200).json({
            updated_user: "Order status Update successfully",
            orderStatusUpdated: orderStatusData,
          });
        }
      }
    );
  } else {
    res.status(200).json({
      updated_user: "order id is required to update status",
      orderStatusUpdated: orderStatusData,
    });
  }
};

exports.getBestSelling = async (req, res) => {
  try {
    var f = [];
    await Order.find()
      .select({ productId: 1, _id: 0 })
      .populate({ path: "productId", select: { _id: 0, cat_id: 0 } })
      .sort({ productId: -1 })
      .limit(5)
      .then((bestSelling) => {
        if (bestSelling.length === 0) {
          res.status(200).send({
            message: "No product in best selling",
          });
        } else {
          for (var i = 0; i < bestSelling.length; i++) {
            if (!f.includes(bestSelling[i].productId)) {
              f.push(bestSelling[i].productId);
            }
          }
          res.status(200).send({
            message: "best selling product data",
            bestSelling: f,
          });
        }
      })
      .catch((error) => {
        res.status(400).send({
          message: "best selling order not found",
          subError: error.message,
        });
      });
  } catch (error) {
    res.status(400).send({
      message: "Oops ! something went wrong in best selling",
      subError: error.message,
    });
  }
};
exports.getpopularProduct = async (req, res) => {
  try {
    var productId = [];
    var visitNumber = [];
    await Order.find()
      .populate({ path: "productId" })
      .select({ _id: 0, userId: 0 })
      .then((popularProduct) => {
        if (popularProduct.length === 0) {
          res.status(200).send({
            message: "No product in best selling",
          });
        } else {
          for (var i = 0; i < popularProduct.length; i++) {
            productId.push(popularProduct[i].productId._id);
            if (
              !visitNumber.includes(
                popularProduct[i].productId.visitedNumberOfTime
              )
            ) {
              visitNumber.push(popularProduct[i].productId.visitedNumberOfTime);
            }
          }
          var map = productId.reduce(function (p, c) {
            p[c] = (p[c] || 0) + 1;
            return p;
          }, {});

          var newTypesArray = Object.keys(map).sort(function (a, b) {
            return map[b] - map[a];
          });

          popularproduct(newTypesArray)
            .then((pop) => {
              res.status(200).send({
                message: "best selling product data",
                popularProduct: pop,
              });
            })
            .catch((error) => {
              res.status(400).send({
                message: "best selling product data",
                subError: error.message,
              });
            });
        }
      })
      .catch((error) => {
        res.status(400).send({
          message: "best selling order not found",
          subError: error.message,
        });
      });
  } catch (error) {
    res.status(400).send({
      message: "Oops ! something went wrong in best selling",
      subError: error.message,
    });
  }
};

async function popularproduct(productids) {
  // count occurances
  try {
    var a = [];
    if (productids.length < 0) {
      return {
        message: "popular product not found!",
      };
    } else {
      for (var i = 0; i < productids.length; i++) {
        await Product.findById(productids[i])
          .then((popularProduct) => {
            a.push(popularProduct);
          })
          .catch((error) => {
            return {
              message: error.message,
            };
          });
      }
    }
  } catch (error) {
    return {
      message: error.message,
    };
  }
  return a;
}
