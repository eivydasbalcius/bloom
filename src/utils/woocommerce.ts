import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api";

const api = new WooCommerceRestApi({
    url: "https://blueviolet-antelope-713639.hostingersite.com",
    consumerKey: process.env.WC_CONSUMER_KEY!,
    consumerSecret: process.env.WC_CONSUMER_SECRET!,
    version: "wc/v3",
});

export const fetchOrders = async () => {
    try {
        const response = await api.get('orders');
        return response.data;
    } catch (error: any) {
        console.error('Error fetching orders:', error.response?.data || error.message);
        return [];
    }
};

export default api;
