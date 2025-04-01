"use client";
import React from "react";
import { Order } from "@/types/Order";
import Image from "next/image";
import HeaderButtons from "@/components/header_footers/HeaderButtons";
import { NavigationBar } from "@/components/NavigationBar";

const orders: Order[] = [
  {
    id: 1,
    restaurant: {
      id: 1,
      name: "Bagaaaa",
      deliveryCosts: 4.99,
      image: "/burger.png",
      position: {
        latitude: 43.652777998548956,
        longitude: 1.4394687613763628,
      },
    },
    items: [
      {
        id: 1,
        name: "Burger",
        quantity: 2,
        price: 5.99,
      },
      {
        id: 2,
        name: "Fries",
        quantity: 1,
        price: 2.99,
      },
    ],
    totalAmount: 14.97,
    deliveryAddress: "123 Main St, City, Country",
    orderDate: new Date(),
  },
  {
    id: 2,
    restaurant: {
      id: 2,
      name: "Valentinoo",
      deliveryCosts: 4.99,
      image: "/burger.png",
      position: {
        latitude: 43.60304364458921,
        longitude: 1.4363026245644699,
      },
    },
    items: [
      {
        id: 3,
        name: "Pizza",
        quantity: 1,
        price: 8.99,
      },
      {
        id: 4,
        name: "Soda",
        quantity: 2,
        price: 1.99,
      },
    ],
    totalAmount: 12.97,
    deliveryAddress: "456 Another St, City, Country",
    orderDate: new Date(),
  },
];

export default function OrderListPage() {
  if (orders.length === 0) {
    return <p>Aucune commande passée.</p>;
  }

  return (
    <div>
      <div className="w-full h-16 background-primary items-center justify-between flex fixed top-0 z-50 rounded-b-xl">
        <h1 className="text-white text-2xl font-bold ml-5">Mes commandes</h1>
        <HeaderButtons />
      </div>
      <div className="mt-18 mx-5">
        <ul className="list-none p-0">
          {orders.map((order) => (
            <OrderItem key={order.id} order={order} />
          ))}
        </ul>
      </div>
      <NavigationBar />
    </div>
  );
}

interface OrderItemProps {
  order: Order;
}

const OrderItem: React.FC<OrderItemProps> = ({ order }) => (
  <div className="bg-neutral-100 rounded-lg shadow-md mb-4 flex items-center">
    {/* Image */}
    <div className="p-2">
      <Image
        src={order.restaurant.image} // Replace with order.image if needed
        alt={order.restaurant.name} // Replace with order.name if needed
        width={50} // Adjust size as needed
        height={50} // Adjust size as needed
        className="rounded-full object-cover"
      />
    </div>

    {/* Content */}
    <div className="flex-grow p-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">{order.restaurant.name}</h2>{" "}
        {/* Adjust data access as needed */}
        <span className="text-sm text-gray-500">
          {order.orderDate
            ?.toLocaleDateString("fr-FR", { day: "2-digit", month: "short" })
            .toUpperCase()}
        </span>{" "}
        {/* Adjust data access as needed */}
      </div>
      <div className="flex justify-between items-center">
        <p className="text-gray-700">
          {order.items
            ?.map((item) => `${item.quantity} x ${item.name}`)
            .join(", ")}
        </p>{" "}
        {/* Adjust data access as needed */}
        <p className="text-gray-700">{order.totalAmount} €</p>{" "}
      </div>
      {/* Adjust data access as needed */}
    </div>
  </div>
);
