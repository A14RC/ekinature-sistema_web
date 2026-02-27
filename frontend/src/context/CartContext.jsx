import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState(() => {
        const savedCart = localStorage.getItem('ekinature_cart');
        return savedCart ? JSON.parse(savedCart) : [];
    });

    useEffect(() => {
        localStorage.setItem('ekinature_cart', JSON.stringify(cart));
    }, [cart]);

    const addToCart = (product) => {
        setCart(prevCart => {
            const exists = prevCart.find(item => item.id === product.id);
            if (exists) {
                return prevCart.map(item =>
                    item.id === product.id ? { ...item, cantidad: item.cantidad + 1 } : item
                );
            }
            return [...prevCart, { ...product, cantidad: 1 }];
        });
    };

    const updateQuantity = (id, delta, stockLimit) => {
        setCart(prevCart => prevCart.map(item => {
            if (item.id === id) {
                const nuevaCantidad = item.cantidad + delta;
                if (nuevaCantidad > 0 && nuevaCantidad <= stockLimit) {
                    return { ...item, cantidad: nuevaCantidad };
                }
            }
            return item;
        }));
    };

    const removeFromCart = (id) => {
        setCart(prevCart => prevCart.filter(item => item.id !== id));
    };

    const clearCart = () => setCart([]);

    return (
        <CartContext.Provider value={{ cart, addToCart, updateQuantity, removeFromCart, clearCart }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);