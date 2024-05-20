import { createContext, useContext, ReactNode, FunctionComponent } from 'react';
import { useQuery, gql } from '@apollo/client';
import apolloClient from "../lib/apollo-client";
import { CATEGORIES_QUERY, PRODUCTS_WITH_CATEGORIES_QUERY } from '../gql/queries';

const ProductDataContext = createContext<any>(null);

interface ProductDataProviderProps {
  children: ReactNode;
}

export const ProductDataProvider: FunctionComponent<ProductDataProviderProps> = ({ children }) => {
  const {
    data: categoryData,
    loading: categoryLoading,
    error: categoryError,
  } = useQuery(CATEGORIES_QUERY, { client: apolloClient });

  const {
    data: productData,
    loading: productLoading,
    error: productError,
  } = useQuery(PRODUCTS_WITH_CATEGORIES_QUERY, { client: apolloClient });

  if (categoryLoading || productLoading) return <p>Loading...</p>;
  if (categoryError) return <p>Error loading categories: {categoryError.message}</p>;
  if (productError) return <p>Error loading products: {productError.message}</p>;

  const combinedData = {
    categories: categoryData?.productCategories.nodes,
    products: productData?.products.nodes,
  };

  return (
    <ProductDataContext.Provider value={combinedData}>
      {children}
    </ProductDataContext.Provider>
  );
};

export const useProductData = () => useContext(ProductDataContext);
