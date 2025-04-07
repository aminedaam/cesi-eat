"use client";
import React from "react";
// import { Order } from "@/types/Order";
// import Image from "next/image";
// import { ClientNavigationBar } from "@/components/header_footers/ClientNavigationBar";
// import BaseHeader from "@/components/header_footers/BaseHeader";
// import { Bell, MapPin, ShoppingCart } from "lucide-react";
// import Link from "next/link";

export default function OrderListPage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold mb-4">Mes commandes</h1>
      <p>Aucune commande passée.</p>
    </div>
  );
}

// export default function OrderListPage() {
//   if (orders.length === 0) {
//     return <p>Aucune commande passée.</p>;
//   }

//   return (
//     <div>
//       <BaseHeader>
//         <MapPin />
//         <h1 className="text-white text-2xl font-bold ml-5">Mes commandes</h1>
//         <div className="flex flex-row space-x-3">
//           <Bell />
//           <Link href={"/cart"}>
//             <ShoppingCart />
//           </Link>
//         </div>
//       </BaseHeader>
//       <div className="mt-18 mx-5">
//         <ul className="list-none p-0">
//           {orders.map((order) => (
//             <OrderItem key={order.id} order={order} />
//           ))}
//         </ul>
//       </div>
//       <ClientNavigationBar />
//     </div>
//   );
// }

// interface OrderItemProps {
//   order: Order;
// }

// const OrderItem: React.FC<OrderItemProps> = ({ order }) => (
//   <div className="bg-neutral-100 rounded-lg shadow-md mb-4 flex items-center">
//     {/* Image */}
//     <div className="p-2">
//       <Image
//         src={order.restaurant.image} // Replace with order.image if needed
//         alt={order.restaurant.name} // Replace with order.name if needed
//         width={50} // Adjust size as needed
//         height={50} // Adjust size as needed
//         className="rounded-full object-cover"
//       />
//     </div>

//     {/* Content */}
//     <div className="flex-grow p-4">
//       <div className="flex justify-between items-center">
//         <h2 className="text-lg font-semibold">{order.restaurant.name}</h2>{" "}
//         {/* Adjust data access as needed */}
//         <span className="text-sm text-gray-500">
//           {order.orderDate
//             ?.toLocaleDateString("fr-FR", { day: "2-digit", month: "short" })
//             .toUpperCase()}
//         </span>{" "}
//         {/* Adjust data access as needed */}
//       </div>
//       <div className="flex justify-between items-center">
//         <p className="text-gray-700">
//           {order.items
//             ?.map((item) => `${item.quantity} x ${item.name}`)
//             .join(", ")}
//         </p>{" "}
//         {/* Adjust data access as needed */}
//         <p className="text-gray-700">{order.totalAmount} €</p>{" "}
//       </div>
//       {/* Adjust data access as needed */}
//     </div>
//   </div>
// );
