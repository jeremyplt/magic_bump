import expressAsyncHandler from "express-async-handler";
import UpsellModel from "../models/UpsellModel.js";

// @desc get shops
// @route GET /api/upsell
// @access Private
const getUpsells = expressAsyncHandler(async (req, res) => {
  const allUpsells = await UpsellModel.find();
  res.status(200).json(allUpsells);
});

const getUpsellsByShop = expressAsyncHandler(async (req, res) => {
  const url = req.params.url;
  const upsells = await UpsellModel.find({ myshopifyDomain: url });
  res.status(200).json(upsells);
});

// @desc set shops
// @route POST /api/upsells/:shopId
// @access Private
const setUpsell = expressAsyncHandler(async (req, res) => {
  const item = req.body;
  const data = {
    myshopifyDomain: item.myshopifyDomain,
    productId: item.productId,
    upsell: {
      productId: item.upsell.productId,
      productTitle: item.upsell.productTitle,
    },
  };
  const query = {
    myshopifyDomain: item.myshopifyDomain,
    productId: item.productId,
  };
  const option = {
    upsert: true,
  };
  await UpsellModel.findOneAndUpdate(query, data, option);
  res.sendStatus(200).json(item);
});

export { getUpsells, getUpsellsByShop, setUpsell };
