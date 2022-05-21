import { gql, useQuery } from "@apollo/client";
import { Page, Layout, Banner, Card } from "@shopify/polaris";
import { Loading } from "@shopify/app-bridge-react";
import { ProductsList } from "./ProductsList";
// GraphQL query to retrieve products by IDs.
// The price field belongs to the variants object because
// product variants can have different prices.
const GET_COLLECTIONS_BY_ID = gql`
  query getCollections($ids: [ID!]!) {
    nodes(ids: $ids) {
      ... on Collection {
        title
        id
        handle
      }
    }
  }
`;

export function CollectionsPage({ itemIds }) {
  const { loading, error, data, refetch } = useQuery(GET_COLLECTIONS_BY_ID, {
    variables: { ids: itemIds },
  });
  console.log(data);
  if (loading) return <Loading />;

  if (error) {
    console.warn(error);
    return (
      <Banner status="critical">There was an issue loading products.</Banner>
    );
  }

  return (
    <Page>
      <Layout>
        <Layout.Section>
          <Card>
            <CollectionList data={data} />
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
