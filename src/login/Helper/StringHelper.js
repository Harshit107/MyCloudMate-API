const checkStringMessage = (message) => {
  if(message === "jwt malformed")
    return "Device token expired"

   return message;
}


module.exports = checkStringMessage;