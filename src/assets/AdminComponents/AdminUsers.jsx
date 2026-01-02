import AdminLayout from "./AdminLayout";
import { useState, useEffect } from "react";
import { getAllUsers, changeUserRole, getUserActivity } from "../services/adminService";
import {
  User,
  Users,
  Shield,
  CheckCircle,
  XCircle,
  Crown,
  Search,
  X,
  Package,
  ShoppingBag,
  DollarSign,
  MapPin,
  CreditCard,
  Phone,
  FileText,
} from "lucide-react";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [confirmAction, setConfirmAction] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userActivity, setUserActivity] = useState(null);
  const [loadingActivity, setLoadingActivity] = useState(false);
  const [activityError, setActivityError] = useState(null);
  const [activeTab, setActiveTab] = useState("info");

  useEffect(() => {
    loadUsers();
  }, [filter]);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredUsers(users);
    } else {
      const term = searchTerm.toLowerCase();
      const filtered = users.filter(
        (user) =>
          user.username?.toLowerCase().includes(term) ||
          user.fullname?.toLowerCase().includes(term) ||
          user.email?.toLowerCase().includes(term)
      );
      setFilteredUsers(filtered);
    }
  }, [searchTerm, users]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const roleFilter = filter === "all" ? null : filter;
      const data = await getAllUsers(100, 0, roleFilter);
      setUsers(data);
      setFilteredUsers(data);
      setError(null);
    } catch (error) {
      console.error("Error loading users:", error);
      setError("Error al cargar usuarios");
    } finally {
      setLoading(false);
    }
  };

  const handleChangeRole = async (userId, currentRole) => {
    const newRole = currentRole === "admin" ? "customer" : "admin";

    if (currentRole === "admin") {
      setConfirmAction({
        type: "removeAdmin",
        userId,
        newRole,
      });
      document.getElementById("confirm_modal").showModal();
      return;
    }

    try {
      await changeUserRole(userId, newRole);
      await loadUsers();
    } catch (error) {
      console.error("Error changing user role:", error);
      setError(error.detail || "Error al cambiar rol de usuario");
    }
  };

  const confirmChangeRole = async () => {
    if (!confirmAction) return;

    try {
      await changeUserRole(confirmAction.userId, confirmAction.newRole);
      await loadUsers();
      setConfirmAction(null);
    } catch (error) {
      console.error("Error changing user role:", error);
      setError(error.detail || "Error al cambiar rol de usuario");
    }
  };

  const handleUserDoubleClick = async (user) => {
    setSelectedUser(user);
    setUserActivity(null);
    setActivityError(null);
    setActiveTab("info");
    document.getElementById("user_details_modal").showModal();
    
    // Fetch user activity
    setLoadingActivity(true);
    try {
      const activity = await getUserActivity(user.id);
      setUserActivity(activity);
    } catch (error) {
      console.error("Error loading user activity:", error);
      setActivityError("Error al cargar la actividad del usuario");
    } finally {
      setLoadingActivity(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("es-AR", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString("es-AR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const getStatusBadgeClass = (status) => {
    const statusMap = {
      'preparando': 'badge-warning',
      'despachado': 'badge-info',
      'en_camino': 'badge-primary',
      'listo_retiro': 'badge-success',
      'entregado': 'badge-success',
      'cancelado': 'badge-error'
    };
    return statusMap[status] || 'badge-ghost';
  };

  return (
    <AdminLayout>
      <div>
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6 md:mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold flex items-center gap-3">
              <Users className="text-primary" size={32} />
              Gestión de Usuarios
            </h1>
            <p className="text-sm md:text-base text-base-content/60 mt-2">
              Administrar usuarios del sistema
            </p>
          </div>
          
          {/* Stats Summary */}
          <div className="stats shadow-md bg-base-100">
            <div className="stat py-3 px-4">
              <div className="stat-title text-xs">Total Usuarios</div>
              <div className="stat-value text-2xl md:text-3xl text-primary">{users.length}</div>
            </div>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="alert alert-error mb-6 shadow-lg">
            <div className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <span>{error}</span>
            </div>
            <button
              onClick={() => setError(null)}
              className="btn btn-sm btn-ghost"
            >
              ✕
            </button>
          </div>
        )}

        {/* Filters */}
        <div className="flex gap-2 mb-4 md:mb-6 flex-wrap">
          <button
            onClick={() => setFilter("all")}
            className={`btn btn-sm md:btn-md gap-2 ${
              filter === "all" ? "btn-primary" : "btn-ghost"
            }`}
          >
            <Users size={16} className="md:w-5 md:h-5" />
            Todos ({users.length})
          </button>
          <button
            onClick={() => setFilter("customer")}
            className={`btn btn-sm md:btn-md gap-2 ${
              filter === "customer" ? "btn-info" : "btn-ghost"
            }`}
          >
            <User size={16} className="md:w-5 md:h-5" />
            Clientes ({users.filter(u => u.role === "customer").length})
          </button>
          <button
            onClick={() => setFilter("admin")}
            className={`btn btn-sm md:btn-md gap-2 ${
              filter === "admin" ? "btn-warning" : "btn-ghost"
            }`}
          >
            <Crown size={16} className="md:w-5 md:h-5" />
            Administradores ({users.filter(u => u.role === "admin").length})
          </button>
        </div>


        {/* Search Bar */}
        <div className="form-control mb-4 md:mb-6">
          <div className="join w-full">
            <div className="join-item bg-base-200 px-3 md:px-4 flex items-center border border-base-300 rounded-l-lg">
              <Search size={18} className="md:w-5 md:h-5 text-base-content/60" />
            </div>
            <input
              type="text"
              placeholder="Buscar por nombre, usuario o email..."
              className="input input-bordered input-sm md:input-md join-item flex-1"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button
                className="btn btn-square btn-ghost btn-sm md:btn-md join-item"
                onClick={() => setSearchTerm("")}
              >
                <X size={18} className="md:w-5 md:h-5" />
              </button>
            )}
          </div>
          {searchTerm && (
            <label className="label">
              <span className="label-text-alt text-xs md:text-sm">
                {filteredUsers.length} resultado(s) encontrado(s)
              </span>
            </label>
          )}
        </div>


        {/* Users Table */}
        <div className="card bg-base-100 shadow-lg">
          <div className="card-body p-4 md:p-6">
            <h2 className="card-title text-lg md:text-xl mb-4 flex items-center gap-2">
              <Users size={20} className="md:w-6 md:h-6 text-primary" />
              Lista de Usuarios
              <span className="badge badge-primary badge-sm md:badge-md ml-auto">
                {filteredUsers.length}
              </span>
            </h2>
            
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <span className="loading loading-spinner loading-lg text-primary"></span>
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="text-center py-16">
                <Users size={48} className="mx-auto text-base-content/20 mb-4" />
                <p className="text-base-content/60">
                  {searchTerm
                    ? "No se encontraron usuarios que coincidan con la búsqueda"
                    : "No se encontraron usuarios"}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto w-full">
                <table className="table table-zebra table-xs md:table-sm lg:table-md">
                  <thead>
                    <tr>
                      <th>Usuario</th>
                      <th className="hidden xl:table-cell">Email</th>
                      <th>Rol</th>
                      <th className="hidden 2xl:table-cell">Estado</th>
                      <th className="hidden 2xl:table-cell">Email Verificado</th>
                      <th className="hidden 2xl:table-cell">Compras</th>
                      <th className="hidden xl:table-cell">Fecha Registro</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user) => (
                      <tr 
                        key={user.id}
                        onDoubleClick={() => handleUserDoubleClick(user)}
                        className="cursor-pointer hover:bg-base-200 transition-colors"
                      >
                        <td>
                          <div className="flex items-center gap-2">
                            {user.role === "admin" ? (
                              <Crown size={14} className="md:w-4 md:h-4 text-warning" />
                            ) : (
                              <User size={14} className="md:w-4 md:h-4 text-info" />
                            )}
                            <div>
                              <p className="font-medium text-xs md:text-sm">{user.username}</p>
                              <p className="text-xs text-base-content/60 xl:hidden">
                                {user.fullname}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="text-xs md:text-sm hidden xl:table-cell">{user.email}</td>
                        <td>
                          <span
                            className={`badge badge-xs md:badge-sm ${
                              user.role === "admin"
                                ? "badge-warning"
                                : "badge-info"
                            }`}
                          >
                            {user.role === "admin" ? "Admin" : "Cliente"}
                          </span>
                        </td>
                        <td className="hidden 2xl:table-cell">
                          <span
                            className={`badge badge-xs md:badge-sm ${
                              user.status === "active"
                                ? "badge-success"
                                : "badge-error"
                            }`}
                          >
                            {user.status === "active" ? "Activo" : "Inactivo"}
                          </span>
                        </td>
                        <td className="hidden 2xl:table-cell">
                          {user.email_verified ? (
                            <CheckCircle size={16} className="md:w-5 md:h-5 text-success" />
                          ) : (
                            <XCircle size={16} className="md:w-5 md:h-5 text-error" />
                          )}
                        </td>
                        <td className="text-center hidden 2xl:table-cell text-xs md:text-sm">
                          {user.total_purchases || 0}
                        </td>
                        <td className="text-xs md:text-sm hidden xl:table-cell">
                          {user.created_at
                            ? new Date(user.created_at).toLocaleDateString(
                                "es-AR"
                              )
                            : "N/A"}
                        </td>
                        <td>
                          <button
                            onClick={() => handleChangeRole(user.id, user.role)}
                            className={`btn btn-xs md:btn-sm ${
                              user.role === "admin" ? "btn-warning" : "btn-info"
                            }`}
                            title={
                              user.role === "admin"
                                ? "Quitar admin"
                                : "Hacer admin"
                            }
                          >
                            <span className="hidden md:inline">
                              {user.role === "admin"
                                ? "Quitar Admin"
                                : "Hacer Admin"}
                            </span>
                            <span className="md:hidden">
                              {user.role === "admin" ? "Quitar" : "Admin"}
                            </span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Modal de Confirmación */}
        <dialog id="confirm_modal" className="modal">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Confirmar Acción</h3>
            <p className="py-4">
              ¿Estás seguro de quitar privilegios de administrador a este
              usuario?
            </p>
            <div className="modal-action">
              <form method="dialog">
                <button className="btn btn-ghost mr-2">Cancelar</button>
                <button className="btn btn-warning" onClick={confirmChangeRole}>
                  Confirmar
                </button>
              </form>
            </div>
          </div>
        </dialog>

        {/* Modal de Detalles del Usuario */}
        <dialog id="user_details_modal" className="modal">
          <div className="modal-box max-w-5xl max-h-[90vh]">
            <form method="dialog">
              <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
            </form>
            
            {selectedUser && (
              <div>
                {/* Header */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="avatar placeholder">
                    <div className="bg-primary text-primary-content rounded-full w-16 h-16">
                      <span className="text-2xl font-bold">
                        {selectedUser.username?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-bold text-2xl flex items-center gap-2">
                      {selectedUser.username}
                      {selectedUser.role === "admin" && (
                        <Crown size={20} className="text-warning" />
                      )}
                    </h3>
                    <p className="text-base-content/60">{selectedUser.fullname || "Sin nombre completo"}</p>
                  </div>
                </div>

                {/* Tabs */}
                <div role="tablist" className="tabs tabs-boxed mb-4">
                  <a 
                    role="tab" 
                    className={`tab ${activeTab === "info" ? "tab-active" : ""}`}
                    onClick={() => setActiveTab("info")}
                  >
                    <User size={16} className="mr-2" />
                    Información
                  </a>
                  <a 
                    role="tab" 
                    className={`tab ${activeTab === "stats" ? "tab-active" : ""}`}
                    onClick={() => setActiveTab("stats")}
                  >
                    <DollarSign size={16} className="mr-2" />
                    Estadísticas
                  </a>
                  <a 
                    role="tab" 
                    className={`tab ${activeTab === "purchases" ? "tab-active" : ""}`}
                    onClick={() => setActiveTab("purchases")}
                  >
                    <ShoppingBag size={16} className="mr-2" />
                    Compras
                  </a>
                  <a 
                    role="tab" 
                    className={`tab ${activeTab === "products" ? "tab-active" : ""}`}
                    onClick={() => setActiveTab("products")}
                  >
                    <Package size={16} className="mr-2" />
                    Productos
                  </a>
                </div>

                {/* Loading State */}
                {loadingActivity && (
                  <div className="flex justify-center items-center h-64">
                    <span className="loading loading-spinner loading-lg text-primary"></span>
                  </div>
                )}

                {/* Error State */}
                {activityError && !loadingActivity && (
                  <div className="alert alert-error">
                    <span>{activityError}</span>
                  </div>
                )}

                {/* Tab Content */}
                {!loadingActivity && !activityError && (
                  <div className="overflow-y-auto max-h-[60vh]">
                    {/* User Info Tab */}
                    {activeTab === "info" && userActivity && (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="form-control">
                            <label className="label">
                              <span className="label-text font-semibold">Email</span>
                            </label>
                            <div className="flex items-center gap-2">
                              <input 
                                type="text" 
                                value={userActivity.user.email} 
                                className="input input-bordered input-sm w-full" 
                                readOnly 
                              />
                              {userActivity.user.email_verified ? (
                                <CheckCircle size={20} className="text-success" title="Email verificado" />
                              ) : (
                                <XCircle size={20} className="text-error" title="Email no verificado" />
                              )}
                            </div>
                          </div>

                          <div className="form-control">
                            <label className="label">
                              <span className="label-text font-semibold flex items-center gap-1">
                                <Phone size={14} />
                                Teléfono
                              </span>
                            </label>
                            <input 
                              type="text" 
                              value={userActivity.user.phone || "No especificado"} 
                              className="input input-bordered input-sm w-full" 
                              readOnly 
                            />
                          </div>

                          <div className="form-control md:col-span-2">
                            <label className="label">
                              <span className="label-text font-semibold flex items-center gap-1">
                                <MapPin size={14} />
                                Domicilio
                              </span>
                            </label>
                            <input 
                              type="text" 
                              value={userActivity.user.domicilio || "No especificado"} 
                              className="input input-bordered input-sm w-full" 
                              readOnly 
                            />
                          </div>

                          <div className="form-control">
                            <label className="label">
                              <span className="label-text font-semibold flex items-center gap-1">
                                <FileText size={14} />
                                CUIT
                              </span>
                            </label>
                            <input 
                              type="text" 
                              value={userActivity.user.cuit || "No especificado"} 
                              className="input input-bordered input-sm w-full" 
                              readOnly 
                            />
                          </div>

                          <div className="form-control">
                            <label className="label">
                              <span className="label-text font-semibold">Rol</span>
                            </label>
                            <div>
                              <span className={`badge ${
                                userActivity.user.role === "admin" ? "badge-warning" : "badge-info"
                              }`}>
                                {userActivity.user.role === "admin" ? "Administrador" : "Cliente"}
                              </span>
                            </div>
                          </div>

                          <div className="form-control">
                            <label className="label">
                              <span className="label-text font-semibold">Estado</span>
                            </label>
                            <div>
                              <span className={`badge ${
                                userActivity.user.status === "active" ? "badge-success" : "badge-error"
                              }`}>
                                {userActivity.user.status === "active" ? "Activo" : "Inactivo"}
                              </span>
                            </div>
                          </div>

                          <div className="form-control">
                            <label className="label">
                              <span className="label-text font-semibold">Fecha de Registro</span>
                            </label>
                            <input 
                              type="text" 
                              value={formatDate(userActivity.user.created_at)} 
                              className="input input-bordered input-sm w-full" 
                              readOnly 
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Statistics Tab */}
                    {activeTab === "stats" && userActivity && (
                      <div className="space-y-4">
                        <div className="stats stats-vertical lg:stats-horizontal shadow w-full">
                          <div className="stat">
                            <div className="stat-figure text-primary">
                              <ShoppingBag size={32} />
                            </div>
                            <div className="stat-title">Total de Compras</div>
                            <div className="stat-value text-primary">{userActivity.statistics.total_purchases}</div>
                            <div className="stat-desc">Órdenes completadas</div>
                          </div>

                          <div className="stat">
                            <div className="stat-figure text-success">
                              <DollarSign size={32} />
                            </div>
                            <div className="stat-title">Total Gastado</div>
                            <div className="stat-value text-success text-2xl">{formatCurrency(userActivity.statistics.total_spent)}</div>
                            <div className="stat-desc">Monto total</div>
                          </div>

                          <div className="stat">
                            <div className="stat-figure text-secondary">
                              <Package size={32} />
                            </div>
                            <div className="stat-title">Productos Ordenados</div>
                            <div className="stat-value text-secondary">{userActivity.statistics.total_products_ordered}</div>
                            <div className="stat-desc">Unidades totales</div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Purchases Tab */}
                    {activeTab === "purchases" && userActivity && (
                      <div className="space-y-4">
                        {userActivity.purchases.length === 0 ? (
                          <div className="text-center py-8">
                            <ShoppingBag size={48} className="mx-auto text-base-content/20 mb-4" />
                            <p className="text-base-content/60">No hay compras registradas</p>
                          </div>
                        ) : (
                          userActivity.purchases.map((purchase) => (
                            <div key={purchase.sale_id} className="collapse collapse-arrow bg-base-200">
                              <input type="checkbox" /> 
                              <div className="collapse-title">
                                <div className="flex justify-between items-center">
                                  <div>
                                    <p className="font-semibold">Pedido #{purchase.sale_id}</p>
                                    <p className="text-sm text-base-content/60">{formatDateTime(purchase.purchase_date)}</p>
                                  </div>
                                  <div className="text-right">
                                    <p className="font-bold text-lg">{formatCurrency(purchase.total)}</p>
                                    <span className={`badge badge-sm ${getStatusBadgeClass(purchase.current_status)}`}>
                                      {purchase.current_status_description}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <div className="collapse-content">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                  <div>
                                    <p className="text-sm font-semibold">Origen:</p>
                                    <p className="text-sm">{purchase.origin}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm font-semibold">Tipo de Entrega:</p>
                                    <p className="text-sm">{purchase.delivery_type === "envio_domicilio" ? "Envío a domicilio" : "Retiro en sucursal"}</p>
                                  </div>
                                  <div className="md:col-span-2">
                                    <p className="text-sm font-semibold flex items-center gap-1">
                                      <MapPin size={14} />
                                      Dirección de Envío:
                                    </p>
                                    <p className="text-sm">{purchase.shipping_address}</p>
                                  </div>
                                  {purchase.notes && (
                                    <div className="md:col-span-2">
                                      <p className="text-sm font-semibold">Notas:</p>
                                      <p className="text-sm italic">{purchase.notes}</p>
                                    </div>
                                  )}
                                </div>

                                {/* Payment Methods */}
                                <div className="mb-4">
                                  <p className="text-sm font-semibold mb-2 flex items-center gap-1">
                                    <CreditCard size={14} />
                                    Métodos de Pago:
                                  </p>
                                  <div className="flex flex-wrap gap-2">
                                    {purchase.payment_methods.map((payment) => (
                                      <div key={payment.payment_id} className="badge badge-outline gap-2">
                                        {payment.display_name}
                                        {payment.bank_name && ` - ${payment.bank_name}`}
                                      </div>
                                    ))}
                                  </div>
                                </div>

                                {/* Tracking History */}
                                <div>
                                  <p className="text-sm font-semibold mb-2">Historial de Seguimiento:</p>
                                  <ul className="timeline timeline-vertical timeline-compact">
                                    {purchase.tracking_history.map((track, idx) => (
                                      <li key={idx}>
                                        {idx > 0 && <hr />}
                                        <div className="timeline-start text-xs">{formatDateTime(track.timestamp)}</div>
                                        <div className="timeline-middle">
                                          <div className={`w-3 h-3 rounded-full ${getStatusBadgeClass(track.status).replace('badge-', 'bg-')}`}></div>
                                        </div>
                                        <div className="timeline-end timeline-box">
                                          <p className="font-semibold text-sm">{track.description}</p>
                                          <p className="text-xs text-base-content/60">{track.location}</p>
                                        </div>
                                        {idx < purchase.tracking_history.length - 1 && <hr />}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    )}

                    {/* Products Tab */}
                    {activeTab === "products" && userActivity && (
                      <div className="space-y-4">
                        {userActivity.products_ordered.length === 0 ? (
                          <div className="text-center py-8">
                            <Package size={48} className="mx-auto text-base-content/20 mb-4" />
                            <p className="text-base-content/60">No hay productos ordenados</p>
                          </div>
                        ) : (
                          <div className="overflow-x-auto">
                            <table className="table table-zebra table-sm">
                              <thead>
                                <tr>
                                  <th>Pedido</th>
                                  <th>Producto</th>
                                  <th>Variante</th>
                                  <th>Cantidad</th>
                                  <th>Precio Unit.</th>
                                  <th>Descuento</th>
                                  <th>Subtotal</th>
                                </tr>
                              </thead>
                              <tbody>
                                {userActivity.products_ordered.map((product, idx) => (
                                  <tr key={idx}>
                                    <td>#{product.sale_id}</td>
                                    <td className="font-medium">{product.product_name}</td>
                                    <td>
                                      <div className="flex gap-1">
                                        {product.size && <span className="badge badge-sm">{product.size}</span>}
                                        {product.color && <span className="badge badge-sm badge-ghost">{product.color}</span>}
                                      </div>
                                    </td>
                                    <td>{product.quantity}</td>
                                    <td>{formatCurrency(product.unit_price)}</td>
                                    <td>
                                      {product.discount_applied > 0 ? (
                                        <span className="text-error">-{formatCurrency(product.discount_applied)}</span>
                                      ) : (
                                        "-"
                                      )}
                                    </td>
                                    <td className="font-semibold">{formatCurrency(product.subtotal)}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* Actions */}
                <div className="modal-action">
                  <form method="dialog">
                    <button className="btn btn-ghost">Cerrar</button>
                  </form>
                </div>
              </div>
            )}
          </div>
          <form method="dialog" className="modal-backdrop">
            <button>close</button>
          </form>
        </dialog>
      </div>
    </AdminLayout>
  );
}
