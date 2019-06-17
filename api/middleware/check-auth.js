const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    // decode and verify the token if there is no token present then we should fail
    const token = req.headers.authorization.split(" ")[1];
    console.log(token);
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    req.userData = decoded;
    // call the next method if we succeed with the request
    next();
  } catch (error) {
    return res.status(401).json({
      // ! only included for debugging purposes
      message: "auth Failed - in check-Auth"
    });
  }
};
