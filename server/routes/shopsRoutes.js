import express from "express";
import {
  getShops,
  getShopByUrl,
  setShop,
  updateShop,
  deleteShop,
} from "../controllers/shopsController.js";

const router = express.Router();

router.route("/").get(getShops).post(setShop);

router.route("/:url").get(getShopByUrl).put(updateShop).delete(deleteShop);

export default router;
