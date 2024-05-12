import { gql } from '@apollo/client';
// import { graphql } from './generated/gql'

export const CATEGORIES_QUERY = gql`
query Categories {
  productCategories(
    where: {hideEmpty: false, parent: null, exclude: "dGVybToxNQ=="}
  ) {
    nodes {
      id
      name
      slug
      description
      image {
        mediaItemUrl
      }
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

export const PRODUCTS_WITH_CATEGORIES_QUERY = gql`
query GetProductsWithCategoryAndTags {
  products(first: 30) {
    nodes {
      ... on SimpleProduct {
        id
        name
        description(format: RAW)
        price(format: RAW)
        slug
        image {
          slug
          mediaItemUrl
        }
        productTags {
          nodes {
            name
            slug
          }
        }
        productCategories {
          nodes {
            id
            name
            slug
            parentId
          }
        }
        attributes {
          nodes {
            ... on GlobalProductAttribute {
              id
              name
              label
              options
              terms {
                nodes {
                  ... on PaColor {
                    id
                    name
                    count
                    slug
                  }
                  ... on PaSize {
                    id
                    name
                    count
                    slug
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}

`;

export const GET_PRODUCT_BY_SLUG = gql`
query GetProductBySlug($slug: ID!) {
  product(id: $slug, idType: SLUG) {
    ... on SimpleProduct {
      id
      name
      description(format: RAW)
      price(format: RAW)
      slug
      image {
        slug
        mediaItemUrl
      }
      productTags {
        nodes {
          name
          slug
        }
      }
      productCategories {
        nodes {
          id
          name
          slug
          parentId
        }
      }
      attributes {
        nodes {
          id
          attributeId
          name
          label
          options
        }
      }
      attributes {
        nodes {
          ... on GlobalProductAttribute {
            id
            name
            label
            options
            terms {
              nodes {
                ... on PaColor {
                  id
                  name
                  count
                  slug
                }
                ... on PaSize {
                  id
                  name
                  count
                  slug
                }
              }
            }
          }
        }
      }
    }
  }
}
`;