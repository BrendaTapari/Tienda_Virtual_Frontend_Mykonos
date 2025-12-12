import AdminLayout from "./AdminLayout";
import { useState, useEffect } from "react";
import { 
  fetchProducts, 
  fetchAllProducts, 
  toggleProductOnline,
  deleteProduct 
} from "../services/productService";
import { motion, AnimatePresence } from "motion/react";

export default function AdminProductList() {
  const [onlineProducts, setOnlineProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [searchBarcode, setSearchBarcode] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [error, setError] = useState(null);

  // Form state for adding/editing product
  const [formData, setFormData] = useState({
    nombre_web: "",
    descripcion_web: "",
    precio_web: "",
    slug: "",
  });

  // Load online products on mount
  useEffect(() => {
    loadOnlineProducts();
  }, []);

  const loadOnlineProducts = async () => {
    try {
      setLoading(true);
      const products = await fetchProducts();
      setOnlineProducts(products);
      setError(null);
    } catch (error) {
      console.error("Error loading products:", error);
      setError("Error loading products");
    } finally {
      setLoading(false);
    }
  };

  // Search product by barcode
  const handleBarcodeSearch = async () => {
    if (!searchBarcode.trim()) {
      setError("Please enter a barcode");
      return;
    }

    try {
      setSearchLoading(true);
      setError(null);
      const products = await fetchAllProducts(searchBarcode);
      
      if (products.length === 0) {
        setError("No product found with that barcode");
        setAllProducts([]);
      } else {
        setAllProducts(products);
        setShowAddModal(true);
      }
    } catch (error) {
      console.error("Error searching products:", error);
      setError("Error searching for product");
    } finally {
      setSearchLoading(false);
    }
  };

  // Select product from search results
  const handleSelectProduct = (product) => {
    setSelectedProduct(product);
    setFormData({
      nombre_web: product.product_name || "",
      descripcion_web: product.description || "",
      precio_web: product.sale_price || "",
      slug: "",
    });
  };

  // Add product to online store
  const handleAddToOnlineStore = async () => {
    if (!selectedProduct) {
      setError("Please select a product");
      return;
    }

    if (!formData.nombre_web || !formData.precio_web) {
      setError("Product name and price are required");
      return;
    }

    try {
      setLoading(true);
      await toggleProductOnline(selectedProduct.id, {
        en_tienda_online: true,
        nombre_web: formData.nombre_web,
        descripcion_web: formData.descripcion_web,
        precio_web: parseFloat(formData.precio_web),
        slug: formData.slug || undefined,
      });

      // Reload products
      await loadOnlineProducts();
      
      // Reset form
      setShowAddModal(false);
      setSelectedProduct(null);
      setSearchBarcode("");
      setAllProducts([]);
      setFormData({
        nombre_web: "",
        descripcion_web: "",
        precio_web: "",
        slug: "",
      });
      setError(null);
    } catch (error) {
      console.error("Error adding product to online store:", error);
      setError(error.detail || "Error adding product to online store");
    } finally {
      setLoading(false);
    }
  };

  // Remove product from online store
  const handleRemoveFromOnlineStore = async (productId) => {
    if (!confirm("Are you sure you want to remove this product from the online store?")) {
      return;
    }

    try {
      setLoading(true);
      await toggleProductOnline(productId, {
        en_tienda_online: false,
      });

      // Reload products
      await loadOnlineProducts();
      setError(null);
    } catch (error) {
      console.error("Error removing product:", error);
      setError("Error removing product from online store");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div>
        <h1 className="text-4xl font-bold mb-2 tracking-wide">Product Management</h1>
        <p className="text-base-content/60 mb-8">Manage products in the online store</p>

        {/* Error Alert */}
        {error && (
          <div className="alert alert-error mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{error}</span>
            <button onClick={() => setError(null)} className="btn btn-sm btn-ghost">✕</button>
          </div>
        )}

        {/* Add Product Section */}
        <div className="card bg-base-100 shadow-lg mb-8">
          <div className="card-body">
            <h2 className="card-title text-primary">Add Product to Online Store</h2>
            <p className="text-sm text-base-content/60 mb-4">
              Search for a product by barcode to add it to the online store
            </p>
            
            <div className="flex gap-4">
              <input
                type="text"
                placeholder="Enter barcode (provider code)"
                className="input input-bordered flex-1"
                value={searchBarcode}
                onChange={(e) => setSearchBarcode(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleBarcodeSearch()}
              />
              <button 
                className="btn btn-primary"
                onClick={handleBarcodeSearch}
                disabled={searchLoading}
              >
                {searchLoading ? (
                  <span className="loading loading-spinner loading-sm"></span>
                ) : (
                  "Search"
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Online Products List */}
        <div className="card bg-base-100 shadow-lg">
          <div className="card-body">
            <h2 className="card-title text-primary mb-4">Products in Online Store</h2>
            
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <span className="loading loading-spinner loading-lg text-primary"></span>
              </div>
            ) : onlineProducts.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-base-content/60">No products in online store yet</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="table table-zebra">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Price</th>
                      <th>Stock</th>
                      <th>Slug</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {onlineProducts.map((product) => (
                      <tr key={product.id}>
                        <td>{product.id}</td>
                        <td className="font-medium">{product.nombre_web}</td>
                        <td>${(product.precio_web || product.sale_price || 0).toFixed(2)}</td>
                        <td>
                          <span className={`badge ${product.stock_disponible > 0 ? 'badge-success' : 'badge-error'}`}>
                            {product.stock_disponible} units
                          </span>
                        </td>
                        <td className="text-sm text-base-content/60">{product.slug}</td>
                        <td>
                          <div className="flex gap-2">
                            <button 
                              className="btn btn-sm btn-error btn-outline"
                              onClick={() => handleRemoveFromOnlineStore(product.id)}
                            >
                              Remove
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Add Product Modal */}
        <AnimatePresence>
          {showAddModal && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowAddModal(false)}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
              />
              
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="fixed inset-0 flex items-center justify-center z-50 p-8"
              >
                <div className="card bg-base-100 w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
                  <div className="card-body">
                    <h2 className="card-title text-2xl mb-4">Add Product to Online Store</h2>
                    
                    {/* Search Results */}
                    {allProducts.length > 0 && !selectedProduct && (
                      <div className="mb-6">
                        <h3 className="font-bold mb-2">Search Results:</h3>
                        <div className="space-y-2">
                          {allProducts.map((product) => (
                            <div
                              key={product.id}
                              className="card bg-base-200 cursor-pointer hover:bg-base-300 transition-colors"
                              onClick={() => handleSelectProduct(product)}
                            >
                              <div className="card-body p-4">
                                <div className="flex justify-between items-center">
                                  <div>
                                    <p className="font-bold">{product.product_name}</p>
                                    <p className="text-sm text-base-content/60">
                                      Barcode: {product.provider_code} | Price: ${product.sale_price}
                                    </p>
                                    <span className={`badge badge-sm ${product.en_tienda_online ? 'badge-success' : 'badge-ghost'}`}>
                                      {product.en_tienda_online ? 'Already Online' : 'Not Online'}
                                    </span>
                                  </div>
                                  <button className="btn btn-sm btn-primary">Select</button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Product Form */}
                    {selectedProduct && (
                      <div className="space-y-4">
                        <div className="alert alert-info">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                          </svg>
                          <span>Selected: {selectedProduct.product_name}</span>
                        </div>

                        <div className="form-control">
                          <label className="label">
                            <span className="label-text">Product Name (for web) *</span>
                          </label>
                          <input
                            type="text"
                            className="input input-bordered"
                            value={formData.nombre_web}
                            onChange={(e) => setFormData({ ...formData, nombre_web: e.target.value })}
                            required
                          />
                        </div>

                        <div className="form-control">
                          <label className="label">
                            <span className="label-text">Description (for web)</span>
                          </label>
                          <textarea
                            className="textarea textarea-bordered h-24"
                            value={formData.descripcion_web}
                            onChange={(e) => setFormData({ ...formData, descripcion_web: e.target.value })}
                          />
                        </div>

                        <div className="form-control">
                          <label className="label">
                            <span className="label-text">Price (for web) *</span>
                          </label>
                          <input
                            type="number"
                            step="0.01"
                            className="input input-bordered"
                            value={formData.precio_web}
                            onChange={(e) => setFormData({ ...formData, precio_web: e.target.value })}
                            required
                          />
                        </div>

                        <div className="form-control">
                          <label className="label">
                            <span className="label-text">Slug (optional, auto-generated if empty)</span>
                          </label>
                          <input
                            type="text"
                            className="input input-bordered"
                            value={formData.slug}
                            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                            placeholder="product-name-slug"
                          />
                        </div>
                      </div>
                    )}

                    <div className="card-actions justify-end mt-6">
                      <button 
                        className="btn btn-ghost"
                        onClick={() => {
                          setShowAddModal(false);
                          setSelectedProduct(null);
                          setAllProducts([]);
                        }}
                      >
                        Cancel
                      </button>
                      {selectedProduct && (
                        <button 
                          className="btn btn-primary"
                          onClick={handleAddToOnlineStore}
                        >
                          Add to Online Store
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </AdminLayout>
  );
}
