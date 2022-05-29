import expressAsyncHandler from "express-async-handler";
import ShopModel from "../models/ShopModel.js";

// @desc get shops
// @route GET /api/shops
// @access Private
const getShops = expressAsyncHandler(async (req, res) => {
  const allShops = await ShopModel.find();
  res.status(200).json(allShops);
});

// @desc get shops by url
// @route GET /api/shops/:url
// @access Private
const getShopByUrl = expressAsyncHandler(async (req, res) => {
  const shop = await ShopModel.findOne({ url: req.params.url });
  res.status(200).json(shop);
});

// @desc set shops
// @route POST /api/shops
// @access Private
const setShops = expressAsyncHandler(async (req, res) => {
  if (!req.body.text) {
    res.status(400);
    throw new Error("Please add a text");
  }
  res.status(200).json({ message: "Set shops" });
});

// @desc update shop
// @route PUT /api/shops/:id
// @access Private
const updateShop = expressAsyncHandler(async (req, res) => {
  res.status(200).json({ message: `Update shops ${req.params.id}` });
});

// @desc delete shop
// @route DELETE /api/shops
// @access Private
const deleteShop = expressAsyncHandler(async (req, res) => {
  res.status(200).json({ message: `Delete shop ${req.params.id}` });
});

export { getShops, getShopByUrl, setShops, updateShop, deleteShop };
