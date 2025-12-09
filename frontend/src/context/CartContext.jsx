import React, { createContext, useState, useEffect, useContext } from 'react';

// Crear el contexto
const CartContext = createContext();

// Hook personalizado para usar el carrito facilmente
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  // Inicializar estado leyendo localStorage (si existe) o array vacio
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('ekinature_cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // Guardar en localStorage cada vez que el carrito cambie
  useEffect(() => {
    localStorage.setItem('ekinature_cart', JSON.stringify(cart));
  }, [cart]);

  // Funcion: Añadir producto
  const addToCart = (product) => {
    setCart(prevCart => {
      // Verificar si el producto ya esta en el carrito
      const existingItem = prevCart.find(item => item.id === product.id);

      if (existingItem) {
        // Si existe, aumentamos la cantidad
        return prevCart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      // Si no existe, lo agregamos con cantidad 1
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  // FUNCION Restar unidad
  const decreaseQuantity = (productId) => {
    setCart(prevCart => {
      return prevCart.map(item => {
        // Si es el producto y tiene más de 1, restamos
        if (item.id === productId && item.quantity > 1) {
          return { ...item, quantity: item.quantity - 1 };
        }
        return item; // Si tiene 1, no hacemos nada (para eliminar usa el botón borrar)
      });
    });
  };

  // Funcion: Eliminar producto
  const removeFromCart = (productId) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
  };

  // Funcion: Limpiar carrito (al terminar compra)
  const clearCart = () => setCart([]);

  // Calculo de totales
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  const totalPrice = cart.reduce((acc, item) => acc + (item.precio * item.quantity), 0);

  return (
    <CartContext.Provider value={{ 
      cart, 
      addToCart, 
      decreaseQuantity,
      removeFromCart, 
      clearCart, 
      totalItems, 
      totalPrice 
    }}>
      {children}
    </CartContext.Provider>
  );
};