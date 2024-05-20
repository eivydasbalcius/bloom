import React, { useState, useEffect } from 'react';
import { RadioGroup } from '@headlessui/react';
import { StarIcon } from '@heroicons/react/20/solid';

interface MediaItem {
  __typename: string;
  slug: string;
  mediaItemUrl: string;
}

interface ProductCategory {
  __typename: string;
  id: string;
  name: string;
  slug: string;
  parentId: string | null;
}

interface TermNode {
  __typename: string;
  id: string;
  name: string;
  count: number;
  slug: string;
}

interface Attribute {
  __typename: string;
  id: string;
  attributeId: number;
  name: string;
  label: string;
  options: string[];
  terms: {
    __typename: string;
    nodes: TermNode[];
  };
}

interface Product {
  __typename: string;
  id: string;
  name: string;
  description: string;
  price: string;
  slug: string;
  image: MediaItem;
  productTags: {
    __typename: string;
    nodes: any[];
  };
  productCategories: {
    __typename: string;
    nodes: ProductCategory[];
  };
  attributes: {
    __typename: string;
    nodes: Attribute[];
  };
}

type ProductOverviewProps = {
  product: Product;
};

const ProductOverview: React.FC<ProductOverviewProps> = ({ product }) => {
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState<number>(1);

  const getColorOptions = () => {
    const colorAttribute = product?.attributes?.nodes?.find(attr => attr.name === 'pa_color');
    return colorAttribute ? colorAttribute.options : [];
  };

  const getSizeOptions = () => {
    const sizeAttribute = product?.attributes?.nodes?.find(attr => attr.name === 'pa_size');
    return sizeAttribute ? sizeAttribute.terms.nodes : [];
  };
  function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ');
  }

  useEffect(() => {
    setSelectedColor(getColorOptions()[0]);
    setSelectedSize(getSizeOptions()[0]?.name || null);
  }, [product]);

  useEffect(() => {
    console.log('Trending Products:', product);
  }, [product]);

  const handleAddToCart = (e: React.FormEvent) => {
    e.preventDefault();
    const cartItem = {
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.image.mediaItemUrl,
      quantity,
      attributes: {
        color: selectedColor,
        size: selectedSize,
      },
    };

    let cart = JSON.parse(sessionStorage.getItem('cart') || '[]');
    cart.push(cartItem);
    sessionStorage.setItem('cart', JSON.stringify(cart));

    // Dispatch custom event
    const event = new CustomEvent('cart-updated');
    window.dispatchEvent(event);

  };

  return (
    <>
      <div className="pt-10 sm:pt-16">
        <nav aria-label="Breadcrumb">
          <ol role="list" className="mx-auto flex max-w-2xl items-center space-x-2 px-4 sm:px-6 lg:max-w-7xl lg:px-8">
            <li className="text-sm">
              <a href={product.slug} aria-current="page" className="font-medium text-gray-500 hover:text-gray-600">
                {product.name}
              </a>
            </li>
          </ol>
        </nav>

        <div className="mx-auto mt-6 max-w-2xl sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-3 lg:gap-x-8 lg:px-8">
          <div className="aspect-h-4 aspect-w-3 hidden overflow-hidden rounded-lg lg:block">
            <img
              src={product.image.mediaItemUrl}
              alt={product.name}
              className="h-full w-full object-cover object-center"
            />
          </div>
          <div className="hidden lg:grid lg:grid-cols-1 lg:gap-y-8">
            <div className="aspect-h-2 aspect-w-3 overflow-hidden rounded-lg">
              <img
                src={product.image.mediaItemUrl}
                alt={product.name}
                className="h-full w-full object-cover object-center"
              />
            </div>
            <div className="aspect-h-2 aspect-w-3 overflow-hidden rounded-lg">
              <img
                src={product.image.mediaItemUrl}
                alt={product.name}
                className="h-full w-full object-cover object-center"
              />
            </div>
          </div>
          <div className="aspect-h-5 aspect-w-4 lg:aspect-h-4 lg:aspect-w-3 sm:overflow-hidden sm:rounded-lg">
            <img
              src={product.image.mediaItemUrl}
              alt={product.name}
              className="h-full w-full object-cover object-center"
            />
          </div>
        </div>

        <div className="mx-auto max-w-2xl px-4 pt-10 sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-3 lg:grid-rows-[auto,auto,1fr] lg:gap-x-8 lg:px-8 lg:pt-16">
          <div className="lg:col-span-2 lg:border-r lg:border-gray-200 lg:pr-8">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">{product.name}</h1>
          </div>

          <div className="mt-4 lg:row-span-3 lg:mt-0">
            <h2 className="sr-only">Product information</h2>
            <p className="text-3xl tracking-tight text-gray-900">{product.price} €</p>
            <div className="mt-6">
              <h3 className="sr-only">Reviews</h3>
              <div className="flex items-center">
                <div className="flex items-center">
                  {[0, 1, 2, 3, 4].map((rating) => (
                    <StarIcon
                      key={rating}
                      className={classNames(
                        rating < 4 ? 'text-gray-900' : 'text-gray-200',
                        'h-5 w-5 flex-shrink-0'
                      )}
                      aria-hidden="true"
                    />
                  ))}
                </div>
                <p className="sr-only">4 out of 5 stars</p>
                <a className="ml-3 text-sm font-medium text-indigo-600 hover:text-indigo-500">
                  222 reviews
                </a>
              </div>
            </div>

            <form className="mt-10" onSubmit={handleAddToCart}>
              {/* Colors */}
              {selectedColor && (
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Color</h3>
                  <RadioGroup value={selectedColor} onChange={setSelectedColor} className="mt-4">
                    <RadioGroup.Label className="sr-only">Choose a color</RadioGroup.Label>
                    <div className="flex items-center space-x-3">
                      {getColorOptions().map((color) => (
                        <RadioGroup.Option
                          key={color}
                          value={color}
                          className={({ active, checked }) =>
                            classNames(
                              'relative -m-0.5 flex cursor-pointer items-center justify-center rounded-full p-0.5 focus:outline-none',
                              checked ? 'ring-2 ring-offset-1 ring-indigo-500' : '',
                            )
                          }
                        >
                          <RadioGroup.Label as="span" className="sr-only">
                            {color}
                          </RadioGroup.Label>
                          <span
                            aria-hidden="true"
                            className="h-8 w-8 rounded-full"
                            style={{ backgroundColor: color }}
                          />
                        </RadioGroup.Option>
                      ))}
                    </div>
                  </RadioGroup>
                </div>
              )}
              {/* Sizes */}
              {selectedSize && (
                <div className="mt-10">
                  <h3 className="text-sm font-medium text-gray-900">Size</h3>
                  <RadioGroup value={selectedSize} onChange={setSelectedSize} className="mt-4">
                    <RadioGroup.Label className="sr-only">Choose a size</RadioGroup.Label>
                    <div className="grid grid-cols-4 gap-4">
                      {getSizeOptions().map((size) => (
                        <RadioGroup.Option
                          key={size.id}
                          value={size.name}
                          className={({ active, checked }) =>
                            classNames(
                              'cursor-pointer rounded-md p-3 text-sm font-medium focus:outline-none',
                              checked ? 'bg-indigo-600 text-white' : 'bg-white shadow-sm text-gray-900',
                              active ? 'ring-2 ring-indigo-500' : '',
                            )
                          }
                        >
                          <RadioGroup.Label as="span">
                            {size.name}
                          </RadioGroup.Label>
                        </RadioGroup.Option>
                      ))}
                    </div>
                  </RadioGroup>
                </div>
              )}

              {/* Quantity */}
              <div className="mt-4">
                <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
                  Quantity
                </label>
                <input
                  type="number"
                  id="quantity"
                  name="quantity"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-black"
                />
              </div>

              <button
                type="submit"
                className="mt-10 flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Add to bag
              </button>
            </form>
          </div>

          <div className="py-10 lg:col-span-2 lg:col-start-1 lg:border-r lg:border-gray-200 lg:pb-16 lg:pr-8 lg:pt-6">
            <div>
              <h3 className="sr-only">Description</h3>
              <div className="space-y-6">
                <p className="text-base text-gray-900">{product.description}</p>
              </div>
            </div>
            <div className="mt-10">
              <h3 className="text-sm font-medium text-gray-900">Highlights</h3>
              <div className="mt-4">
                <ul role="list" className="list-disc space-y-2 pl-4 text-sm">
                  {/* {product.highlights.map((highlight) => (
                    <li key={highlight} className="text-gray-400">
                      <span className="text-gray-600">{highlight}</span>
                    </li>
                  ))} */}
                </ul>
              </div>
            </div>
            <section aria-labelledby="shipping-heading" className="mt-10">
              <h2 id="shipping-heading" className="text-sm font-medium text-gray-900">
                Details
              </h2>
              <div className="mt-4 space-y-6">
                <p className="text-sm text-gray-600">{product.slug}</p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductOverview;
