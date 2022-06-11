import { useEffect } from "react";
import { gql, useQuery } from "@apollo/client";
import { getUpsellsByShop } from "../services/UpsellService";
import { updateShop } from "../services/ShopService";
import { useDispatch, useSelector } from "react-redux";
import { addShop } from "../store/slices/shopSlice.js";
import { addUpsells } from "../store/slices/upsellsSlice";

// Adding more informations about the shop in the DB

const GET_SHOP_INFOS = gql`
  query getShopInfos {
    shop {
      billingAddress {
        firstName
        name
        address1
        address2
        city
        company
        zip
        country
        phone
      }
      currencyCode
      currencyFormats {
        moneyFormat
      }
      email
      id
      myshopifyDomain
      name
      plan {
        displayName
      }
      url
    }
  }
`;

function GetShopData() {
  const { data } = useQuery(GET_SHOP_INFOS);
  const shopState = useSelector((state) => state.shop.value);
  const dispatch = useDispatch();

  async function setShopUpsellsState() {
    return await getUpsellsByShop(shopState.myshopifyDomain);
  }

  useEffect(() => {
    if (data) {
      const shop = data.shop;
      dispatch(addShop(shop));
      updateShop(shop);
    }
  }, [data]);

  useEffect(() => {
    setShopUpsellsState().then((upsells) => dispatch(addUpsells(upsells)));
  }, [shopState]);

  return;
}

export default GetShopData;
