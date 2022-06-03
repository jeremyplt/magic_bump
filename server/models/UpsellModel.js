import { ObjectId } from "mongodb";
import mongoose from "mongoose";
import ShopModel from "./ShopModel.js";

const upsellSchema = mongoose.Schema({
  myshopifyDomain: {
    type: String,
    required: true,
  },
  productId: {
    type: String,
    required: true,
  },
  upsell: {
    productId: {
      type: String,
      required: true,
    },
    productTitle: {
      type: String,
      required: true,
    },
  },
});

const UpsellModel = mongoose.model("upsell", upsellSchema);

export default UpsellModel;
