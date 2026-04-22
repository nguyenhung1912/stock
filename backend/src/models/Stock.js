const { Schema, model } = require("mongoose");
const exchanges = require("../constants/exchanges");

const stockSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Stock name is required"],
      trim: true,
    },
    code: {
      type: String,
      required: [true, "Stock code is required"],
      trim: true,
      uppercase: true,
    },
    price: {
      type: Number,
      default: 0,
    },
    previousPrice: {
      type: Number,
      default: 0,
    },
    exchange: {
      type: String,
      required: [true, "Exchange is required"],
      enum: exchanges.map((item) => item.code),
      uppercase: true,
      trim: true,
    },
    favorite: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    collection: "stocks",
    toJSON: {
      transform: (_, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
        return returnedObject;
      },
    },
  },
);

module.exports = model("Stock", stockSchema);
