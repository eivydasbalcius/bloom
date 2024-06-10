import React, { useState, useEffect } from 'react';
import { CheckIcon, ClockIcon, QuestionMarkCircleIcon, XMarkIcon as XMarkIconMini } from '@heroicons/react/20/solid';
import Image from 'next/image';
import { useProductData } from "../context/ProductDataContext";
import { useRouter } from 'next/router';
import Link from 'next/link';

interface CartItem {
  productId: number;
  quantity: number;
  price: number;
  image: string;
  name: string;
  attributes: {
    color: string | null;
    size: string | null;
  };
}
interface MediaItem {
  __typename: string;
  slug: string;
  mediaItemUrl: string;
}

interface ProductTag {
  __typename: string;
  name: string;
  slug: string;
}

interface ProductCategory {
  __typename: string;
  id: string;
  name: string;
  slug: string;
  parentId: string | null;
  image: MediaItem | null;
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
    nodes: ProductTag[];
  };
  productCategories: {
    __typename: string;
    nodes: ProductCategory[];
  };
  attributes: {
    __typename: string;
    nodes: Attribute[] | null;
  };
}

export default function ShoppingCart() {
  const { products } = useProductData();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [subtotal, setSubtotal] = useState(0);
  const [taxes, setTaxes] = useState(0);
  const [total, setTotal] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const router = useRouter();

  useEffect(() => {
    const cartData = sessionStorage.getItem('cart');
    const parsedCartData: CartItem[] = cartData ? JSON.parse(cartData) : [];
    setCart(parsedCartData);
    recalculateTotals(parsedCartData);
  }, []);

  const recalculateTotals = (cart: CartItem[]) => {
    const subTotal = cart.reduce((acc: number, item: CartItem) => acc + item.price * item.quantity, 0);
    const tax = subTotal * 0.092;
    const totalAmount = subTotal + tax;
    const quantity = cart.reduce((acc: number, item: CartItem) => acc + item.quantity, 0);

    setSubtotal(parseFloat(subTotal.toFixed(2)));
    setTaxes(parseFloat(tax.toFixed(2)));
    setTotal(parseFloat(totalAmount.toFixed(2)));
    setQuantity(quantity);
  };

  const handleQuantityChange = (index: number, quantity: number) => {
    const updatedCart = cart.map((item, i) =>
      i === index ? { ...item, quantity } : item
    );
    setCart(updatedCart);
    sessionStorage.setItem('cart', JSON.stringify(updatedCart));

    // Recalculate totals
    recalculateTotals(updatedCart);

    // Dispatch custom event to update cart quantity in Header
    const event = new CustomEvent('cart-updated');
    window.dispatchEvent(event);
  };

  const handleRemoveItem = (index: number) => {
    const updatedCart = cart.filter((_, i) => i !== index);
    setCart(updatedCart);
    sessionStorage.setItem('cart', JSON.stringify(updatedCart));
    recalculateTotals(updatedCart);
  };

  const trendingProducts: Product[] = products.filter((product: Product) =>
    product?.productTags?.nodes.some(tag => tag.slug.toLowerCase() === 'trending-cart')
  );

  const handleCheckoutButtonClick = (e: React.MouseEvent) => {
    e.preventDefault();
    router.push('/checkout');

  };

  return (
    <>
      <div className="mx-auto max-w-2xl px-4 pb-24 pt-16 sm:px-6 lg:max-w-7xl lg:px-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Jūsų pirkinių krepšelis</h1>

        <form className="mt-12 lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12 xl:gap-x-16">
          <section aria-labelledby="cart-heading" className="lg:col-span-7">
            <h2 id="cart-heading" className="sr-only">
              Krepšelyje esančios prekės
            </h2>

            <ul role="list" className="divide-y divide-gray-200 border-b border-t border-gray-200">
              {cart.map((product, productIdx) => (
                <li key={product.productId} className="flex py-6 sm:py-10">
                  <div className="flex-shrink-0">
                    <Image
                      src={product.image}
                      alt={product.name}
                      className="h-24 w-24 rounded-md object-cover object-center sm:h-48 sm:w-48"
                      width={192}
                      height={192}
                    />
                  </div>

                  <div className="ml-4 flex flex-1 flex-col justify-between sm:ml-6">
                    <div className="relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0">
                      <div>
                        <div className="flex justify-between">
                          <h3 className="text-sm">
                            <Link href="#" className="font-medium text-gray-700 hover:text-gray-800">
                              {product.name}
                            </Link>
                          </h3>
                        </div>
                        <div className="mt-1 flex text-sm">
                          <p className="text-gray-500">{product.attributes.color}</p>
                          {product.attributes.size ? (
                            <p className="ml-4 border-l border-gray-200 pl-4 text-gray-500">{product.attributes.size}</p>
                          ) : null}
                        </div>
                        <p className="mt-1 text-sm font-medium text-gray-900">{product.price} €</p>
                      </div>

                      <div className="mt-4 sm:mt-0 sm:pr-9">
                        <label htmlFor={`quantity-${productIdx}`} className="sr-only">
                          Kiekis, {product.name}
                        </label>
                        <select
                          id={`quantity-${productIdx}`}
                          name={`quantity-${productIdx}`}
                          value={product.quantity}
                          onChange={(e) => handleQuantityChange(productIdx, parseInt(e.target.value))}
                          className="max-w-full rounded-md border border-gray-300 py-1.5 text-left text-base font-medium leading-5 text-gray-700 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
                        >
                          {[...Array(10)].map((_, i) => (
                            <option key={i} value={i + 1}>{i + 1}</option>
                          ))}
                        </select>

                        <div className="absolute right-0 top-0">
                          <button type="button" className="-m-2 inline-flex p-2 text-gray-400 hover:text-gray-500" onClick={() => handleRemoveItem(productIdx)}>
                            <span className="sr-only">Ištrinti</span>
                            <XMarkIconMini className="h-5 w-5" aria-hidden="true" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* <p className="mt-4 flex space-x-2 text-sm text-gray-700">
                      {product.inStock ? (
                        <CheckIcon className="h-5 w-5 flex-shrink-0 text-green-500" aria-hidden="true" />
                      ) : (
                        <ClockIcon className="h-5 w-5 flex-shrink-0 text-gray-300" aria-hidden="true" />
                      )}

                      <span>{product.inStock ? 'In stock' : `Ships in ${product.leadTime}`}</span>
                    </p> */}
                  </div>
                </li>
              ))}
            </ul>
          </section>

          {/* Order summary */}
          <section
            aria-labelledby="summary-heading"
            className="mt-16 rounded-lg bg-gray-50 px-4 py-6 sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8"
          >
            <h2 id="summary-heading" className="text-lg font-medium text-gray-900">
              Užsakymo santrauka
            </h2>

            <dl className="mt-6 space-y-4">
              <div className="flex items-center justify-between">
                <dt className="text-sm text-gray-600">Produktų kaina x{quantity}</dt>
                <dd className="text-sm font-medium text-gray-900">{subtotal} €</dd>
              </div>
              <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                <dt className="flex text-sm text-gray-600">
                  <span>Mokesčiai</span>
                  <Link href="#" className="ml-2 flex-shrink-0 text-gray-400 hover:text-gray-500">
                    <span className="sr-only">Learn more about how tax is calculated</span>
                    <QuestionMarkCircleIcon className="h-5 w-5" aria-hidden="true" />
                  </Link>
                </dt>
                <dd className="text-sm font-medium text-gray-900">{taxes} €</dd>
              </div>
              <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                <dt className="text-base font-medium text-gray-900">Galutinė suma</dt>
                <dd className="text-base font-medium text-gray-900">{total} €</dd>
              </div>
            </dl>

            <div className="mt-6">
              <button
                onClick={handleCheckoutButtonClick}
                type="submit"
                className="w-full rounded-md border border-transparent bg-indigo-600 px-4 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50"
              >
                Tęsti apsipirkimą
              </button>
            </div>
          </section>
        </form>

        {/* Related products */}
        <section aria-labelledby="related-heading" className="mt-24">
          <h2 id="related-heading" className="text-lg font-medium text-gray-900">
            Žmonės taip pat perka
          </h2>

          <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
            {trendingProducts?.map((product: Product) => (
              <div key={product.id} className="group relative">
                <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md lg:aspect-none group-hover:opacity-75 lg:h-80">
                  <Image
                    src={product.image?.mediaItemUrl}
                    alt={product.image?.slug}
                    className="h-full w-full object-cover object-center lg:h-full lg:w-full"
                    width={280}
                    height={380}
                  />
                </div>
                <div className="mt-4 flex justify-between">
                  <div>
                    <h3 className="text-sm text-gray-700">
                      <Link href={`/products/${product.slug}`}>
                        <span aria-hidden="true" className="absolute inset-0" />
                        {product.name}
                      </Link>
                    </h3>
                  </div>
                  <p className="text-sm font-medium text-gray-900">{product.price} €</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
