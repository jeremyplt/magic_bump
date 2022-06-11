import axios from "axios";

const axiosUpsell = axios.create({
  baseURL: "http://localhost:5001/api/upsells",
});

function getUpsells() {
  return axiosUpsell
    .get("/")
    .then((res) => res.data)
    .catch((err) => console.error(err));
}

function getUpsellsByShop(myshopifyDomain) {
  return axiosUpsell
    .get(`/${myshopifyDomain}`)
    .then((res) => res.data)
    .catch((err) => console.log(err));
}

function addUpsell(myshopifyDomain, productId, upsell) {
  return axiosUpsell
    .post("/product", {
      myshopifyDomain: myshopifyDomain,
      productId: productId,
      upsell: {
        productId: upsell.productId,
        productTitle: upsell.productTitle,
      },
    })
    .then((res) => res.data)
    .catch((err) => console.log(err));
}

function addCollectionUpsell(myshopifyDomain, collectionId, upsell) {
  return axiosUpsell
    .post("/collection", {
      myshopifyDomain: myshopifyDomain,
      collectionId: collectionId,
      upsell: {
        productId: upsell.productId,
        productTitle: upsell.productTitle,
      },
    })
    .then((res) => res.data)
    .catch((err) => console.log(err));
}

export { getUpsells, getUpsellsByShop, addUpsell, addCollectionUpsell };
