const User = require("../models/userModel");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const _ = require("lodash");
const jwt = require("jsonwebtoken");

exports.login = (req, res, next) => {
  User.find({ email: req.body.email })
    .exec()
    .then((user) => {
      if (user.length < 1) {
        return res.status(400).json({
          message: "user name not found",
        });
      }

      bcrypt.compare(req.body.password, user[0].password, (err, result) => {
        if (!result) {
          return res.status(400).json({
            message: "password is incorrect",
          });
        }
        if (result) {
          const token = jwt.sign(
            {
              email: user[0].email,
              _id: user[0]._id,
            },
            process.env.LOGINKEY,
            {
              expiresIn: "1h",
            }
          );

          res.status(200).json({
            _id: user[0]._id,
            name: user[0].name,
            role: user[0].role,
            email: user[0].email,
            status: user[0].status,
            token: token,
          });
        }
      });
    })
    .catch((err) => {
      res.status(400).json({
        message: err,
      });
    });
};

exports.sendMailToResetPassword = (req, res) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    requireTLS: true,

    auth: { user: "example2655@gmail.com", pass: "Asus231#" },
  });

  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err);
    }
    const token = buffer.toString("hex");
    User.findOne({ email: req.body.email }).then((user) => {
      if (!user) {
        return res
          .status(422)
          .json({ error: "User dont exists with that email" });
      }
      user.resetToken = token;
      user.expireToken = Date.now() + 3600000;
      user.save().then((result) => {
        transporter.sendMail({
          to: user.email,
          from: "jaydeepc721@gmail.com",
          subject: "password reset",
          html: `
                    <p>You requested for password reset</p>
                    <h5>click in this <a href="http://brandlucent.mangoitsol.com/reset">link</a> to reset password</h5>
                    `,
        });
        res.json({ message: "check your email", token });
      });
    });
  });
};

exports.restPassword = (req, res) => {
  const { token, newPassword, confirmPassword } = req.body;
  const salt = bcrypt.genSaltSync(10);

  const hash = bcrypt.hashSync(newPassword, salt);
  const obj = {
    password: hash,
    resetToken: "",
  };
  if (newPassword === confirmPassword) {
    User.findOne({ resetToken: token })
      .then((user) => {
        user = _.extend(user, obj);
        user.save();

        return res.status(200).json({
          message: "Password Updated successfully",
        });
      })
      .catch((err) => {
        return res.status(400).json({
          message: "Token is not match or expired",
        });
      });
  } else {
    return res.status(400).json({
      message: "confirm password is not match",
    });
  }
};
