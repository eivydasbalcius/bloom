
import React, { useState, useEffect } from 'react';
import { RadioGroup } from '@headlessui/react'
import { StarIcon } from '@heroicons/react/20/solid'

export default function ProductOverview ({ product }) {
  const [open, setOpen] = useState(false)
  const [selectedColor, setSelectedColor] = useState(product?.attributes?.nodes?.find(attr => attr.name === 'pa_color').options[0]);
  const [selectedSize, setSelectedSize] = useState(product?.attributes?.nodes?.find(attr => attr.name === 'pa_size').options[0]);

  function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ');
  }

  return (
    <>
      <div className="pt-10 sm:pt-16">
        <nav aria-label="Breadcrumb">
          <ol role="list" className="mx-auto flex max-w-2xl items-center space-x-2 px-4 sm:px-6 lg:max-w-7xl lg:px-8">
            {/* {product.breadcrumbs.map((breadcrumb) => (
              <li key={breadcrumb.id}>
                <div className="flex items-center">
                  <a href={breadcrumb.href} className="mr-2 text-sm font-medium text-gray-900">
                    {breadcrumb.name}
                  </a>
                  <svg
                    width={16}
                    height={20}
                    viewBox="0 0 16 20"
                    fill="currentColor"
                    aria-hidden="true"
                    className="h-5 w-4 text-gray-300"
                  >
                    <path d="M5.697 4.34L8.98 16.532h1.327L7.025 4.341H5.697z" />
                  </svg>
                </div>
              </li>
            ))} */}
            <li className="text-sm">
              <a href={product.href} aria-current="page" className="font-medium text-gray-500 hover:text-gray-600">
                {product.name}
              </a>
            </li>
          </ol>
        </nav>

        {/* Image gallery */}
        <div className="mx-auto mt-6 max-w-2xl sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-3 lg:gap-x-8 lg:px-8">
          <div className="aspect-h-4 aspect-w-3 hidden overflow-hidden rounded-lg lg:block">
            <img
              src={product.image.mediaItemUrl}
              // alt={product.images[0].alt}
              className="h-full w-full object-cover object-center"
            />
          </div>
          <div className="hidden lg:grid lg:grid-cols-1 lg:gap-y-8">
            <div className="aspect-h-2 aspect-w-3 overflow-hidden rounded-lg">
              <img
                src={product.image.mediaItemUrl}
                // alt={product.images[1].alt}
                className="h-full w-full object-cover object-center"
              />
            </div>
            <div className="aspect-h-2 aspect-w-3 overflow-hidden rounded-lg">
              <img
                src={product.image.mediaItemUrl}
                // alt={product.images[2].alt}
                className="h-full w-full object-cover object-center"
              />
            </div>
          </div>
          <div className="aspect-h-5 aspect-w-4 lg:aspect-h-4 lg:aspect-w-3 sm:overflow-hidden sm:rounded-lg">
            <img
              src={product.image.mediaItemUrl}
              // alt={product.images[3].alt}
              className="h-full w-full object-cover object-center"
            />
          </div>
        </div>

        {/* Product info */}
        <div className="mx-auto max-w-2xl px-4 pt-10 sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-3 lg:grid-rows-[auto,auto,1fr] lg:gap-x-8 lg:px-8 lg:pt-16">
          <div className="lg:col-span-2 lg:border-r lg:border-gray-200 lg:pr-8">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">{product.name}</h1>
          </div>

          {/* Options */}
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
                       'text-gray-900' ,
                       'text-gray-200',
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

        <form className="mt-10">
          {/* Colors */}
          {product?.attributes?.nodes?.find(attr => attr.name === 'pa_color').options.length > 0 && (
          <div>
            <h3 className="text-sm font-medium text-gray-900">Color</h3>
            <RadioGroup value={selectedColor} onChange={setSelectedColor} className="mt-4">
              <RadioGroup.Label className="sr-only">Choose a color</RadioGroup.Label>
              <div className="flex items-center space-x-3">
                {product?.attributes?.nodes?.find(attr => attr.name === 'pa_color').options.map((color) => (
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
          {product?.attributes?.nodes?.find(attr => attr.name === 'pa_size').options.length > 0 && (
          <div className="mt-10">
            <h3 className="text-sm font-medium text-gray-900">Size</h3>
            <RadioGroup value={selectedSize} onChange={setSelectedSize} className="mt-4">
              <RadioGroup.Label className="sr-only">Choose a size</RadioGroup.Label>
              <div className="grid grid-cols-4 gap-4">
                {product?.attributes?.nodes?.find(attr => attr.name === 'pa_size').options.map((size) => (
                  <RadioGroup.Option
                    key={size}
                    value={size}
                    className={({ active, checked }) =>
                      classNames(
                        'cursor-pointer rounded-md p-3 text-sm font-medium focus:outline-none',
                        checked ? 'bg-indigo-600 text-white' : 'bg-white shadow-sm text-gray-900',
                        active ? 'ring-2 ring-indigo-500' : '',
                      )
                    }
                  >
                    <RadioGroup.Label as="span">
                      {size}
                    </RadioGroup.Label>
                  </RadioGroup.Option>
                ))}
              </div>
            </RadioGroup>
          </div>
          )}

          <button
            type="submit"
            className="mt-10 flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Add to bag
          </button>
        </form>
          </div>

          <div className="py-10 lg:col-span-2 lg:col-start-1 lg:border-r lg:border-gray-200 lg:pb-16 lg:pr-8 lg:pt-6">
            {/* Description and details */}
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
                <p className="text-sm text-gray-600">{product.details}</p>
              </div>
            </section>
          </div>




        </div>
      </div>

    </>
  );
}
