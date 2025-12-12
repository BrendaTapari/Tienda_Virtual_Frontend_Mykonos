import AdminLayout from "./AdminLayout";

export default function AdminOrders() {
  return (
    <AdminLayout>
      <div>
        <h1 className="text-4xl font-bold mb-2 tracking-wide">Orders</h1>
        <p className="text-base-content/60 mb-8">Manage customer orders</p>
        
        <div className="card bg-base-100 shadow-lg">
          <div className="card-body">
            <p className="text-center text-base-content/60 py-16">
              Orders management coming soon...
            </p>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
