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

// @desc get shops by url
// @route GET /api/shops/:id
// @access Private
const getShopById = expressAsyncHandler(async (req, res) => {
  const shop = await ShopModel.findOne({ id: req.params.id });
  res.status(200).json(shop);
});

// @desc set shops
// @route POST /api/shops
// @access Private
const setShop = expressAsyncHandler(async (req, res) => {
  const shop = req.body;
  await ShopModel.create({
    url: shop.url,
    accessToken: shop.accessToken || null,
    supportEmail: shop.supportEmail || null,
    scope: shop.scope || null,
  });
  res.sendStatus(200).json(shop);
});

// @desc update shop
// @route PATCH /api/shops/:url
// @access Private
const updateShop = expressAsyncHandler(async (req, res) => {
  await ShopModel.findOneAndUpdate(
    { myshopifyDomain: req.params.url },
    { ...req.body }
  );
  res.status(200).json(req.body);
});

// @desc delete shop
// @route DELETE /api/shops
// @access Private
const deleteShop = expressAsyncHandler(async (req, res) => {
  const url = req.params.url;
  await ShopModel.deleteOne({ url });
  res.status(200).json({ message: `Delete shop ${req.params.id}` });
});

export { getShops, getShopByUrl, setShop, updateShop, deleteShop, getShopById };
