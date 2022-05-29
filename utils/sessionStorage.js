import SessionModel from "../server/models/SessionModel.js";
import Cryptr from "cryptr";
import { Shopify } from "@shopify/shopify-api";

const cryption = new Cryptr(process.env.SHOPIFY_API_SECRET);

const storeCallback = async (session) => {
  const result = await SessionModel.findOne({ id: session.id });

  if (result === null) {
    await SessionModel.create({
      id: session.id,
      content: cryption.encrypt(JSON.stringify(session)),
      shop: session.shop,
    });
  } else {
    await SessionModel.findOneAndUpdate(
      { id: session.id },
      {
        content: cryption.encrypt(JSON.stringify(session)),
        shop: session.shop,
      }
    );
  }
  return true;
};

const loadCallback = async (id) => {
  const sessionResult = await SessionModel.findOne({ id });
  if (sessionResult.content.length > 0) {
    return JSON.parse(cryption.decrypt(sessionResult.content));
  }
  return undefined;
};

const deleteCallback = async (id) => {
  await SessionModel.findOneAndRemove({ id });
  return true;
};

const sessionStorage = new Shopify.Session.CustomSessionStorage(
  storeCallback,
  loadCallback,
  deleteCallback
);

export default sessionStorage;
