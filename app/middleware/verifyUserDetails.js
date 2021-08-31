var user = require("../models/user");

module.exports.checkDuplicateUsernameOrEmail = (req, res, next) => {
    user.findOne({
        username: req.body.username
    }).exec((err, result) => {
        if (err) {
            res.status(500).send({ message: err });
            return;
        }
        if (result) {
            res.status(400).send({ message: "Username already in place" });
            return;
        }

        user.findOne({
            email: req.body.email
        }).exec((err, result) => {
            if (err) {
                res.status(500).send({ message: err });
                return;
            }
            if (result) {
                res.status(400).send({ message: "Email already used" });
                return;
            }
            next();
        });
    });
}