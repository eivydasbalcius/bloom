import { NextPage } from 'next';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useQuery } from '@apollo/client';
import { PRODUCTS_WITH_CATEGORIES_QUERY } from '@/gql/queries';
import AllProductsPage from "@/components/Categories";

const AllProducts: NextPage = () => {

    const { data, loading, error } = useQuery(PRODUCTS_WITH_CATEGORIES_QUERY);


    useEffect(() => {
        console.log('All Products:', data?.products.nodes);
      }, [data]); 


    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;

  return (
    <>
      <AllProductsPage products={data?.products.nodes}/>
    </>
  );
}
export default AllProducts;
