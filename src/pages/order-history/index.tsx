import { GetStaticProps, GetServerSideProps } from 'next';
import React from 'react';
import { getSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { fetchOrders } from '../../utils/woocommerce';
import { useProductData } from '../../context/ProductDataContext';


export interface OrderItem {
    id: number;
    productId: number;
    name: string;
    price: string;
    imageSrc: string;
    imageAlt: string;
    status: string;
}

export interface Order {
    id: number;
    number: string;
    date_created: string;
    total: string;
    currency: string;
    status: string;
    line_items: OrderItem[];
    payment_url: string;
}

interface OrderHistoryProps {
    orders: Order[];
}

const OrderHistory: React.FC<OrderHistoryProps> = ({ orders }) => {

    const { products } = useProductData();
    const router = useRouter();

    const findProductSlugById = (id: number): string | null => {
        const product = products.find((product: any) => product.databaseId === id);
        return product ? product.slug : null;
    };

    const handleViewProduct = (productId: number) => {
        const slug = findProductSlugById(productId);
        if (slug) {
            router.push(`/products/${slug}`);

        } else {
            console.error('Product slug not found');
        }
    };

    return (
        <div className="bg-white">
            <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:pb-24">
                <div className="max-w-xl">
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">Tavo užsakymai</h1>
                </div>

                <div className="mt-16">
                    <h2 className="sr-only">Naujausi užsakymai</h2>

                    <div className="space-y-20">
                        {orders.map((order) => (
                            <div key={order.number}>
                                <h3 className="sr-only">
                                    Užsakymo data <time dateTime={order.date_created}>{new Date(order.date_created).toLocaleDateString()}</time>
                                </h3>

                                <div className="rounded-lg bg-gray-50 px-4 py-6 sm:flex sm:items-center sm:justify-between sm:space-x-6 sm:px-6 lg:space-x-8">
                                    <dl className="flex-auto space-y-6 divide-y divide-gray-200 text-sm text-gray-600 sm:grid sm:grid-cols-3 sm:gap-x-6 sm:space-y-0 sm:divide-y-0 lg:w-1/2 lg:flex-none lg:gap-x-8">
                                        <div className="flex justify-between sm:block">
                                            <dt className="font-medium text-gray-900">Užsakymo data</dt>
                                            <dd className="sm:mt-1">
                                                <time dateTime={order.date_created}>{new Date(order.date_created).toLocaleDateString()}</time>
                                            </dd>
                                        </div>
                                        <div className="flex justify-between pt-6 sm:block sm:pt-0">
                                            <dt className="font-medium text-gray-900">Užsakymo numeris</dt>
                                            <dd className="sm:mt-1">{order.number}</dd>
                                        </div>
                                        <div className="flex justify-between pt-6 font-medium text-gray-900 sm:block sm:pt-0">
                                            <dt>Galutinė kaina</dt>
                                            <dd className="sm:mt-1">{order.total} {order.currency}</dd>
                                        </div>
                                    </dl>
                                    {/* <a
                                        href={order.payment_url}
                                        className="mt-6 flex w-full items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:w-auto"
                                    >
                                        Sąskaita faktūra
                                        <span className="sr-only">užsakymui {order.number}</span>
                                    </a> */}
                                </div>

                                <table className="mt-4 w-full text-gray-500 sm:mt-6">
                                    <caption className="sr-only">Prekės</caption>
                                    <thead className="sr-only text-left text-sm text-gray-500 sm:not-sr-only">
                                        <tr>
                                            <th scope="col" className="py-3 pr-8 font-normal sm:w-2/5 lg:w-1/3">
                                                Prekės
                                            </th>
                                            <th scope="col" className="hidden w-1/5 py-3 pr-8 font-normal sm:table-cell">
                                                Kaina
                                            </th>
                                            <th scope="col" className="hidden py-3 pr-8 font-normal sm:table-cell">
                                                Užsakymo statusas
                                            </th>
                                            <th scope="col" className="w-0 py-3 text-right font-normal">
                                                Inforamcija
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 border-b border-gray-200 text-sm sm:border-t">
                                        {order?.line_items.map((product) => (
                                            <tr key={product?.id}>
                                                <td className="py-6 pr-8">
                                                    <div className="flex items-center">
                                                        <img
                                                            src={product?.imageSrc}
                                                            alt={product?.imageAlt}
                                                            className="mr-6 h-16 w-16 rounded object-cover object-center"
                                                        />
                                                        <div>
                                                            <div className="font-medium text-gray-900">{product?.name}</div>
                                                            <div className="mt-1 sm:hidden">{product?.price}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="hidden py-6 pr-8 sm:table-cell">{product?.price}</td>
                                                <td className="hidden py-6 pr-8 sm:table-cell">{order.status}</td>
                                                <td className="whitespace-nowrap py-6 text-right font-medium">
                                                    <a onClick={() => handleViewProduct(product?.productId)} className="text-indigo-600">
                                                        Peržiūrėti<span className="hidden lg:inline"> prekę</span>
                                                        <span className="sr-only">, {product?.name}</span>
                                                    </a>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export const getStaticProps: GetStaticProps = async () => {
    const allOrders = await fetchOrders();

    const formattedOrders = allOrders.map((order: any) => ({
        id: order.id,
        number: order.number,
        date_created: order.date_created,
        total: order.total,
        currency: order.currency_symbol,
        status: order.status,
        line_items: order.line_items.map((item: any) => ({
            id: item.id,
            productId: item.product_id,
            name: item.name,
            price: `${item.price} €`,
            imageSrc: item.image.src,
            imageAlt: item.name,
            status: order.status,
        })),
        payment_url: order.payment_url,
    }));

    return {
        props: {
            orders: formattedOrders,
        },
        revalidate: 10,
    };
};

export default OrderHistory;
