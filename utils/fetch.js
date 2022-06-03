import { gql, useQuery } from "@apollo/client";

function fetchShopData() {
  const GET_SHOP_INFOS = gql`
    query getShopInfos {
      shop {
        billingAddress {
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
  return data;
}

export { fetchShopData };
