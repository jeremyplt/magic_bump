import express from "express";
import {
  getUpsells,
  getUpsellsByShop,
  setUpsellOnProduct,
  setUpsellOnCollection,
} from "../controllers/upsellsController.js";

const router = express.Router();

router.route("/").get(getUpsells);
router.route("/product").post(setUpsellOnProduct);
router.route("/collection").post(setUpsellOnCollection);
router.route("/:url").get(getUpsellsByShop);

export default router;
