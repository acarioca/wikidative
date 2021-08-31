const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");

module.exports.verifyToken = (req, res, next) => {
    var token = req.headers["x-access-token"];
    if (!token) {
        return res.status(403).send({ message: "Missing token" });
    }

    jwt.verify(token, config.secret, (err, result) => {
        if (err) {
            return res.status(401).send({ message: "Please login" });
        }
        req.userId = result.id;
        next();
    })
}