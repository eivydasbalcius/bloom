const COCART_API_URL = 'http://localhost:10048/wp-json/cocart/v2';

export const addToCart = async (productId: string, quantity: number = 1, attributes: any) => {
    try {
        const response = await fetch(`${COCART_API_URL}/cart/add-item`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id: productId,
                quantity,
                ...attributes,
            }),
        });

        if (!response.ok) {
            throw new Error('Failed to add item to cart');
        }

        return await response.json();
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const getCartContents = async () => {
    try {
        const response = await fetch(`${COCART_API_URL}/cart`);
        if (!response.ok) {
            throw new Error('Failed to fetch cart contents');
        }
        return await response.json();
    } catch (error) {
        console.error(error);
        throw error;
    }
};
