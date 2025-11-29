// // src/app/(shop)/shop/components/PlantCard.tsx
// "use client";
// import Link from "next/link";
// import Image from "next/image";
// import type { Plant } from "@/lib/types";

// type Props = {
//   plant: Plant;
// };

// const PLACEHOLDER = "/mnt/data/Shop .png"; // local uploaded file path (fallback)

// export default function PlantCard({ plant }: Props) {
//   const imageUrl = plant.image ?? PLACEHOLDER;

//   return (
//     <div className="bg-white shadow-sm rounded-md overflow-hidden">
//       <Link href={`/shop/${plant.$id}`} className="block">
//         <div className="relative h-56 w-full">
//           {/* next/image can error if external domains not configured; use simple img as fallback */}
//           {/* If you prefer next/image, configure domains in next.config.js */}
//           {/* <Image src={imageUrl} alt={plant.name} fill className="object-contain p-6" /> */}
//           <Image
//             src={imageUrl}
//             alt={plant.name}
//             className="h-56 w-full object-contain bg-gray-50 p-6"
//           />
//         </div>
//       </Link>

//       <div className="p-4">
//         <h3 className="text-sm font-medium text-gray-800">{plant.name}</h3>
//         <p className="text-sm text-gray-500 mt-1">{plant.category}</p>
//         <div className="mt-3 flex items-center justify-between">
//           <div className="text-lg font-semibold text-green-700">${plant.price?.toFixed(2)}</div>
//           {plant.isAvailable ? (
//             <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded">In stock</span>
//           ) : (
//             <span className="text-xs text-red-600 bg-red-100 px-2 py-1 rounded">Out of stock</span>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

import React from 'react'

const Plantcard = () => {
  return (
    <div>
      
    </div>
  )
}

export default Plantcard
