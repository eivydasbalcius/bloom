import { createContext, useContext, useState, useEffect } from 'react';
import { useQuery, gql } from '@apollo/client';
import apolloClient from "../lib/apollo-client"
import { CATEGORIES_QUERY } from '../gql/queries';

const CategoryContext = createContext(null);

export const CategoryProvider = ({ children }) => {
  const { data, loading, error } = useQuery(CATEGORIES_QUERY, {
    client: apolloClient,
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading categories.</p>;

  return (
    <CategoryContext.Provider value={data.productCategories.nodes}>
      {children}
    </CategoryContext.Provider>
  );
};

export const useCategories = () => useContext(CategoryContext);
