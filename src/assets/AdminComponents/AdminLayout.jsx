import { Link, useLocation } from "wouter";
import { useAuth } from "../context/AuthContext";
import {
  ChartColumn,
  Package,
  ShoppingCart,
  Users,
  TicketPercent,
  Home,
  LogOut,
} from "lucide-react";

export default function AdminLayout({ children }) {
  const [location] = useLocation();
  const { user, logout } = useAuth();

  const menuItems = [
    { path: "/admin", label: "Resumen", icon: ChartColumn },
    { path: "/admin/products", label: "Productos", icon: Package },
    { path: "/admin/orders", label: "Pedidos", icon: ShoppingCart },
    { path: "/admin/users", label: "Usuarios", icon: Users },
    { path: "/admin/discounts", label: "Descuentos", icon: TicketPercent },
  ];

  return (
    <div className="flex min-h-screen bg-base-200">
      {/* Sidebar */}
      <aside className="w-64 bg-base-100 shadow-lg fixed h-full">
        <div className="p-6 border-b border-base-300">
          <h2 className="text-2xl font-bold text-primary tracking-wide">
            Mykonos Admin
          </h2>
          <p className="text-sm text-base-content/60 mt-1">{user?.username}</p>
          <span className="badge badge-primary badge-sm mt-2">
            Administrator
          </span>
        </div>

        <nav className="mt-6">
          {menuItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <Link key={item.path} href={item.path}>
                <div
                  className={`flex items-center gap-3 px-6 py-3 hover:bg-base-200 transition-colors cursor-pointer ${
                    location === item.path
                      ? "bg-base-200 border-l-4 border-primary"
                      : ""
                  }`}
                >
                  <IconComponent
                    size={20}
                    className={location === item.path ? "text-primary" : ""}
                  />
                  <span className="font-medium">{item.label}</span>
                </div>
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 w-64 p-6 border-t border-base-300 bg-base-100">
          <Link href="/">
            <div className="btn btn-outline btn-sm w-full mb-2 gap-2">
              <Home size={16} />
              Volver a la Tienda
            </div>
          </Link>
          <button
            onClick={logout}
            className="btn btn-ghost btn-sm w-full gap-2"
          >
            <LogOut size={16} />
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8">{children}</main>
    </div>
  );
}
