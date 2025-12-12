import { useAuth } from "../context/AuthContext";
import { useLocation } from "wouter";
import { motion } from "motion/react";
import { User, Mail, Phone, MapPin, FileText, Shield, Calendar } from "lucide-react";
import { useState } from "react";
import { updateProfile, changePassword } from "../services/authService";

export default function UserInfo() {
  const { user, isAdmin, updateUser, logout } = useAuth();
  const [location, setLocation] = useLocation();
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const [formData, setFormData] = useState({
    fullname: user?.fullname || "",
    email: user?.email || "",
    phone: user?.phone || "",
    domicilio: user?.domicilio || "",
  });

  const [passwordData, setPasswordData] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
  });

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      await updateUser(formData);
      setSuccess("Perfil actualizado exitosamente");
      setIsEditing(false);
    } catch (error) {
      setError(error.detail || "Error al actualizar el perfil");
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (passwordData.new_password !== passwordData.confirm_password) {
      setError("Las contraseñas no coinciden");
      return;
    }

    if (passwordData.new_password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    setLoading(true);
    try {
      await changePassword({
        current_password: passwordData.current_password,
        new_password: passwordData.new_password,
      });
      setSuccess("Contraseña cambiada exitosamente");
      setIsChangingPassword(false);
      setPasswordData({
        current_password: "",
        new_password: "",
        confirm_password: "",
      });
    } catch (error) {
      setError(error.detail || "Error al cambiar la contraseña");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    setLocation("/");
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">No has iniciado sesión</h2>
          <button onClick={() => setLocation("/login")} className="btn btn-primary">
            Iniciar Sesión
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-light tracking-widest mb-2">MI PERFIL</h1>
          <div className="w-16 h-px bg-primary mx-auto"></div>
        </motion.div>

        {/* Alerts */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="alert alert-error mb-6"
          >
            <span>{error}</span>
            <button onClick={() => setError(null)} className="btn btn-sm btn-ghost">✕</button>
          </motion.div>
        )}

        {success && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="alert alert-success mb-6"
          >
            <span>{success}</span>
            <button onClick={() => setSuccess(null)} className="btn btn-sm btn-ghost">✕</button>
          </motion.div>
        )}

        {/* User Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card bg-base-100 shadow-xl mb-6"
        >
          <div className="card-body">
            {/* User Header */}
            <div className="flex items-center gap-4 mb-6 pb-6 border-b border-base-300">
              <div className={`avatar placeholder`}>
                <div className={`w-20 rounded-full ${
                  isAdmin ? "bg-warning text-warning-content" : "bg-info text-info-content"
                }`}>
                  {isAdmin ? <Shield size={40} /> : <User size={40} />}
                </div>
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold">{user.username}</h2>
                <p className={`text-sm ${isAdmin ? "text-warning" : "text-info"}`}>
                  {isAdmin ? "Administrador" : "Cliente"}
                </p>
                {user.email_verified && (
                  <span className="badge badge-success badge-sm mt-1">Email Verificado</span>
                )}
              </div>
              {isAdmin && (
                <button
                  onClick={() => setLocation("/admin")}
                  className="btn btn-warning gap-2"
                >
                  <Shield size={18} />
                  Panel Admin
                </button>
              )}
            </div>

            {/* Profile Information */}
            {!isEditing ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-3 bg-base-200 rounded-lg">
                    <User className="text-primary" size={20} />
                    <div>
                      <p className="text-xs text-base-content/60">Nombre Completo</p>
                      <p className="font-medium">{user.fullname || "No especificado"}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-base-200 rounded-lg">
                    <Mail className="text-primary" size={20} />
                    <div>
                      <p className="text-xs text-base-content/60">Email</p>
                      <p className="font-medium">{user.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-base-200 rounded-lg">
                    <Phone className="text-primary" size={20} />
                    <div>
                      <p className="text-xs text-base-content/60">Teléfono</p>
                      <p className="font-medium">{user.phone || "No especificado"}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-base-200 rounded-lg">
                    <FileText className="text-primary" size={20} />
                    <div>
                      <p className="text-xs text-base-content/60">CUIT</p>
                      <p className="font-medium">{user.cuit || "No especificado"}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-base-200 rounded-lg">
                  <MapPin className="text-primary mt-1" size={20} />
                  <div className="flex-1">
                    <p className="text-xs text-base-content/60">Domicilio</p>
                    <p className="font-medium">{user.domicilio || "No especificado"}</p>
                  </div>
                </div>

                {user.created_at && (
                  <div className="flex items-center gap-3 p-3 bg-base-200 rounded-lg">
                    <Calendar className="text-primary" size={20} />
                    <div>
                      <p className="text-xs text-base-content/60">Miembro desde</p>
                      <p className="font-medium">
                        {new Date(user.created_at).toLocaleDateString('es-AR')}
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="btn btn-primary flex-1"
                  >
                    Editar Perfil
                  </button>
                  <button
                    onClick={() => setIsChangingPassword(true)}
                    className="btn btn-outline flex-1"
                  >
                    Cambiar Contraseña
                  </button>
                </div>
              </div>
            ) : (
              /* Edit Form */
              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Nombre Completo</span>
                  </label>
                  <input
                    type="text"
                    className="input input-bordered"
                    value={formData.fullname}
                    onChange={(e) => setFormData({ ...formData, fullname: e.target.value })}
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Email</span>
                  </label>
                  <input
                    type="email"
                    className="input input-bordered"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Teléfono</span>
                  </label>
                  <input
                    type="tel"
                    className="input input-bordered"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Domicilio</span>
                  </label>
                  <textarea
                    className="textarea textarea-bordered"
                    value={formData.domicilio}
                    onChange={(e) => setFormData({ ...formData, domicilio: e.target.value })}
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    type="submit"
                    className="btn btn-primary flex-1"
                    disabled={loading}
                  >
                    {loading ? <span className="loading loading-spinner"></span> : "Guardar Cambios"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="btn btn-ghost flex-1"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            )}
          </div>
        </motion.div>

        {/* Change Password Modal */}
        {isChangingPassword && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setIsChangingPassword(false)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="card bg-base-100 w-full max-w-md shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="card-body">
                <h3 className="card-title">Cambiar Contraseña</h3>
                <form onSubmit={handleChangePassword} className="space-y-4">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Contraseña Actual</span>
                    </label>
                    <input
                      type="password"
                      className="input input-bordered"
                      value={passwordData.current_password}
                      onChange={(e) => setPasswordData({ ...passwordData, current_password: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Nueva Contraseña</span>
                    </label>
                    <input
                      type="password"
                      className="input input-bordered"
                      value={passwordData.new_password}
                      onChange={(e) => setPasswordData({ ...passwordData, new_password: e.target.value })}
                      required
                      minLength={6}
                    />
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Confirmar Nueva Contraseña</span>
                    </label>
                    <input
                      type="password"
                      className="input input-bordered"
                      value={passwordData.confirm_password}
                      onChange={(e) => setPasswordData({ ...passwordData, confirm_password: e.target.value })}
                      required
                      minLength={6}
                    />
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="submit"
                      className="btn btn-primary flex-1"
                      disabled={loading}
                    >
                      {loading ? <span className="loading loading-spinner"></span> : "Cambiar"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsChangingPassword(false)}
                      className="btn btn-ghost flex-1"
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Logout Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center"
        >
          <button
            onClick={handleLogout}
            className="btn btn-error btn-outline"
          >
            Cerrar Sesión
          </button>
        </motion.div>
      </div>
    </div>
  );
}
