import express from "express";
import {
  getUpsells,
  getUpsellsByShop,
  setUpsell,
} from "../controllers/upsellsController.js";

const router = express.Router();

router.route("/").get(getUpsells).post(setUpsell);
router.route("/:url").get(getUpsellsByShop);

export default router;
