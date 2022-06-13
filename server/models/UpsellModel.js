import { ObjectId } from "mongodb";
import mongoose from "mongoose";
import ShopModel from "./ShopModel.js";

const upsellSchema = mongoose.Schema(
  {
    myshopifyDomain: {
      type: String,
      required: true,
    },
    productItem: {
      id: String,
      name: String,
    },
    collectionItem: {
      id: String,
      name: String,
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
  },
  { timestamps: true }
);

const UpsellModel = mongoose.model("upsell", upsellSchema);

export default UpsellModel;
