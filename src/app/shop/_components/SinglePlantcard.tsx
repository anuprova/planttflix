// // "use client";

// // import { useCartStore } from "@/hooks/store/cart";
// // import Image from "next/image";
// // import Link from "next/link";

// // interface PlantCardHorizontalProps {
// //   id: string;
// //   name: string;
// //   price: number;
// //   imageUrl: string;
// //   desc: string;
// //   category: string;
// //   onAddToCart?: () => void;
// // }

// // export default function SinglePlantcard({
// //   id,
// //   name,
// //   price,
// //   imageUrl,
// //   desc,
// //   category,
// // }: // onAddToCart,
// // PlantCardHorizontalProps) {
// //   const addToCart = useCartStore((state) => state.addToCart);
// //   return (
// //     <div className="w-full bg-white rounded-2xl shadow-md hover:shadow-lg transition p-4 flex gap-6 items-center">
// //       {/* LEFT — IMAGE */}
// //       <div className="relative w-48 h-48 rounded-xl overflow-hidden flex-shrink-0">
// //         <Image src={imageUrl} alt={name} fill className="object-cover" />
// //       </div>

// //       {/* RIGHT — DETAILS */}
// //       <div className="flex flex-col justify-between flex-grow space-y-2">
// //         <h2 className="text-2xl font-bold text-green-700">{name}</h2>

// //         <p className="text-sm text-gray-500 font-medium">
// //           Category: {category}
// //         </p>

// //         <p className="text-gray-700">{desc}</p>

// //         <p className="text-xl font-semibold text-green-700">₹{price}</p>

// //         <Link href={`/shop/${id}`}>
// //           {/* <button className="w-full mt-3 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700">
// //           Add to Cart
// //         </button> */}
// //           <button
// //             onClick={() =>
// //               addToCart({
// //                 id,
// //                 name,
// //                 price,
// //                 imageUrl,
// //               })
// //             }
// //             className="mt-3 px-4 py-2 bg-green-600 text-white rounded-lg"
// //           >
// //             Add to Cart
// //           </button>
// //         </Link>
// //       </div>
// //     </div>
// //   );
// // }

// // /components/SinglePlantcard.tsx
// "use client";

// import { useCartStore } from "@/hooks/store/cart";
// import Image from "next/image";
// import { useRouter } from "next/navigation";

// interface PlantCardHorizontalProps {
//   id: string;
//   name: string;
//   price: number;
//   imageUrl: string;
//   desc: string;
//   category: string;

//   onAddToCart?: () => void;
// }

// export default function SinglePlantcard({
//   id,
//   name,
//   price,
//   imageUrl,
//   desc,
//   category,
// }: PlantCardHorizontalProps) {
//   const addToCart = useCartStore((state) => state.addToCart);
//   const router = useRouter();

//   const handleAddAndGoCart = () => {
//     addToCart({
//       id,
//       name,
//       price,
//       imageUrl,
//       // include `type` if your store requires it, e.g.:
//       type: typeof category === "string" ? category : "plant",
//     });

//     // navigate to cart page
//     // router.push("/cart");
//   };

//   return (
//     <div className="w-full bg-white rounded-2xl shadow-md hover:shadow-lg transition p-4 flex gap-6 items-center">
//       <div className="relative w-48 h-48 rounded-xl overflow-hidden flex-shrink-0">
//         <Image
//           src={imageUrl}
//           alt={name}
//           width={300}
//           fill
//           sizes="10"
//           height={300}
//           priority
//           loading="eager"
//         />
//       </div>

//       <div className="flex flex-col justify-between flex-grow space-y-2">
//         <h2 className="text-2xl font-bold text-green-700">{name}</h2>
//         <p className="text-sm text-gray-500 font-medium">
//           Category: {category}
//         </p>
//         <p className="text-gray-700">{desc}</p>
//         <p className="text-xl font-semibold text-green-700">₹{price}</p>

//         <button
//           onClick={handleAddAndGoCart}
//           className="mt-3 px-4 py-2 bg-green-600 text-white rounded-lg"
//         >
//           Add to Cart
//         </button>
//       </div>
//     </div>
//   );
// }
