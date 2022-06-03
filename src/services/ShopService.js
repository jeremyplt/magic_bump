import axios from "axios";

const axiosShop = axios.create({
  baseURL: "http://localhost:5001/api/shops",
});

function getShops() {
  return axiosShop
    .get("/")
    .then((res) => res.data)
    .catch((err) => console.log(err));
}

function addShop(shop) {
  return axiosShop
    .post("/", { ...shop })
    .then((res) => res.data)
    .catch((err) => console.log(err));
}

async function getShopByUrl(url) {
  const res = await axiosShop.get(`/${url}`);
  return await res;
}

function updateShop(shop) {
  return axiosShop
    .patch(`/${shop.myshopifyDomain}`, { ...shop })
    .then((res) => res.data)
    .catch((err) => console.log(err));
}

export { getShops, addShop, updateShop, getShopByUrl };
