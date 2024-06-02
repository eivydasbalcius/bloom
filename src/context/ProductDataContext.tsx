import { createContext, useContext, ReactNode, FunctionComponent } from 'react';
import { useQuery } from '@apollo/client';
import apolloClient from "../lib/apollo-client";
import { CATEGORIES_QUERY, PRODUCTS_WITH_CATEGORIES_QUERY } from '../gql/queries';
import { ProductDataContextValue } from './types';

const ProductDataContext = createContext<ProductDataContextValue | undefined>(undefined);

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

  const combinedData: ProductDataContextValue = {
    categories: categoryData?.productCategories.nodes,
    products: productData?.products.nodes,
  };

  return (
    <ProductDataContext.Provider value={combinedData}>
      {children}
    </ProductDataContext.Provider>
  );
};

export const useProductData = () => {
  const context = useContext(ProductDataContext);
  if (context === undefined) {
    throw new Error('useProductData must be used within a ProductDataProvider');
  }
  return context;
};
