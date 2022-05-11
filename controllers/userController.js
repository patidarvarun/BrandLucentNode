const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

exports.CreateUser = (req, res) => {
  const body = req.body;
  if (Object.keys(body).length === 0 && body.constructor === Object) {
    res.status(400).send({ message: "Data Not Proper Formated..." });
  }
  const newUser = new User(body);
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(newUser.password, salt);
  newUser.password = hash;
  User.find({ email: req.body.email }).then((data) => {
    if (!data.length <= 0) {
      res.status(400).send({
        message: "please Insert Unique Data",
      });
    } else {
      newUser
        .save()
        .then((result) => {
          res.status(200).send(result);
        })
        .catch((err) => {
          res.status(400).send({
            message: "please Insert Unique Data",
            SubError: err.message,
          });
        });
    }
  });
};

//update the user ( by user itself)
exports.updateUser = (req, res) => {
  const body = req.body;
  const updateUserData = {
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    status: req.body.status,
  };
  if (Object.keys(body).length === 0 && body.constructor === Object) {
    res.status(400).send({ message: "Data Not Proper Formated..." });
  }

  if (!ObjectId.isValid(body._id) && !ObjectId(body._id)) {
    res.status(400).send({ message: "user id not valid" });
  } else {
    User.findOne({ _id: body._id }).then((userFound) => {
        if (!userFound) {
          res.status(200).send({
            message: "user not found",
            subError: "user id is not there in records",
          });
        } else {
          try {
            User.findByIdAndUpdate({ _id: body._id },updateUserData,{ new: true },(error, updatedUser) => {
                if (error) {
                  res.status(404).json({
                    message: "user not updated",
                    subError: error,
                  });
                } else {
                  res.status(200).json({
                    message: "User Updated successfully",
                    userInfo: updatedUser,
                  });
                }
              }
            );
          } catch (error) {
            res.status.send({
              message: "Opps ! something wrong",
              SubError: error,
            });
          }
        }
      })
      .catch((error) => {
        res.status(400).send({
          message: "Oop ! something went wrong in user update",
          subError: error.message,
        });
      });
  }
};

//  Get the List of Users
exports.getAllUser = (req, res) => {
  User.find()
    .select("-password")
    .then((listOfuser) => {
      res.status(200).send({
        message: "users Data",
        users: listOfuser,
      });
    })
    .catch((error) => {
      res.status(400).send({
        message: "Opps ! something wrong",
        subError: error,
      });
    });
};

// delete the Users
exports.deleteUser = (req, res) => {
  const userId = req.query.userid;
  if (!ObjectId.isValid(userId) && !ObjectId(userId)) {
    res.status(400).send({ message: "user id not valid" });
  } else {
    User.findOne({ _id: userId })
      .then((userFound) => {
        if (!userFound) {
          res.status(200).send({
            message: "user not found",
            subError: "user id is not there in records",
          });
        } else {
          try {
            User.findByIdAndDelete(userId, (error, deleteddUser) => {
              if (error) {
                res.status(404).json({
                  message: "user not deleted",
                  subError: error,
                });
              } else {
                res.status(200).json({
                  message: "User deleted successfully",
                  userInfo: deleteddUser,
                });
              }
            });
          } catch (error) {
            res.status.send({
              message: "user not found",
              SubError: error,
            });
          }
        }
      })
      .catch((error) => {
        res.status(400).send({
          message: "Oop ! something went wrong in user delete",
          subError: error.message,
        });
      });
  }
};

// get porfile
exports.getUserById = (req, res) => {
  try {
    const userId = req.query.userid;
    if (!ObjectId.isValid(userId) && !ObjectId(userId)) {
      res.status(400).send({ message: "user id not valid" });
    }
    User.findById(userId)
      .select("-password")
      .then((user) => {
        if (!user) {
          res.status(400).send({
            message: "user not found !",
          });
        } else {
          res.status(200).send({
            message: "users Data",
            user: user,
          });
        }
      })
      .catch((error) => {
        res.status(400).send({
          message: "Opps ! something wrong",
          subError: error,
        });
      });
  } catch (error) {
    res.status(400).send({
      message: "Oops ! something went wrong in get the users",
      subError: error.message,
    });
  }
};

exports.working = (req, res) => {
  res.send("working");
};
