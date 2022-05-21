import React from "react";
import { ProductsPage } from "./ProductsPage";
import { CollectionsPage } from "./CollectionsPage";

const ResultPage = (props) => {
  const { pageType, itemIds } = props;

  if (pageType === "product") return <ProductsPage itemIds={itemIds} />;
  else if (pageType === "collection")
    return <CollectionsPage itemIds={itemIds} />;
};

export default ResultPage;
