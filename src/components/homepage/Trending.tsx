
import React, { useEffect } from 'react';
import Link from 'next/link';
import { useProductData } from "../../context/ProductDataContext";

const Trending = () => {
  const { products } = useProductData();

  const trendingProducts = products.filter(product =>
    product.productTags.nodes.some(tag => tag.slug.toLowerCase() === 'trending')
  );

  useEffect(() => {
    console.log('Trending Products:', trendingProducts);
  }, [trendingProducts]); 
    return (
        <section aria-labelledby="trending-heading" className="bg-white">
        <div className="py-16 sm:py-24 lg:mx-auto lg:max-w-7xl lg:px-8 lg:py-32">
          <div className="flex items-center justify-between px-4 sm:px-6 lg:px-0">
            <h2 id="trending-heading" className="text-2xl font-bold tracking-tight text-gray-900">
              Trending products
            </h2>
            <a href="#" className="hidden text-sm font-semibold text-indigo-600 hover:text-indigo-500 sm:block">
              See everything
              <span aria-hidden="true"> &rarr;</span>
            </a>
          </div>

          <div className="relative mt-8">
            <div className="relative w-full overflow-x-auto">
              <ul
                role="list"
                className="mx-4 inline-flex space-x-8 sm:mx-6 lg:mx-0 lg:grid lg:grid-cols-4 lg:gap-x-8 lg:space-x-0"
              >
                {trendingProducts.map((product) => (
                  <li key={product.id} className="inline-flex w-64 flex-col text-center lg:w-auto">
                    <Link href={`/products/${product.slug}`}>
                    <div className="group relative">
                      <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-200">
                      <img
                        src={product.image.mediaItemUrl}
                        alt={product.image.slug}
                        className="h-full w-full object-cover object-center group-hover:opacity-75"
                        />
                      </div>
                      <div className="mt-6">
                        <p className="text-sm text-gray-500">{product.color}</p>
                        <h3 className="mt-1 font-semibold text-gray-900">
                          <a href={product.href}>
                            <span className="absolute inset-0" />
                            {product.name}
                          </a>
                        </h3>
                        <p className="mt-1 text-gray-900">{product.price} €</p>
                      </div>
                    </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-12 px-4 sm:hidden">
            <a href="#" className="text-sm font-semibold text-indigo-600 hover:text-indigo-500">
              See everything
              <span aria-hidden="true"> &rarr;</span>
            </a>
          </div>
        </div>
      </section>

);
};

export default Trending;