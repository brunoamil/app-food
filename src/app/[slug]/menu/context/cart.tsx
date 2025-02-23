'use client'
import { Product } from "@prisma/client";
import { createContext, ReactNode, useState } from "react";

export interface CartProduct extends Pick<Product, "id" | "name" | "price" | "imageUrl"> {
  quantity: number;
}
export interface ICartContext {
  isOpen: boolean;
  products: CartProduct[];
  toggleCart: () => void;
  addProduct: (product: CartProduct) => void;
  decreaseProductQuantity: (productId: string) => void
  increaseProductQuantity: (productId: string) => void
  removeProduct: (productId: string) => void
}

export const CartContext = createContext<ICartContext>({
  isOpen: false,
  products: [],
  toggleCart: () => {},
  addProduct: () => {},
  decreaseProductQuantity: () => {},
  increaseProductQuantity: () => {},
  removeProduct: () => {},
});

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState<CartProduct[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const toggleCart = () => [setIsOpen(!isOpen)];
  
  const addProduct = (product: CartProduct) => {
    const productIsAlreadyOnTheCart = products.some((prevProduct) => prevProduct.id === product.id);
    
    if(!productIsAlreadyOnTheCart) {
      return setProducts((prev) => [...prev, product])
    }
    setProducts((prev) => {
      return prev.map((prevProduct) => {
        if(prevProduct.id === product.id) {
          return {
            ...prevProduct,
            quantity: prevProduct.quantity + product.quantity
          }
        }
        return prevProduct
      })
    })
  }

  const decreaseProductQuantity = (productId: string) => {
    setProducts((prev) => {
      return prev.map((prevProduct) => {
        if(prevProduct.id !== productId) {
          return prevProduct
        }
       
          if(prevProduct.quantity === 1) {
            return prevProduct
          }
          return {...prevProduct, quantity: prevProduct.quantity - 1}
      
      })
    })
  }

  const increaseProductQuantity = (productId: string) => { 
    setProducts((prevProduct) => {
      return prevProduct.map((prev) => {
        if(prev.id !== productId) {
          return prev;
        }
        return {...prev, quantity: prev.quantity + 1}
      })
    })
  }

  const removeProduct = (productId: string) => {
    setProducts((prevProduct) => prevProduct.filter((prev) => prev.id !== productId))
  }

  return (
    <CartContext.Provider
      value={{
        isOpen,
        products,
        toggleCart,
        addProduct,
        decreaseProductQuantity,
        increaseProductQuantity,
        removeProduct,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
