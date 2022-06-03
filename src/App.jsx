import {
  ApolloClient,
  ApolloProvider,
  HttpLink,
  InMemoryCache,
} from "@apollo/client";
import {
  Provider as AppBridgeProvider,
  useAppBridge,
} from "@shopify/app-bridge-react";
import { useState } from "react";
import { authenticatedFetch } from "@shopify/app-bridge-utils";
import { Redirect } from "@shopify/app-bridge/actions";
import { AppProvider as PolarisProvider } from "@shopify/polaris";
import { useHistory } from "react-router-dom";
import translations from "@shopify/polaris/locales/en.json";
import "@shopify/polaris/build/esm/styles.css";

import { GlobalContext } from "./Context";

import Routers from "./components/Routers";
import GetShopData from "./components/GetShopData";

export default function App() {
  const [selection, setSelection] = useState([]);
  const [pageType, setPageType] = useState("");
  const [shopUrl, setShopUrl] = useState("");
  const [shopUpsells, setShopUpsells] = useState({});

  const history = useHistory();
  const resetEmptyPage = () => {
    setSelection([]);
    history.goBack();
  };

  const globalProps = {
    selection,
    setSelection,
    pageType,
    setPageType,
    shopUrl,
    setShopUrl,
    shopUpsells,
    setShopUpsells,
    history,
    resetEmptyPage,
  };

  return (
    <PolarisProvider i18n={translations}>
      <AppBridgeProvider
        config={{
          apiKey: process.env.SHOPIFY_API_KEY,
          host: new URL(location).searchParams.get("host"),
          forceRedirect: true,
        }}
      >
        <MyProvider>
          <GlobalContext.Provider value={{ ...globalProps }}>
            <GetShopData />
            <Routers />
          </GlobalContext.Provider>
        </MyProvider>
      </AppBridgeProvider>
    </PolarisProvider>
  );
}

function MyProvider({ children }) {
  const app = useAppBridge();
  const client = new ApolloClient({
    cache: new InMemoryCache(),
    link: new HttpLink({
      credentials: "include",
      fetch: userLoggedInFetch(app),
    }),
  });

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}

export function userLoggedInFetch(app) {
  const fetchFunction = authenticatedFetch(app);

  return async (uri, options) => {
    const response = await fetchFunction(uri, options);

    if (
      response.headers.get("X-Shopify-API-Request-Failure-Reauthorize") === "1"
    ) {
      const authUrlHeader = response.headers.get(
        "X-Shopify-API-Request-Failure-Reauthorize-Url"
      );

      const redirect = Redirect.create(app);
      redirect.dispatch(Redirect.Action.APP, authUrlHeader || `/auth`);
      return null;
    }

    return response;
  };
}
