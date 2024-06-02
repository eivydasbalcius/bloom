// types.ts
export interface Category {
    id: string;
    name: string;
    slug: string;
    description?: string;
    image?: {
        mediaItemUrl: string;
    };
    children?: {
        nodes: Category[];
    };
}

export interface Product {
    id: string;
    databaseId: number;
    name: string;
    description: string;
    price: string;
    slug: string;
    image: {
        slug: string;
        mediaItemUrl: string;
    };
    productTags: {
        nodes: Array<{ name: string; slug: string }>;
    };
    productCategories: {
        nodes: Array<{ id: string; name: string; slug: string; parentId: string }>;
    };
    attributes: {
        nodes: Array<{
            id: string;
            name: string;
            label: string;
            options: string[];
            terms: {
                nodes: Array<{
                    id: string;
                    name: string;
                    count: number;
                    slug: string;
                }>;
            };
        }>;
    };
}

export interface ProductDataContextValue {
    categories: Category[];
    products: Product[];
}
