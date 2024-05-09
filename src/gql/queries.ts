import { gql } from '@apollo/client';

export const CATEGORIES_QUERY = gql`
query Categories {
  productCategories(
    where: {hideEmpty: true, parent: null, exclude: "dGVybToxNQ=="}
  ) {
    nodes {
      id
      name
      slug
      children {
        nodes {
          id
          name
          slug
        }
      }
    }
  }
}
`;
