"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

import { useAllProducts } from "@/hooks/lib/UseProduct";
import { useState } from "react";
import PlantCard from "./_components/Plantcard";

export default function ShopDesignOnly() {
  // 🔹 States for filters
  const [priceFilter, setPriceFilter] = useState(5000);
  type Category = "Indoor" | "Outdoor" | "Seasonal";

  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);


  // 🔹 Pagination states
  const [page, setPage] = useState(1);
  const limit = 6;

  // 🔹 Fetch ALL products
  const { data: allProducts = [], isLoading, isError, error } = useAllProducts();

  // 🔹 Handle category selection
  const handleCategoryChange = (category: any) => {
    setSelectedCategories((prev) =>
      prev.includes(category)       // if category already selected?
        ? prev.filter((c) => c !== category)   // remove it
        : [...prev, category]       // else add it
    );
    setPage(1); // Reset to page 1 when filter changes
  };

  // 🔹 Combined Filters (Price + Category)
  const filteredProducts = allProducts.filter((p: any) => {
    // Parse price safely (it might be a string in DB)
    const productPrice = parseFloat(p.price) || 0;
    const priceMatch = productPrice <= priceFilter;

    const categoryMatch =
      selectedCategories.length === 0 || // when "All Plants"
      selectedCategories.includes(p.category);

    return priceMatch && categoryMatch;
  });

  // 🔹 Client-side Pagination
  const totalItems = filteredProducts.length;
  const totalPages = Math.ceil(totalItems / limit);
  const startIndex = (page - 1) * limit;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + limit);

  return (
    <>
      <Navbar />

      <section className="w-full bg-gradient-to-br from-green-200 via-white to-green-100 py-12">

        <div className="max-w-7xl mx-auto px-4">

          {/* Header Row */}
          <div className="flex justify-between items-center mb-8">
            <p className="text-gray-600">
              Showing {filteredProducts.length} results
            </p>

            <div className="flex gap-4">
              <select className="border border-gray-300 p-2 rounded-md">
                <option>Price: Low → High</option>
                <option>Price: High → Low</option>
              </select>

              <select className="border border-gray-300 p-2 rounded-md">
                <option>Show: 6</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-12 gap-8">
            {/* LEFT SIDEBAR */}
            <div className="col-span-3 space-y-10">
              {/* Price Filter */}
              <div>
                <h2 className="font-bold text-lg mb-2">PRICES</h2>
                <p className="text-sm text-gray-600">₹20 - ₹5000</p>

                <input
                  type="range"
                  min={50}
                  max={5000}
                  value={priceFilter}
                  onChange={(e) => setPriceFilter(Number(e.target.value))}
                  className="w-full mt-3"
                />

                <p className="text-sm text-gray-600 mt-2">
                  Selected: ₹{priceFilter}
                </p>
              </div>

              {/* Categories Filter */}
              <div>
                <h2 className="font-bold text-lg mb-2">CATEGORIES</h2>
                <div className="space-y-2 text-gray-700">
                  <label className="flex gap-2 items-center">
                    <input
                      type="checkbox"
                      checked={selectedCategories.length === 0}
                      onChange={() => setSelectedCategories([])}
                    />
                    All Plants
                  </label>

                  <label className="flex gap-2 items-center">
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes("Indoor")}
                      onChange={() => handleCategoryChange("Indoor")}
                    />
                    Indoor Plants
                  </label>

                  <label className="flex gap-2 items-center">
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes("Outdoor")}
                      onChange={() => handleCategoryChange("Outdoor")}
                    />
                    Outdoor Plants
                  </label>

                  <label className="flex gap-2 items-center">
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes("Seasonal")}
                      onChange={() => handleCategoryChange("Seasonal")}
                    />
                    Seasonal Plants
                  </label>
                </div>
              </div>

              {/* Sort */}
              <div>
                <h2 className="font-bold text-lg mb-2">SORT BY</h2>
                <div className="space-y-2 text-gray-700">
                  <p>New Arrivals</p>
                  <p>Price: low to high</p>
                  <p>Price: high to low</p>
                </div>
              </div>
            </div>

            {/* RIGHT SIDE PRODUCTS */}
            <div className="col-span-9">
              <div className="grid grid-cols-3 gap-6 mb-10">
                {paginatedProducts.map((plant) => (
                  <PlantCard
                    key={plant.$id}
                    id={plant.$id}
                    name={plant.name}
                    price={plant.price}
                    imageUrl={plant.imageurl}
                    category={plant.category}
                    season={plant.season}
                    description={plant.desc}
                    isAvailable={plant.isAvailable}
                  />
                ))}
              </div>

              {/* Pagination */}
              <div className="flex justify-center gap-3 mt-10">
                <button
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                  className="px-4 py-2 border rounded-md disabled:opacity-40 hover:bg-gray-100"
                >
                  Prev
                </button>

                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setPage(i + 1)}
                    className={`px-4 py-2 border rounded-md ${page === i + 1
                      ? "bg-green-600 text-white"
                      : "hover:bg-gray-100"
                      }`}
                  >
                    {i + 1}
                  </button>
                ))}

                <button
                  disabled={page === totalPages}
                  onClick={() => setPage(page + 1)}
                  className="px-4 py-2 border rounded-md disabled:opacity-40 hover:bg-gray-100"
                >
                  Next
                </button>
              </div>
            </div>
          </div>

        </div >

      </section >


      <Footer />
    </>
  );
}


