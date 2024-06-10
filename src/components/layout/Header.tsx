"use client";

import React, { Fragment, useState, useEffect } from 'react';
import { useSession, signIn, signOut } from "next-auth/react";
import { Dialog, Popover, Tab, Transition } from '@headlessui/react';
import { Bars3Icon, MagnifyingGlassIcon, ShoppingCartIcon, UserIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import Image from 'next/image';
import { useProductData } from '@/context/ProductDataContext';
import { useRouter } from 'next/router';
import logo from "../../../public/bloom.jpeg";
import Link from 'next/link';

const currencies = ['EUR', 'CAD', 'USD', 'AUD', 'GBP'];

interface Category {
  __typename: string;
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  children: {
    __typename: string;
    nodes: SubCategory[];
  };
}

interface SubCategory {
  __typename: string;
  id: string;
  name: string;
  slug: string;
  image: string | null;
}

const Header: React.FC = () => {
  const { categories } = useProductData();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartQuantity, setCartQuantity] = useState(0);
  const router = useRouter();
  const { data: session } = useSession();

  useEffect(() => {
    const getCartQuantity = () => {
      const cart = JSON.parse(sessionStorage.getItem('cart') || '[]');
      const totalQuantity = cart.reduce((total: number, item: { quantity: number }) => total + item.quantity, 0);
      setCartQuantity(totalQuantity);
    };

    getCartQuantity();

    const handleCartUpdate = () => {
      getCartQuantity();
    };

    window.addEventListener('cart-updated', handleCartUpdate);

    return () => {
      window.removeEventListener('cart-updated', handleCartUpdate);
    };
  }, []);

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    router.push('/');
  }

  const handleCheckoutClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (session) {
      router.push('/cart');
    } else {
      router.push('/auth/signin');
    }
  };

  function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ');
  }

  useEffect(() => {
    console.log('Categories:', categories);
  }, [categories]);

  return (
    <>
      <Transition.Root show={mobileMenuOpen} as={Fragment}>
        <Dialog as="div" className="relative z-40 lg:hidden" onClose={setMobileMenuOpen}>
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 z-40 flex">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <Dialog.Panel className="relative flex w-full max-w-xs flex-col overflow-y-auto bg-white pb-12 shadow-xl">
                <div className="flex px-4 pb-2 pt-5">
                  <button
                    type="button"
                    className="-m-2 inline-flex items-center justify-center rounded-md p-2 text-gray-400"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span className="sr-only">Close menu</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>

                <Tab.Group as="div" className="mt-2">
                  <div className="border-b border-gray-200">
                    <Tab.List className="-mb-px flex space-x-8 px-4">
                      {categories.map((category: Category) => (
                        <Tab
                          key={category.name}
                          className={({ selected }) =>
                            classNames(
                              selected ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-900',
                              'flex-1 whitespace-nowrap border-b-2 px-1 py-4 text-base font-medium'
                            )
                          }
                        >
                          {category.name}
                        </Tab>
                      ))}
                    </Tab.List>
                  </div>
                  <Tab.Panels as={Fragment}>
                    {categories.map((category: Category, categoryIdx: number) => (
                      <Tab.Panel key={category.name} className="space-y-12 px-4 pb-6 pt-10">
                        <div className="grid grid-cols-1 items-start gap-x-6 gap-y-10">
                          <div className="grid grid-cols-1 gap-x-6 gap-y-10">
                            <div>
                              <p id={`mobile-featured-heading-${categoryIdx}`} className="font-medium text-gray-900">
                                Featured
                              </p>
                              <ul
                                role="list"
                                aria-labelledby={`mobile-featured-heading-${categoryIdx}`}
                                className="mt-6 space-y-6"
                              >
                                {category.children.nodes.map((item) => (
                                  <li key={item.name} className="flex">
                                    <Link href={item.slug} className="text-gray-500">
                                      {item.name}
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      </Tab.Panel>
                    ))}
                  </Tab.Panels>
                </Tab.Group>

                {/* <div className="space-y-6 border-t border-gray-200 px-4 py-6">
                  {navigation.pages.map((page) => (
                    <div key={page.name} className="flow-root">
                      <Link href={page.href} className="-m-2 block p-2 font-medium text-gray-900">
                        {page.name}
                      </Link>
                    </div>
                  ))}
                </div> */}

                <div className="space-y-6 border-t border-gray-200 px-4 py-6">
                  {/* <div className="flow-root">
                    <Link href="#" className="-m-2 block p-2 font-medium text-gray-900">
                      Create an account
                    </Link>
                  </div> */}
                  <div className="flow-root">
                    {session ? (

                      <button onClick={() => signOut()} className="-m-2 block p-2 font-medium text-gray-900">
                        Atsijungti
                      </button>

                    ) : (
                      <Link href="/auth/signin" className="-m-2 block p-2 font-medium text-gray-900">
                        Prisijungti
                      </Link>
                    )}
                  </div>
                </div>

                <div className="space-y-6 border-t border-gray-200 px-4 py-6">
                  <form>
                    <div className="inline-block">
                      <label htmlFor="mobile-currency" className="sr-only">
                        Currency
                      </label>
                      <div className="group relative -ml-2 rounded-md border-transparent focus-within:ring-2 focus-within:ring-white">
                        <select
                          id="mobile-currency"
                          name="currency"
                          className="flex items-center rounded-md border-transparent bg-none py-0.5 pl-2 pr-5 text-sm font-medium text-gray-700 focus:border-transparent focus:outline-none focus:ring-0 group-hover:text-gray-800"
                        >
                          {currencies.map((currency) => (
                            <option key={currency}>{currency}</option>
                          ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center">
                          <ChevronDownIcon className="h-5 w-5 text-gray-500" aria-hidden="true" />
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>
      <header className="relative z-10">
        <nav aria-label="Top">
          <div className="bg-gray-900">
            <div className="mx-auto flex h-10 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
              <form className="hidden lg:block lg:flex-1">
                <div className="flex">
                  <label htmlFor="desktop-currency" className="sr-only">
                    Valiutos
                  </label>
                  <div className="group relative -ml-2 rounded-md border-transparent bg-gray-900 focus-within:ring-2 focus-within:ring-white">
                    <select
                      id="desktop-currency"
                      name="currency"
                      className="flex items-center rounded-md border-transparent bg-gray-900 bg-none py-0.5 pl-2 pr-5 text-sm font-medium text-white focus:border-transparent focus:outline-none focus:ring-0 group-hover:text-gray-100"
                    >
                      {currencies.map((currency) => (
                        <option key={currency}>{currency}</option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center">
                      <ChevronDownIcon className="h-5 w-5 text-gray-300" aria-hidden="true" />
                    </div>
                  </div>
                </div>
              </form>

              <p className="flex-1 text-center text-sm font-medium text-white lg:flex-none">
                *Nemokamas pristatymas nuo 50€
              </p>

              <div className="hidden lg:flex lg:flex-1 lg:items-center lg:justify-end lg:space-x-6">
                {session ? (
                  <button onClick={() => signOut()} className="text-sm font-medium text-white hover:text-gray-100">
                    Atsijungti
                  </button>
                ) : (
                  <Link href="/auth/signin" className="text-sm font-medium text-white hover:text-gray-100">
                    Prisijungti
                  </Link>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white">
            <div className="border-b border-gray-200">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                  <div className="hidden lg:flex lg:items-center">
                    <Link href="/">
                      <div onClick={handleLogoClick}>
                        <span className="sr-only">Your Company</span>
                        <Image
                          className="h-8 w-auto cursor-pointer"
                          src={logo}
                          alt=""
                          width={100}
                          height={100}
                        />
                      </div>
                    </Link>
                  </div>

                  <div className="hidden h-full lg:flex">
                    <Popover.Group className="ml-8">
                      <div className="flex h-full space-x-8">
                        {categories.map((category: Category) => (
                          <Popover key={category.id} className="flex">
                            {({ open }) => (
                              <>
                                <div className="relative flex">
                                  <Popover.Button
                                    className={classNames(
                                      open ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-700 hover:text-gray-800',
                                      'relative z-10 -mb-px flex items-center border-b-2 pt-px text-sm font-medium transition-colors duration-200 ease-out'
                                    )}
                                  >
                                    {category.name}
                                  </Popover.Button>
                                </div>

                                <Transition
                                  as={Fragment}
                                  enter="transition ease-out duration-200"
                                  enterFrom="opacity-0"
                                  enterTo="opacity-100"
                                  leave="transition ease-in duration-150"
                                  leaveFrom="opacity-100"
                                  leaveTo="opacity-0"
                                >
                                  <Popover.Panel className="absolute inset-x-0 top-full text-gray-500 sm:text-sm">
                                    <div className="absolute inset-0 top-1/2 bg-white shadow" aria-hidden="true" />
                                    <div className="relative bg-white">
                                      <div className="mx-auto max-w-7xl px-8">
                                        <div className="grid grid-cols-2 items-start gap-x-8 gap-y-10 pb-12 pt-10">
                                          <div className="grid grid-cols-2 gap-x-8 gap-y-10">
                                            <div>
                                              <p id={`desktop-featured-heading-${category.id}`} className="font-medium text-gray-900">
                                                Kategorijos
                                              </p>
                                              <ul role="list" aria-labelledby={`desktop-featured-heading-${category.id}`} className="mt-6 space-y-6 sm:mt-4 sm:space-y-4">
                                                {category.children.nodes.map((subCategory) => (
                                                  <li key={subCategory.id} className="flex">
                                                    <Link href="#" className="hover:text-gray-800">
                                                      {subCategory.name}
                                                    </Link>
                                                  </li>
                                                ))}
                                              </ul>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </Popover.Panel>
                                </Transition>
                              </>
                            )}
                          </Popover>
                        ))}
                      </div>
                    </Popover.Group>
                  </div>

                  <div className="flex flex-1 items-center lg:hidden">
                    <button
                      type="button"
                      className="-ml-2 rounded-md bg-white p-2 text-gray-400"
                      onClick={() => setMobileMenuOpen(true)}
                    >
                      <span className="sr-only">Open menu</span>
                      <Bars3Icon className="h-6 w-6" aria-hidden="true" />
                    </button>
                    <Link href="#" className="ml-2 p-2 text-gray-400 hover:text-gray-500">
                      <span className="sr-only">Search</span>
                      <MagnifyingGlassIcon className="h-6 w-6" aria-hidden="true" />
                    </Link>
                  </div>

                  <Link href="/">
                    <div onClick={handleLogoClick} className="lg:hidden">
                      <span className="sr-only">Your Company</span>
                      <Image
                        src={logo}
                        alt=""
                        className="h-8 w-auto"
                        width={100}
                        height={100}
                      />
                    </div>
                  </Link>

                  <div className="flex flex-1 items-center justify-end">
                    <div className="flex items-center lg:ml-8">
                      <div className="flex space-x-8 items-center">
                        {/* <div className="hidden lg:flex">
                          <Link href="#" className="-m-2 p-2 text-gray-400 hover:text-gray-500">
                            <span className="sr-only">Search</span>
                            <MagnifyingGlassIcon className="h-6 w-6" aria-hidden="true" />
                          </Link>
                        </div> */}

                        <div className="flex ">
                          {session?.user?.image ?
                            (<Image src={session.user.image} alt={session?.user?.name ?? ""} className="h-8 w-8 rounded-full cursor-pointer" width={32} height={32} />)
                            :
                            (<Link href="/auth/signin" className="-m-2 p-2 text-gray-400 hover:text-gray-500">
                              <span className="sr-only">Account</span>
                              <UserIcon className="h-6 w-6 cursor-pointer" aria-hidden="true" />
                            </Link>)}
                        </div>
                      </div>

                      <span className="mx-4 h-6 w-px bg-gray-200 lg:mx-6" aria-hidden="true" />

                      <div className="flow-root">
                        <Link href={session ? "/cart" : "/auth/signin"}>
                          <div onClick={handleCheckoutClick} className="group -m-2 flex items-center p-2">
                            <ShoppingCartIcon
                              className="h-6 w-6 flex-shrink-0 text-gray-400 group-hover:text-gray-500 cursor-pointer"
                              aria-hidden="true"
                            />
                            <span className="ml-2 text-sm font-medium text-gray-700 group-hover:text-gray-800">{cartQuantity}</span>
                            <span className="sr-only">items in cart, view bag</span>
                          </div>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </nav>
      </header >
    </>
  );
};

export default Header;
