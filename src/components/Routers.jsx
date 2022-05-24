import React from "react";
import { Routes, Route } from "react-router-dom";
import { EmptyStatePage } from "./EmptyStatePage";
import ResultPage from "./ResultPage";

export default function Routers({
  pageType,
  itemIds,
  setEmptyPage,
  setSelection,
  setPageType,
}) {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <EmptyStatePage
            setSelection={setSelection}
            setPageType={setPageType}
            setEmptyPage={setEmptyPage}
          />
        }
      />
      <Route
        path="/results"
        element={
          <ResultPage
            pageType={pageType}
            itemIds={itemIds}
            setEmptyPage={setEmptyPage}
            setSelection={setSelection}
          />
        }
      />
      {/* <Route path="/upsells" element={<Upsell />} />
      <Route path="/design" element={<Design />} />
      <Route path="/analytics" element={<Analytics />} />
      <Route path="/help" element={<Help />} /> */}
    </Routes>
  );
}
