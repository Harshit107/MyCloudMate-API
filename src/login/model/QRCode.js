const mongoose = require("mongoose");

const QRCodeSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      trim: true,
      required: true,
      unique: true,
    },
    token: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const QRCode = mongoose.model("QRCode", QRCodeSchema);
module.exports = QRCode;
