const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    // decode and verify the token
    //TODO change secret to enviroment variable for the server
    const decoded = jwt.verify(req.body.token, "secret");
    req.userData = decoded;
  } catch (error) {
    return res.status(401).json({
      message: "auth Failed"
    });
  }
  // call the next method if we succeed with the request
  next();
};
