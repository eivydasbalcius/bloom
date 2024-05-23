import React, { Fragment, useState, useEffect } from 'react'
import { Dialog, Disclosure, Menu, Popover, Tab, Transition } from '@headlessui/react'
import { Bars3Icon, MagnifyingGlassIcon, ShoppingCartIcon, UserIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import Image from 'next/image'

const breadcrumbs = [
  { id: 1, name: 'Objects', href: '#' },
  { id: 2, name: 'Workspace', href: '#' },
  { id: 3, name: 'Sale', href: '#' },
]
const sortOptions = [
  { name: 'Most Popular', href: '#', current: true },
  { name: 'Best Rating', href: '#', current: false },
  { name: 'Newest', href: '#', current: false },
  { name: 'Price: Low to High', href: '#', current: false },
  { name: 'Price: High to Low', href: '#', current: false },
]

interface Product {
  id: string;
  name: string;
  price: string;
  slug: string;
  __typename: string;
  image: {
    mediaItemUrl: string;
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

interface FilterOptions {
  categories: string[];
  colors: string[];
  sizes: string[];
}

interface ActiveFilters {
  categories: string[];
  colors: string[];
  sizes: string[];
}

interface AllProductsPageProps {
  products: Product[];
}

const AllProductsPage: React.FC<AllProductsPageProps> = ({ products }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({ categories: [], colors: [], sizes: [] });
  const [activeFilters, setActiveFilters] = useState<ActiveFilters>({
    categories: [],
    colors: [],
    sizes: []
  });
  const [displayedProducts, setDisplayedProducts] = useState<Product[]>([]);

  useEffect(() => {
    const categorySet = new Set<string>();
    const colorSet = new Set<string>();
    const sizeSet = new Set<string>();

    products?.forEach(product => {
      product?.productCategories?.nodes?.forEach(category => categorySet.add(category.name));
      product?.attributes?.nodes?.forEach(attribute => {
        attribute.terms?.nodes?.forEach(term => {
          if (attribute.name === 'pa_color') {
            colorSet.add(term.name);
          } else if (attribute.name === 'pa_size') {
            sizeSet.add(term.name);
          }
        });
      });
    });

    setFilters({
      categories: Array.from(categorySet),
      colors: Array.from(colorSet),
      sizes: Array.from(sizeSet)
    });
  }, [products]);

  function handleFilterChange(filterType: keyof FilterOptions, value: string) {
    setActiveFilters(prev => {
      const currentFilterValues = prev[filterType] || [];
      const isValuePresent = currentFilterValues.includes(value);
      const updatedFilters = isValuePresent
        ? currentFilterValues.filter(v => v !== value)
        : [...currentFilterValues, value];

      return {
        ...prev,
        [filterType]: updatedFilters
      };
    });
  }

  useEffect(() => {
    const filtered = products.filter(product => {
      const isVariableProduct = product.__typename === "VariableProduct";
      if (isVariableProduct) return false; // Exclude VariableProduct

      const categoryMatch = !activeFilters?.categories?.length || product?.productCategories?.nodes?.some(cat => activeFilters.categories.includes(cat.name));
      const colorMatch = !activeFilters?.colors?.length || product?.attributes?.nodes?.some(attr => attr.name === 'pa_color' && attr.terms.nodes.some(term => activeFilters.colors.includes(term.name)));
      const sizeMatch = !activeFilters?.sizes?.length || product?.attributes?.nodes?.some(attr => attr.name === 'pa_size' && attr.terms.nodes.some(term => activeFilters.sizes.includes(term.name)));

      return categoryMatch && colorMatch && sizeMatch;
    });

    console.log('Filtered products:', filtered);
    setDisplayedProducts(filtered);
  }, [products, activeFilters]);

  const filterSections = [
    { id: 'categories', name: 'Kategorijos', options: filters?.categories?.map(cat => ({ value: cat, label: cat, checked: activeFilters.categories.includes(cat) })) },
    { id: 'colors', name: 'Spalvos', options: filters?.colors?.map(color => ({ value: color, label: color, checked: activeFilters.colors.includes(color) })) },
    { id: 'sizes', name: 'Dydžiai', options: filters?.sizes?.map(size => ({ value: size, label: size, checked: activeFilters.sizes.includes(size) })) },
  ];

  function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ');
  }
  return (
    <>
      <div>
        <div className="bg-white">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900"></h1>
            <p className="mt-4 max-w-xl text-sm text-gray-700">
              {/* Our thoughtfully designed workspace objects are crafted in limited runs. Improve your productivity and
              organization with these sale items before we run out. */}
            </p>
          </div>
        </div>

        {/* Filters */}
        <section aria-labelledby="filter-heading">
          <h2 id="filter-heading" className="sr-only">
            Filters
          </h2>

          <div className="border-b border-gray-200 bg-white pb-4">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
              <button
                type="button"
                className="inline-block text-sm font-medium text-gray-700 hover:text-gray-900 sm:hidden"
                onClick={() => setMobileFiltersOpen(true)}
              >
                Filtrai
              </button>

              <div className="hidden sm:block">
                <div className="flow-root">
                  <Popover.Group className="-mx-4 flex items-center divide-x divide-gray-200">
                    {filterSections?.map((section) => (
                      <Popover key={section.id} className="relative inline-block px-4 text-left">
                        <Popover.Button className="group inline-flex justify-center text-sm font-medium text-gray-700 hover:text-gray-900">
                          <span>{section.name}</span>
                          <ChevronDownIcon
                            className="-mr-1 ml-1 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
                            aria-hidden="true"
                          />
                        </Popover.Button>
                        <Transition
                          as={Fragment}
                          enter="transition ease-out duration-100"
                          enterFrom="transform opacity-0 scale-95"
                          enterTo="transform opacity-100 scale-100"
                          leave="transition ease-in duration-75"
                          leaveFrom="transform opacity-100 scale-100"
                          leaveTo="transform opacity-0 scale-95"
                        >
                          <Popover.Panel className="absolute right-0 z-10 mt-2 origin-top-right rounded-md bg-white p-4 shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none">
                            <form className="space-y-4">
                              {section?.options?.map((option, index) => (
                                <div key={index} className="flex items-center">
                                  <input
                                    id={`filter-${section.id}-${index}`}
                                    name={`${section.id}[]`}
                                    value={option.value}
                                    type="checkbox"
                                    checked={option.checked}
                                    onChange={() => handleFilterChange(section.id as keyof FilterOptions, option.value)}
                                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                  />
                                  <label
                                    htmlFor={`filter-${section.id}-${index}`}
                                    className="ml-3 whitespace-nowrap pr-6 text-sm font-medium text-gray-900"
                                  >
                                    {option.label}
                                  </label>
                                </div>
                              ))}
                            </form>
                          </Popover.Panel>
                        </Transition>
                      </Popover>
                    ))}
                  </Popover.Group>
                </div>
              </div>
            </div>
          </div>

          {/* Active filters */}
          <div className="bg-gray-100">
            <div className="mx-auto max-w-7xl px-4 py-3 sm:flex sm:items-center sm:px-6 lg:px-8">
              <h3 className="text-sm font-medium text-gray-500">
                Pasirinkti filtrai:
                <span className="sr-only">, active</span>
              </h3>

              <div className="mt-2 sm:ml-4 sm:mt-0">
                {Object.entries(activeFilters).map(([key, values]) => (
                  (values as string[]).map((value) => (
                    <span
                      key={key + value}
                      className="m-1 inline-flex items-center rounded-full border border-gray-200 bg-white py-1.5 pl-3 pr-2 text-sm font-medium text-gray-900"
                    >
                      {value}
                      <button
                        type="button"
                        className="ml-1 inline-flex h-4 w-4 flex-shrink-0 rounded-full p-1 text-gray-400 hover:bg-gray-200 hover:text-gray-500"
                        onClick={() => handleFilterChange(key as keyof FilterOptions, value)}
                      >
                        <span className="sr-only">Remove filter for {value}</span>
                        <svg className="h-2 w-2" stroke="currentColor" fill="none" viewBox="0 0 8 8">
                          <path strokeLinecap="round" strokeWidth="1.5" d="M1 1l6 6m0-6L1 7" />
                        </svg>
                      </button>
                    </span>
                  ))
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Product grid */}
        <section
          aria-labelledby="products-heading"
          className="mx-auto max-w-2xl px-4 pb-16 pt-12 sm:px-6 sm:pb-24 sm:pt-16 lg:max-w-7xl lg:px-8"
        >
          <h2 id="products-heading" className="sr-only">Products</h2>
          <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
            {displayedProducts.map((product) => (
              product.slug !== "light-brown-bag" && (
                <a key={product.id} href={`/products/${product.slug}`} className="group">
                  <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-gray-200 xl:aspect-w-7 xl:aspect-h-8">
                    <Image
                      src={product?.image?.mediaItemUrl}
                      alt={product?.name}
                      className="h-full w-full object-cover object-center group-hover:opacity-75"
                      width={280}
                      height={320}
                    />
                  </div>
                  <h3 className="mt-4 text-sm text-gray-700">{product.name}</h3>
                  <p className="mt-1 text-lg font-medium text-gray-900">{product.price} €</p>
                </a>
              )
            ))}
          </div>
        </section>
      </div>
    </>
  );
}

export default AllProductsPage;