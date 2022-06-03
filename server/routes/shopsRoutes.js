import express from "express";
import {
  getShops,
  getShopByUrl,
  getShopById,
  setShop,
  updateShop,
  deleteShop,
} from "../controllers/shopsController.js";

const router = express.Router();

router.route("/").get(getShops).post(setShop);

// Rooter by URL
router.route("/:url").get(getShopByUrl).patch(updateShop).delete(deleteShop);

export default router;
