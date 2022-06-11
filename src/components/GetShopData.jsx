import { useEffect } from "react";
import { gql, useQuery } from "@apollo/client";
import { getUpsellsByShop } from "../services/UpsellService";
import { useDispatch, useSelector } from "react-redux";
import { addShop } from "../store/slices/shopSlice.js";
import { addUpsells } from "../store/slices/upsellsSlice";

// Adding more informations about the shop in the DB

function GetShopData() {
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

  const { data } = useQuery(GET_SHOP_INFOS);
  const shopState = useSelector((state) => state.shop.value);
  const dispatch = useDispatch();

  async function setShopUpsellsState() {
    const upsells = await getUpsellsByShop(shopState.myshopifyDomain);
    dispatch(addUpsells(upsells));
  }

  useEffect(() => {
    if (data) {
      const shop = data.shop;
      dispatch(addShop(shop));
    }

    setShopUpsellsState();
  }, [data]);

  return;
}

export default GetShopData;
