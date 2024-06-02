import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

interface Product {
    productId: number;
    name: string;
    price: number;
    quantity: number;
    image: string;
    attributes: {
        color: string | null;
        size: string | null;
    };
}

interface Customer {
    firstName: string;
    lastName: string;
    address1: string;
    address2?: string;
    city: string;
    state: string;
    postcode: string;
    country: string;
    email: string;
    phone: string;
}

export default function ThankYou() {
    const [products, setProducts] = useState<Product[]>([]);
    const [customer, setCustomer] = useState<Customer | null>(null);
    const router = useRouter();

    useEffect(() => {
        const purchasedProducts = sessionStorage.getItem('purchasedProducts');
        if (purchasedProducts) {
            setProducts(JSON.parse(purchasedProducts));
        }
    }, []);


    useEffect(() => {
        const customerData = sessionStorage.getItem('customerData');
        if (customerData) {
            setCustomer(JSON.parse(customerData));
        }
    }, []);

    const navigateToHome = () => {
        router.push('/');
    };

    return (
        <>
            <div className="relative lg:min-h-full">
                <div className="h-80 overflow-hidden lg:absolute lg:h-full lg:w-1/2 lg:pr-4 xl:pr-12">
                    <img
                        src="https://tailwindui.com/img/ecommerce-images/confirmation-page-06-hero.jpg"
                        alt="TODO"
                        className="h-full w-full object-cover object-center"
                    />
                </div>

                <div>
                    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:grid lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8 lg:py-32 xl:gap-x-24">
                        <div className="lg:col-start-2">
                            <h1 className="text-sm font-medium text-indigo-600">Apmokėjimas sėkmingas</h1>
                            <p className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">Ačiū kad perkate pas mus</p>
                            {/* <p className="mt-2 text-base text-gray-500">
                                We appreciate your order, we’re currently processing it. So hang tight and we’ll send you confirmation
                                very soon!
                            </p> */}

                            <ul
                                role="list"
                                className="mt-6 divide-y divide-gray-200 border-t border-gray-200 text-sm font-medium text-gray-500"
                            >
                                {products.map((product) => (
                                    <li key={product.productId} className="flex space-x-6 py-6">
                                        <img
                                            src={product.image}
                                            alt={product.name}
                                            className="h-24 w-24 flex-none rounded-md bg-gray-100 object-cover object-center"
                                        />
                                        <div className="flex-auto space-y-1">
                                            <h3 className="text-gray-900">{product.name}</h3>
                                            <p>{product.attributes.color}</p>
                                            <p>{product.attributes.size}</p>
                                        </div>
                                        <p className="flex-none font-medium text-gray-900">{product.price} €</p>
                                    </li>
                                ))}
                            </ul>

                            <dl className="space-y-6 border-t border-gray-200 pt-6 text-sm font-medium text-gray-500">
                                <div className="flex justify-between">
                                    <dt>Tarpinė suma</dt>
                                    <dd className="text-gray-900">{products.reduce((acc, product) => acc + product.price * product.quantity, 0).toFixed(2)} €</dd>
                                </div>

                                <div className="flex justify-between">
                                    <dt>Siuntimo išlaidos</dt>
                                    <dd className="text-gray-900">0,00 €</dd>
                                </div>

                                <div className="flex justify-between">
                                    <dt>Mokesčiai</dt>
                                    <dd className="text-gray-900">{(products.reduce((acc, product) => acc + product.price * product.quantity, 0) * 0.092).toFixed(2)} €</dd>
                                </div>

                                <div className="flex items-center justify-between border-t border-gray-200 pt-6 text-gray-900">
                                    <dt className="text-base">Galutinė suma</dt>
                                    <dd className="text-base">{(products.reduce((acc, product) => acc + product.price * product.quantity, 0) * 1.092).toFixed(2)} €</dd>
                                </div>
                            </dl>

                            <dl className="mt-16 grid grid-cols-2 gap-x-4 text-sm text-gray-600">

                                <div>
                                    <dt className="font-medium text-gray-900">Pristatymo informacija</dt>
                                    <dd className="mt-2">
                                        <address className="not-italic">
                                            <span className="block">{customer?.firstName} {customer?.lastName}</span>
                                            <span className="block">{customer?.city}, {customer?.country}</span>
                                            <span className="block">{customer?.address1}</span>
                                            <span className="block">{customer?.phone}</span>
                                        </address>
                                    </dd>
                                </div>
                            </dl>

                            <div className="mt-16 border-t border-gray-200 py-6 text-right">
                                <a href="#"
                                    onClick={navigateToHome}
                                    className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
                                    Grįžti į pagrindinį puslapį
                                    <span aria-hidden="true"> &rarr;</span>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
