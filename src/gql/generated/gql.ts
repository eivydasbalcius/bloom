/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 */
const documents = {
    "\nquery Categories {\n  productCategories(\n    where: {hideEmpty: false, parent: null, exclude: \"dGVybToxNQ==\"}\n  ) {\n    nodes {\n      id\n      name\n      slug\n      description\n      image {\n        mediaItemUrl\n      }\n      children {\n        nodes {\n          id\n          name\n          slug\n        }\n      }\n    }\n  }\n}\n\n": types.CategoriesDocument,
    "\nquery GetProductsWithCategoryAndTags {\n  products(first: 30) {\n    nodes {\n      ... on SimpleProduct {\n        id\n        name\n        description(format: RAW)\n        price(format: RAW)\n        slug\n        image {\n          slug\n          mediaItemUrl\n        }\n        productTags {\n          nodes {\n            name\n            slug\n          }\n        }\n        productCategories {\n          nodes {\n            id\n            name\n            slug\n            parentId\n          }\n        }\n        attributes {\n          nodes {\n            ... on GlobalProductAttribute {\n              id\n              name\n              label\n              options\n              terms {\n                nodes {\n                  ... on PaColor {\n                    id\n                    name\n                    count\n                    slug\n                  }\n                  ... on PaSize {\n                    id\n                    name\n                    count\n                    slug\n                  }\n                }\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n}\n\n": types.GetProductsWithCategoryAndTagsDocument,
    "\nquery GetProductBySlug($slug: ID!) {\n  product(id: $slug, idType: SLUG) {\n    ... on SimpleProduct {\n      id\n      name\n      description(format: RAW)\n      price(format: RAW)\n      slug\n      image {\n        slug\n        mediaItemUrl\n      }\n      productTags {\n        nodes {\n          name\n          slug\n        }\n      }\n      productCategories {\n        nodes {\n          id\n          name\n          slug\n          parentId\n        }\n      }\n      attributes {\n        nodes {\n          id\n          attributeId\n          name\n          label\n          options\n        }\n      }\n      attributes {\n        nodes {\n          ... on GlobalProductAttribute {\n            id\n            name\n            label\n            options\n            terms {\n              nodes {\n                ... on PaColor {\n                  id\n                  name\n                  count\n                  slug\n                }\n                ... on PaSize {\n                  id\n                  name\n                  count\n                  slug\n                }\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n}\n": types.GetProductBySlugDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\nquery Categories {\n  productCategories(\n    where: {hideEmpty: false, parent: null, exclude: \"dGVybToxNQ==\"}\n  ) {\n    nodes {\n      id\n      name\n      slug\n      description\n      image {\n        mediaItemUrl\n      }\n      children {\n        nodes {\n          id\n          name\n          slug\n        }\n      }\n    }\n  }\n}\n\n"): (typeof documents)["\nquery Categories {\n  productCategories(\n    where: {hideEmpty: false, parent: null, exclude: \"dGVybToxNQ==\"}\n  ) {\n    nodes {\n      id\n      name\n      slug\n      description\n      image {\n        mediaItemUrl\n      }\n      children {\n        nodes {\n          id\n          name\n          slug\n        }\n      }\n    }\n  }\n}\n\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\nquery GetProductsWithCategoryAndTags {\n  products(first: 30) {\n    nodes {\n      ... on SimpleProduct {\n        id\n        name\n        description(format: RAW)\n        price(format: RAW)\n        slug\n        image {\n          slug\n          mediaItemUrl\n        }\n        productTags {\n          nodes {\n            name\n            slug\n          }\n        }\n        productCategories {\n          nodes {\n            id\n            name\n            slug\n            parentId\n          }\n        }\n        attributes {\n          nodes {\n            ... on GlobalProductAttribute {\n              id\n              name\n              label\n              options\n              terms {\n                nodes {\n                  ... on PaColor {\n                    id\n                    name\n                    count\n                    slug\n                  }\n                  ... on PaSize {\n                    id\n                    name\n                    count\n                    slug\n                  }\n                }\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n}\n\n"): (typeof documents)["\nquery GetProductsWithCategoryAndTags {\n  products(first: 30) {\n    nodes {\n      ... on SimpleProduct {\n        id\n        name\n        description(format: RAW)\n        price(format: RAW)\n        slug\n        image {\n          slug\n          mediaItemUrl\n        }\n        productTags {\n          nodes {\n            name\n            slug\n          }\n        }\n        productCategories {\n          nodes {\n            id\n            name\n            slug\n            parentId\n          }\n        }\n        attributes {\n          nodes {\n            ... on GlobalProductAttribute {\n              id\n              name\n              label\n              options\n              terms {\n                nodes {\n                  ... on PaColor {\n                    id\n                    name\n                    count\n                    slug\n                  }\n                  ... on PaSize {\n                    id\n                    name\n                    count\n                    slug\n                  }\n                }\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n}\n\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\nquery GetProductBySlug($slug: ID!) {\n  product(id: $slug, idType: SLUG) {\n    ... on SimpleProduct {\n      id\n      name\n      description(format: RAW)\n      price(format: RAW)\n      slug\n      image {\n        slug\n        mediaItemUrl\n      }\n      productTags {\n        nodes {\n          name\n          slug\n        }\n      }\n      productCategories {\n        nodes {\n          id\n          name\n          slug\n          parentId\n        }\n      }\n      attributes {\n        nodes {\n          id\n          attributeId\n          name\n          label\n          options\n        }\n      }\n      attributes {\n        nodes {\n          ... on GlobalProductAttribute {\n            id\n            name\n            label\n            options\n            terms {\n              nodes {\n                ... on PaColor {\n                  id\n                  name\n                  count\n                  slug\n                }\n                ... on PaSize {\n                  id\n                  name\n                  count\n                  slug\n                }\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n}\n"): (typeof documents)["\nquery GetProductBySlug($slug: ID!) {\n  product(id: $slug, idType: SLUG) {\n    ... on SimpleProduct {\n      id\n      name\n      description(format: RAW)\n      price(format: RAW)\n      slug\n      image {\n        slug\n        mediaItemUrl\n      }\n      productTags {\n        nodes {\n          name\n          slug\n        }\n      }\n      productCategories {\n        nodes {\n          id\n          name\n          slug\n          parentId\n        }\n      }\n      attributes {\n        nodes {\n          id\n          attributeId\n          name\n          label\n          options\n        }\n      }\n      attributes {\n        nodes {\n          ... on GlobalProductAttribute {\n            id\n            name\n            label\n            options\n            terms {\n              nodes {\n                ... on PaColor {\n                  id\n                  name\n                  count\n                  slug\n                }\n                ... on PaSize {\n                  id\n                  name\n                  count\n                  slug\n                }\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n}\n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;