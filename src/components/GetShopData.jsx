import { useContext, useEffect } from "react";
import { GlobalContext } from "../Context";
import { updateShop } from "../services/ShopService";
import { fetchShopData } from "../../utils/fetch.js";
import { getUpsellsByShop } from "../services/UpsellService";

// Adding more informations about the shop in the DB

function GetShopData() {
  const { setShopUrl, shopUrl, setShopUpsells } = useContext(GlobalContext);
  const shopData = fetchShopData();

  useEffect(() => {
    async function getShopUpsells() {
      const upsells = await getUpsellsByShop(shopUrl);
      setShopUpsells(upsells);
    }
    if (shopData) {
      updateShop(shopData.shop);
      setShopUrl(shopData.shop.myshopifyDomain);
    }
    getShopUpsells();
  }, []);

  return;
}

export default GetShopData;
