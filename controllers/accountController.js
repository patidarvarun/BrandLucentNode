const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const Account = require("../models/accountModel");
const User = require("../models/userModel");
exports.addAccount = async (req, res, next) => {
  try {
    const body = req.body;
    var newaccount = new Account(body);
    if (!ObjectId.isValid(body.userid)) {
      res.status(400).send({
        message: "user id not valid",
      });
    }
    if (Object.keys(body).length === 0 && body.constructor === Object) {
      res.status(400).send({ message: "body will not empty" });
    } else {
      User.findById(body.userid).then((userinfo) => {
        if (!userinfo) {
          res.status(400).send({
            message: "user not found",
          });
        } else {
          Account.find({ userid: userinfo._id })
            .then((accountExist) => {
              if (accountExist.length === 0) {
                newaccount
                  .save()
                  .then((accountInfo) => {
                    if (accountInfo === null) {
                      res.status(400).send({
                        message: "account information not added",
                        accountInfo: accountInfo,
                      });
                    } else {
                      res.status(200).send({
                        message: "account information added",
                        accountInfo: accountInfo,
                      });
                    }
                  })
                  .catch((error) => {
                    res.status(400).send({
                      message: "account not added",
                      subError: error.message,
                    });
                  });
              } else {
                console.log("if block");
                Account.findOne()
                  .then((data) => {
                    var locationId = data._id;
                    var newupdatedaccount = {
                      userid: body.userid,
                      fullName: body.fullName,
                      email: body.email,
                      phone: body.phone,
                      location: body.location,
                    };
                    Account.findByIdAndUpdate(
                      { _id: locationId },
                      newupdatedaccount,
                      { new: true }
                    )
                      .then((accountInfo) => {
                        if (accountInfo === null) {
                          res.status(400).send({
                            message: "account information not added",
                            accountInfo: accountInfo,
                          });
                        } else {
                          res.status(200).send({
                            message: "account information added",
                            accountInfo: accountInfo,
                          });
                        }
                      })
                      .catch((err) => {
                        res
                          .status(400)
                          .send({ message: "account not added dfsdfs" });
                      });
                  })
                  .catch((err) => {
                    res.status(400).send({ message: err.message });
                  });
                //   res.status(200).send({
                //      message:"account will not be added already exist !"
                //   })
              }
            })
            .catch((error) => {
              res.status(400).send({
                message: "account not found",
                subError: error.message,
              });
            });
        }
      });
    }
  } catch (error) {
    res.status(400).send({
      message: "Oops! something went wrong on add account",
      subError: error.message,
    });
  }
};

exports.getAccountInfo = async (req, res) => {
  try {
    const userid = req.query.userid;
    if (!userid) {
      res.status(400).send({
        message: "user id is required !",
      });
    } else {
      Account.find({ userid: userid }).then((accountInfo) => {
        if (!accountInfo) {
          res.status(400).send({
            message: "account not found !",
          });
        } else {
          res.status(200).send({
            message: "account Infomartion",
            accountInfo: accountInfo,
          });
        }
      });
    }
  } catch (error) {
    res.status(400).send({
      message: "Oops ! something went wrong in get account info",
      subError: error.message,
    });
  }
};
exports.changeLocation = async (req, res) => {
  try {
    const body = req.body;
    var updateData = {
      location: body.newLocation,
    };
    if (!ObjectId.isValid(body.accountid)) {
      res.status(400).send({
        message: "account id not valid",
      });
    }

    if (Object.keys(body).length === 0 && body.constructor === Object) {
      res.status(400).send({ message: "body will not empty" });
    } else {
      Account.findByIdAndUpdate(
        { _id: body.accountid },
        updateData,
        { new: true },
        (error, changes) => {
          if (error) {
            res.status(400).send({
              message: "location is not changed !",
            });
          } else {
            res.status(200).send({
              message: "location updated ",
              accountInfo: changes,
            });
          }
        }
      );
    }
  } catch (error) {
    res.status(400).send({
      message: "Oops! something went wrong",
      subError: error.message,
    });
  }
};
