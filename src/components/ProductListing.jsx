import React, { useEffect, useState } from 'react';

const categories = ['smartphones', 'laptops', 'fragrances', 'skincare', 'groceries', 'home-decoration'];

export default function ProductListing() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [maxPrice, setMaxPrice] = useState(1000);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const productsPerPage = 9;

  useEffect(() => {
    fetch('https://dummyjson.com/products')
      .then(res => res.json())
      .then(data => {
        setProducts(data.products);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    filterProducts();
  }, [products, selectedCategories, maxPrice, searchTerm, page]);

  const filterProducts = () => {
    let filtered = [...products];

    if (selectedCategories.length > 0) {
      filtered = filtered.filter(p => selectedCategories.includes(p.category));
    }

    filtered = filtered.filter(p => p.price <= maxPrice);

    if (searchTerm) {
      filtered = filtered.filter(p =>
        p.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredProducts(filtered);
  };

  const handleCategoryChange = (category) => {
    setPage(1);
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const handlePriceChange = (e) => {
    setPage(1);
    setMaxPrice(Number(e.target.value));
  };

  const handleSearch = (e) => {
    setPage(1);
    setSearchTerm(e.target.value);
  };

  const startIndex = (page - 1) * productsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + productsPerPage);

  return (
<div className="p-6 max-w-7xl mx-auto">
  <h1 className="text-3xl font-extrabold mb-6 text-gray-800">Product Listing</h1>

  <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-6">
    {/* Sidebar */}
    <div className="space-y-4">
      <h2 className="font-semibold text-lg text-gray-700">Search</h2>
      <input
        type="text"
        placeholder="Search products..."
        onChange={handleSearch}
        className="border border-gray-300 px-4 py-2 rounded-md w-full focus:ring-2 focus:ring-blue-500 focus:outline-none"
      />

      <h2 className="font-semibold text-lg text-gray-700 mt-6">Categories</h2>
      {categories.map(category => (
        <label key={category} className="block text-gray-600">
          <input
            type="checkbox"
            checked={selectedCategories.includes(category)}
            onChange={() => handleCategoryChange(category)}
            className="mr-2"
          />
          {category}
        </label>
      ))}

      <h2 className="font-semibold text-lg text-gray-700 mt-6">Max Price: ${maxPrice}</h2>
      <input
        type="range"
        min="1"
        max="1000"
        value={maxPrice}
        onChange={handlePriceChange}
        className="w-full accent-blue-500"
      />
    </div>

    {/* Main Content */}
    <div className="md:col-span-3">
      {loading ? (
        <div className="text-center text-gray-500">Loading products...</div>
      ) : paginatedProducts.length === 0 ? (
        <div className="text-center text-gray-500">No products found.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {paginatedProducts.map(product => (
            <div
              key={product.id}
              className="rounded-xl shadow-lg p-4 border border-gray-200 bg-white hover:shadow-xl transition-shadow"
            >
              <img
                src={product.thumbnail}
                alt={product.title}
                className="w-full h-40 object-cover rounded-md"
              />
              <h3 className="mt-3 font-semibold text-gray-800">{product.title}</h3>
              <p className="text-sm text-gray-600">{product.category}</p>
              <p className="text-sm font-bold text-green-600">${product.price}</p>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      <div className="flex justify-between items-center mt-8">
        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        <span className="text-gray-700">Page {page}</span>
        <button
          disabled={startIndex + productsPerPage >= filteredProducts.length}
          onClick={() => setPage(page + 1)}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    </div>
  </div>
</div>
  );
}
