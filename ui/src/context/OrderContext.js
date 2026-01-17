import { createContext, useContext, useState } from "react";

const OrderContext = createContext();

export function OrderProvider({ children }) {
  const [orders, setOrders] = useState([]);

  const addOrder = (order) => {
    setOrders(prev => [order, ...prev]);
  };

  const updateOrderStatus = (id, status) => {
    setOrders(prev =>
      prev.map(o =>
        o.id === id ? { ...o, status } : o
      )
    );
  };

  const getOrderById = (id) => {
    return orders.find(o => o.id === Number(id));
  };

  return (
    <OrderContext.Provider
      value={{ orders, addOrder, updateOrderStatus, getOrderById }}
    >
      {children}
    </OrderContext.Provider>
  );
}

export function useOrders() {
  return useContext(OrderContext);
}
