import ProductOverview from "@/components/ProductOverview";
import { useRouter } from 'next/router';
import { useQuery } from '@apollo/client';
import { GET_PRODUCT_BY_SLUG } from '@/gql/queries';

const ProductDetail = () => {
  const router = useRouter();
  const { slug } = router.query;

  const { data, loading, error } = useQuery(GET_PRODUCT_BY_SLUG, {
    variables: { slug },
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const product = data?.product;

  if (!product) return <p>No product found</p>;

  return (
    <>
      <ProductOverview product={product}/>
    </>
  );
}
export default ProductDetail;
