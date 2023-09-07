
const mongoose = require('mongoose');

const verificationLinkschema = new mongoose.Schema( {
  
  email : {
    type : String,
    required : true,
  }
}, {
  timestamp : true
})

const VerificationLink = mongoose.model('Verification',verificationLinkschema);
module.exports = VerificationLink;  