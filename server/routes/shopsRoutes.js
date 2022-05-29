import express from "express";
import {
  getShops,
  getShopByUrl,
  setShops,
  updateShop,
  deleteShop,
} from "../controllers/shopsController.js";

const router = express.Router();

router.route("/").get(getShops).post(setShops);

router.route("/:url").get(getShopByUrl).put(updateShop).delete(deleteShop);

export default router;
