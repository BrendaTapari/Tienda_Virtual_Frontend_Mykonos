import AdminLayout from "./AdminLayout";
import { useEffect, useState } from "react";
import { fetchProducts } from "../services/productService";
import { getMyPurchases } from "../services/purchaseService";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalUsers: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        // Fetch products count
        const products = await fetchProducts();
        
        // Fetch orders count (using purchases endpoint as proxy)
        let ordersCount = 0;
        try {
          const purchases = await getMyPurchases();
          ordersCount = purchases.length;
        } catch (error) {
          console.log("Could not fetch orders:", error);
        }

        setStats({
          totalProducts: products.length,
          totalOrders: ordersCount,
          totalUsers: 0, // TODO: Add users endpoint
        });
      } catch (error) {
        console.error("Error loading dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  return (
    <AdminLayout>
      <div>
        <h1 className="text-4xl font-bold mb-2 tracking-wide">Dashboard</h1>
        <p className="text-base-content/60 mb-8">Welcome to the admin panel</p>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <span className="loading loading-spinner loading-lg text-primary"></span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="card bg-base-100 shadow-lg hover:shadow-xl transition-shadow">
              <div className="card-body">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="card-title text-primary text-sm font-light tracking-wide">PRODUCTS</h2>
                    <p className="text-4xl font-bold mt-2">{stats.totalProducts}</p>
                  </div>
                  <span className="text-5xl opacity-20">📦</span>
                </div>
              </div>
            </div>
            
            <div className="card bg-base-100 shadow-lg hover:shadow-xl transition-shadow">
              <div className="card-body">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="card-title text-primary text-sm font-light tracking-wide">ORDERS</h2>
                    <p className="text-4xl font-bold mt-2">{stats.totalOrders}</p>
                  </div>
                  <span className="text-5xl opacity-20">🛒</span>
                </div>
              </div>
            </div>
            
            <div className="card bg-base-100 shadow-lg hover:shadow-xl transition-shadow">
              <div className="card-body">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="card-title text-primary text-sm font-light tracking-wide">USERS</h2>
                    <p className="text-4xl font-bold mt-2">{stats.totalUsers}</p>
                  </div>
                  <span className="text-5xl opacity-20">👥</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <a href="/admin/products" className="btn btn-primary btn-lg justify-start">
              <span className="text-2xl mr-3">📦</span>
              Manage Products
            </a>
            <a href="/admin/orders" className="btn btn-outline btn-lg justify-start">
              <span className="text-2xl mr-3">🛒</span>
              View Orders
            </a>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
