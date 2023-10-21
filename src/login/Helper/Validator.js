const validator = require("validator");
const bcrypt = require("bcrypt");

const userValidator = (data) => {
  if (!data || !data.email || !data.password || data.password.length < 6)
    throw new Error("Check your email and password");

  if (!validator.isEmail(data.email))
    throw new Error("Invalid email or password");

  return { email: data.email, password: data.password};
};


const emailValidator = (data) => {
  if (!data || !data.email)
    throw new Error("Check your email");

  if (!validator.isEmail(data.email))
    throw new Error("Invalid email");

  return { email: data.email };
};

const isPasswordValid = async (password, newPassword) => {
  const checkPassworMatch = await bcrypt.compare(password, newPassword);
  if (!checkPassworMatch) 
    return false;
  
  return true;
 }

module.exports = {
  userValidator,
  emailValidator,
  isPasswordValid,
};
