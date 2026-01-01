import AdminLayout from "./AdminLayout";
import { useState, useEffect } from "react";
import { getAllUsers, changeUserRole } from "../services/adminService";
import {
  User,
  Users,
  Shield,
  CheckCircle,
  XCircle,
  Crown,
  Search,
  X,
} from "lucide-react";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [confirmAction, setConfirmAction] = useState(null);

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
                      <tr key={user.id}>
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
      </div>
    </AdminLayout>
  );
}
