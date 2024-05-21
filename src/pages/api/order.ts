import { NextApiRequest, NextApiResponse } from 'next';
import api from '@/utils/woocommerce';

interface CartItem {
    id: number;
    quantity: number;
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

interface OrderRequest {
    cart: CartItem[];
    customer: Customer;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { cart, customer } = req.body as OrderRequest;

        try {
            const orderData = {
                payment_method: 'cod',
                payment_method_title: 'Cash on Delivery',
                set_paid: true,
                billing: {
                    first_name: customer.firstName,
                    last_name: customer.lastName,
                    address_1: customer.address1,
                    address_2: customer.address2,
                    city: customer.city,
                    state: customer.state,
                    postcode: customer.postcode,
                    country: customer.country,
                    email: customer.email,
                    phone: customer.phone,
                },
                shipping: {
                    first_name: customer.firstName,
                    last_name: customer.lastName,
                    address_1: customer.address1,
                    address_2: customer.address2,
                    city: customer.city,
                    state: customer.state,
                    postcode: customer.postcode,
                    country: customer.country,
                },
                line_items: cart.map(item => ({
                    product_id: item.id,
                    quantity: item.quantity,
                })),
            };

            const response = await api.post('orders', orderData);
            res.status(200).json(response.data);
        } catch (error: any) {
            console.error('Error creating order:', error.response?.data || error.message);
            res.status(500).json({ error: error.response?.data || error.message });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
