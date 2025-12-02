"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAllProducts } from "@/hooks/lib/UseProduct";
import { useState } from "react";
import PlantCard from "./_components/Plantcard";
import { Filter, X } from "lucide-react";

export default function ShopDesignOnly() {
  const [priceFilter, setPriceFilter] = useState(5000);
  type Category = "Indoor" | "Outdoor" | "Seasonal";
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [page, setPage] = useState(1);
  const limit = 6;

  const { data: allProducts = [] } = useAllProducts();

  const handleCategoryChange = (category: Category) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
    setPage(1);
  };

  const filteredProducts = allProducts.filter((p: any) => {
    const productPrice = parseFloat(p.price) || 0;
    const priceMatch = productPrice <= priceFilter;
    const categoryMatch =
      selectedCategories.length === 0 || selectedCategories.includes(p.category);
    return priceMatch && categoryMatch;
  });

  const totalPages = Math.ceil(filteredProducts.length / limit);
  const startIndex = (page - 1) * limit;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + limit);

  // Filter Sidebar Component
  const FilterSidebar = ({ isMobile = false }) => (
    <div className="space-y-6">
      {/* Price Filter */}
      <div>
        <h2 className="font-bold text-lg mb-2">PRICES</h2>
        <p className="text-sm text-gray-600">₹50 - ₹1000</p>
        <input
          type="range"
          min={50}
          max={5000}
          step={50}
          value={priceFilter}
          onChange={(e) => {
            const newPrice = Number(e.target.value);
            setPriceFilter(newPrice);
            console.log("Price filter changed to:", newPrice);
          }}
          className="w-full mt-3 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
        />
        <p className="text-sm font-semibold text-green-600 mt-2">
          Selected: ₹{priceFilter.toLocaleString()}
        </p>
        <p className="text-xs text-gray-500 mt-1">
          Showing {filteredProducts.length} products
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
    </div>
  );

  return (
    <>
      <Navbar />

      <section className="w-full bg-gradient-to-br from-green-200 via-white to-green-100 py-12">
        <div className="max-w-7xl mx-auto px-4">
          {/* Header Row */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <p className="text-gray-600">
              Showing {filteredProducts.length} results
            </p>

            {/* Mobile Filter Button */}
            <button
              onClick={() => setShowMobileFilters(true)}
              className="lg:hidden flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition w-full sm:w-auto"
            >
              <Filter size={18} />
              Filters
            </button>
          </div>

          {/* Mobile Filter Drawer */}
          {showMobileFilters && (
            <div className="fixed inset-0 z-50 lg:hidden">
              <div
                className="absolute inset-0 bg-black/50"
                onClick={() => setShowMobileFilters(false)}
              />
              <div className="absolute right-0 top-0 h-full w-80 bg-white shadow-xl p-6 overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold">Filters</h2>
                  <button
                    onClick={() => setShowMobileFilters(false)}
                    className="p-2 hover:bg-gray-100 rounded-full"
                  >
                    <X size={24} />
                  </button>
                </div>
                <FilterSidebar isMobile />
              </div>
            </div>
          )}

          <div className="lg:grid lg:grid-cols-12 gap-8">
            {/* Desktop Sidebar */}
            <div className="hidden lg:block lg:col-span-3">
              <FilterSidebar />
            </div>

            {/* Products Grid */}
            <div className="lg:col-span-9">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                {paginatedProducts.map((plant: any) => (
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
              <div className="flex flex-wrap justify-center gap-2 mt-10">
                <button
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                  className="px-4 py-2 border rounded-md disabled:opacity-40 hover:bg-gray-100 min-w-[80px]"
                >
                  Prev
                </button>

                {Array.from({ length: Math.min(totalPages, 5) }).map((_, i) => {
                  const pageNum = i + 1;
                  return (
                    <button
                      key={i}
                      onClick={() => setPage(pageNum)}
                      className={`px-4 py-2 border rounded-md min-w-[44px] ${page === pageNum
                        ? "bg-green-600 text-white"
                        : "hover:bg-gray-100"
                        }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                <button
                  disabled={page === totalPages}
                  onClick={() => setPage(page + 1)}
                  className="px-4 py-2 border rounded-md disabled:opacity-40 hover:bg-gray-100 min-w-[80px]"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
