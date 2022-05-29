import mongoose from "mongoose";

const shopSchema = mongoose.Schema(
  {
    url: {
      type: String,
      required: true,
    },
    accessToken: String,
    supportEmail: String,
    scope: String,
  },
  { timestamps: true }
);

const ShopModel = mongoose.model("shop", shopSchema);

export default ShopModel;
