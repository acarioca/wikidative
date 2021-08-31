const config = require("../config/auth.config");
const user = require("../models/user");
var jwt = require("jsonwebtoken");
var bcrypt = require("bcrypt");

exports.register = (req, res) => {
  const newUser = new user({
    username: req.body.username,
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    email: req.body.email,
    question: req.body.question,
    answer: bcrypt.hashSync(req.body.answer, 10),
    password: bcrypt.hashSync(req.body.password, 10),
  });

  newUser.save((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }
  });
  res.status(200).send({ message: "User created successfully" });
};

exports.login = (req, res) => {
  user
    .findOne({
      username: req.body.username,
    })
    .exec((err, result) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }
      if (!result) {
        res.status(404).send({ message: "User not found" });
        return;
      }

      var passwordValidity = bcrypt.compareSync(
        req.body.password,
        result.password
      );

      if (!passwordValidity) {
        res.status(401).send({ message: "Wrong password" });
        return;
      }

      var token = jwt.sign({ id: result._id }, config.secret, {
        expiresIn: 1800, // 30 mins
      });
      res.status(200).send({
        username: result.username,
        email: result.email,
        firstname: result.firstname,
        lastname: result.lastname,
        accessToken: token,
      });
    });
};
