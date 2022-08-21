import {
  SkeletonThumbnail,
  SkeletonBodyText,
  Stack,
  Layout,
} from "@shopify/polaris";

function ProductsListSkeleton() {
  return (
    <Layout>
      <Layout.Section>
        <Stack>
          <Stack.Item>
            <SkeletonThumbnail size="medium" />
          </Stack.Item>
          <Stack.Item fill>
            <SkeletonBodyText />
          </Stack.Item>
        </Stack>
      </Layout.Section>
    </Layout>
  );
}

export default ProductsListSkeleton;
