import { motion } from "motion/react";
import { useState } from "react";
import { useLocation } from "wouter";

export default function Register() {
  const [location, setLocation] = useLocation();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí iría la lógica de registro
    if (formData.password !== formData.confirmPassword) {
      alert("Las contraseñas no coinciden");
      return;
    }
    console.log("Register attempt:", formData);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const goToLogin = () => {
    setLocation("/login");
  };

  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-md"
      >
        {/* Card de Registro */}
        <div className="card bg-base-100 shadow-2xl">
          <div className="card-body p-8">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-center mb-8"
            >
              <h1 className="text-4xl font-light tracking-widest text-base-content mb-2">
                MYKONOS
              </h1>
              <div className="w-12 h-px bg-primary mx-auto mb-4"></div>
              <p className="text-base-content/60 font-light tracking-wide">
                Crear nueva cuenta
              </p>
            </motion.div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name Input */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="form-control"
              >
                <label className="label">
                  <span className="label-text font-light tracking-wide text-base-content/80">
                    Nombre Completo
                  </span>
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder="Juan Pérez"
                  className="input input-bordered w-full font-light bg-base-200 focus:outline-none focus:border-primary transition-colors"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </motion.div>

              {/* Email Input */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="form-control"
              >
                <label className="label">
                  <span className="label-text font-light tracking-wide text-base-content/80">
                    Correo Electrónico
                  </span>
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="ejemplo@correo.com"
                  className="input input-bordered w-full font-light bg-base-200 focus:outline-none focus:border-primary transition-colors"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </motion.div>

              {/* Password Input */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="form-control"
              >
                <label className="label">
                  <span className="label-text font-light tracking-wide text-base-content/80">
                    Contraseña
                  </span>
                </label>
                <input
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  className="input input-bordered w-full font-light bg-base-200 focus:outline-none focus:border-primary transition-colors"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength={6}
                />
              </motion.div>

              {/* Confirm Password Input */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                className="form-control"
              >
                <label className="label">
                  <span className="label-text font-light tracking-wide text-base-content/80">
                    Confirmar Contraseña
                  </span>
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="••••••••"
                  className="input input-bordered w-full font-light bg-base-200 focus:outline-none focus:border-primary transition-colors"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  minLength={6}
                />
              </motion.div>

              {/* Submit Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.6 }}
                className="form-control mt-8"
              >
                <motion.button
                  type="submit"
                  className="btn btn-primary w-full font-light tracking-widest"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  CREAR CUENTA
                </motion.button>
              </motion.div>
            </form>

            {/* Divider */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="divider font-light text-base-content/40 my-8"
            >
              O
            </motion.div>

            {/* Social Register */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.6 }}
              className="space-y-3"
            >
              <button className="btn btn-outline w-full font-light tracking-wide hover:bg-base-200 transition-colors">
                Registrarse con Google
              </button>
              <button className="btn btn-outline w-full font-light tracking-wide hover:bg-base-200 transition-colors">
                Registrarse con Facebook
              </button>
            </motion.div>

            {/* Login Link */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.6 }}
              className="text-center mt-8"
            >
              <p className="text-base-content/60 font-light">
                ¿Ya tiene una cuenta?{" "}
                <a
                  href="#"
                  onClick={goToLogin}
                  className="text-primary hover:underline font-light tracking-wide"
                >
                  Inicie sesión aquí
                </a>
              </p>
            </motion.div>
          </div>
        </div>

        {/* Footer Note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1, duration: 0.6 }}
          className="text-center text-base-content/40 text-sm font-light mt-8"
        >
          Al crear una cuenta, acepta nuestros términos de servicio y política
          de privacidad
        </motion.p>
      </motion.div>
    </div>
  );
}
