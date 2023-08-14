const { default: mongoose } = require("mongoose");
const User = require('../models/UserModel')

const currentUser = async (req, res, next) => {
  const decodedToken = req;
  console.log(decodedToken);
  const userRecord = await User.findOne({ id: decodedToken })
 
  req.currentUser = userRecord;

 
  if(!userRecord) {
    return res.status(401).end('User not found')
  } else {
    return next();
  }
}

module.exports = currentUser