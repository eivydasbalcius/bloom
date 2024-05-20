
import React from 'react';


const Sale = () => {

  return (
    <>
      <div aria-hidden="true" className="absolute inset-0">
        <div className="absolute inset-0 mx-auto max-w-7xl overflow-hidden xl:px-8">
          <img
            src="https://tailwindui.com/img/ecommerce-images/home-page-02-sale-full-width.jpg"
            alt=""
            className="h-full w-full object-cover object-center"
          />
        </div>
        <div className="absolute inset-0 bg-white bg-opacity-75" />
        <div className="absolute inset-0 bg-gradient-to-t from-white via-white" />
      </div>

      <section
        aria-labelledby="sale-heading"
        className="relative mx-auto flex max-w-7xl flex-col items-center px-4 py-32 text-center sm:px-6 lg:px-8"
      >
        <div className="mx-auto max-w-2xl lg:max-w-none">
          <h2 id="sale-heading" className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
            Enter your email below and get 15% off your first purchase
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-xl text-gray-600">
            Most of our products are limited releases that won't come back. Get your favorite items while they're in
            stock.
          </p>
          <div className="mt-6 flex flex-row items-center justify-center">
            <div style={{ width: 420 }}>
              <input
                type="email"
                placeholder="Enter your email address"
                className="px-4 p-3 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent text-black" // Modified code: added "text-black" class
              />
            </div>
            <button
              className="ml-4 inline-block rounded-md border border-transparent bg-gray-900 px-8 py-3 font-medium text-white hover:bg-gray-800"
            >
              Submit
            </button>
          </div>
        </div>
      </section>
    </>
  );
};

export default Sale;