import mongoose from "mongoose";

const shopSchema = mongoose.Schema(
  {
    billingAddress: {
      name: String,
      address1: String,
      address2: String,
      city: String,
      company: String,
      zip: String,
      country: String,
      phone: String,
    },
    currencyCode: String,
    currencyFormats: {
      moneyFormat: String,
    },
    email: String,
    id: String,
    myshopifyDomain: String,
    name: String,
    plan: {
      displayName: String,
    },
    url: {
      type: String,
    },
    accessToken: String,
    supportEmail: String,
    scope: String,
  },
  { timestamps: true }
);

const ShopModel = mongoose.model("shop", shopSchema);

export default ShopModel;
