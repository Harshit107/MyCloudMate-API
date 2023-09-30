const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const { isPasswordValid } = require("../Helper/Validator");
const { convertDateToString } = require("../Helper/StringHelper");
require('dotenv').config();

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
      validate(value) {
        if (!validator.isEmail(value)) throw new Error("Enter Valid Email-Id");
      },
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 7,
    },
    phone: {
      type: Number,
      trim: true,
    },
    isVerified: {
      type: Boolean,
      default: true,
    },
    userImage: {
      type: String,
    },
    otp : {
      type : Number
    },
    tokens: [
      {
        token: {
          required: true,
          type: String,
        },
        "Login_date": {
          type: String,
        },
        "Last_used": {
          type: String,
        },
        IP: {
          type: String
        },
        lastIP: {
          type: String
        },

      },
    ],

  },
  {
    timestamps: true,
  }
);

userSchema.virtual('files', {
  ref: 'FileData',
  localField: '_id',
  foreignField: 'userId'
})

userSchema.methods.toJSON = function () {
  const user = this
  const userObject = user.toObject();

  delete userObject.password;
  delete userObject.tokens
  return userObject
}

userSchema.pre("save", async function (next) {
  const user = this;
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

userSchema.statics.findByCredentails = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user)
    throw new Error("Invalid email or password");

  const checkPassworMatch = await isPasswordValid(password, user.password);
  if (!checkPassworMatch) {
    throw new Error("Invalid email or password");
  }
  return user;
};

userSchema.methods.generateToken = async function () {
  const user = this;
  const token = jwt.sign(
    {
      _id: user._id.toString(),
    },
    process.env.JWT
  );
  user.tokens = user.tokens.concat({
    token,
    "Login_date": convertDateToString(Date.now()),
    "Last_used " : convertDateToString(Date.now()),
    IP: user.ip,
    lastIP: user.lastIP,
  });
  await user.save();
  return token;
};

userSchema.methods.updateToken = async function (token, lastIP) {
  const user = this;
  // console.log(user.tokens);
  user.tokens.forEach(t => {
    if (t.token === token) {
      t["Last_used"] = convertDateToString(Date.now());
      t.lastIP = lastIP
    }
  });
  await user.save();

};

userSchema.set('toJSON', {virtuals : true});
userSchema.set('toObject', {virtuals : true});
userSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();
  return userObject;
};

userSchema.virtual('FileData',  {
  ref : 'FileData',
  localField : '_id',
  foreignField : 'userId'
})


const User = mongoose.model("User", userSchema);
module.exports = User;
