import { useLocation } from "wouter";
import * as motion from "motion/react-client";

export default function LandingPage() {
  const [location, setLocation] = useLocation();

  const goToStore = () => {
    setLocation("/store");
  };

  const cardVariants = {
    offscreen: {
      y: 100,
      opacity: 0,
    },
    onscreen: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  return (
    <div className="bg-base-100" style={{ marginTop: "-64px" }}>
      {/* Hero Section - Elegante y Minimalista */}
      <div className="hero min-h-screen bg-gradient-to-br from-base-200 to-base-300">
        <div className="hero-content text-center">
          <div className="max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
            >
              <h1 className="text-7xl font-light tracking-widest mb-4 text-base-content">
                MYKONOS
              </h1>
              <div className="w-24 h-px bg-primary mx-auto mb-8"></div>
            </motion.div>

            <motion.p
              className="text-2xl font-light text-base-content/80 mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.3 }}
            >
              Moda Contemporánea
            </motion.p>

            <motion.p
              className="text-lg text-base-content/60 max-w-2xl mx-auto mb-12 leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
            >
              Descubra nuestra colección exclusiva de prendas premium, diseñadas
              para el estilo de vida moderno y sofisticado.
            </motion.p>

            <motion.div
              className="text-base-content/40 text-sm font-light animate-bounce"
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              ↓
            </motion.div>
          </div>
        </div>
      </div>

      {/* Call to Action Section */}
      <motion.div
        className="min-h-screen flex items-center justify-center bg-base-100 px-4"
        initial="offscreen"
        whileInView="onscreen"
        viewport={{ amount: 0.5 }}
      >
        <motion.div className="text-center max-w-3xl" variants={cardVariants}>
          <h2 className="text-5xl font-light mb-6 text-base-content tracking-wide">
            Explore Nuestra Colección
          </h2>
          <div className="w-16 h-px bg-primary mx-auto mb-8"></div>
          <p className="text-xl text-base-content/70 mb-12 leading-relaxed">
            Prendas cuidadosamente seleccionadas para su guardarropa. Cada pieza
            cuenta una historia de elegancia y distinción.
          </p>
          <motion.button
            className="btn btn-primary btn-lg px-12 text-lg font-light tracking-wider"
            onClick={goToStore}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            VISITAR TIENDA
          </motion.button>
        </motion.div>
      </motion.div>

      {/* Features Section */}
      <motion.div
        className="min-h-screen bg-base-200 py-20 px-4"
        initial="offscreen"
        whileInView="onscreen"
        viewport={{ amount: 0.3 }}
      >
        <div className="max-w-6xl mx-auto">
          <motion.h2
            className="text-5xl font-light text-center mb-4 text-base-content tracking-wide"
            variants={cardVariants}
          >
            Excelencia en Cada Detalle
          </motion.h2>
          <motion.div
            className="w-16 h-px bg-primary mx-auto mb-16"
            variants={cardVariants}
          ></motion.div>

          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                title: "Calidad Premium",
                description:
                  "Tejidos selectos y confección artesanal para garantizar durabilidad y elegancia.",
              },
              {
                title: "Diseño Atemporal",
                description:
                  "Colecciones que trascienden tendencias, perfecto balance entre clásico y contemporáneo.",
              },
              {
                title: "Experiencia Única",
                description:
                  "Servicio personalizado y atención al detalle en cada compra.",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow"
                variants={cardVariants}
                whileHover={{ y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <div className="card-body items-center text-center">
                  <h3 className="card-title text-2xl font-light text-base-content mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-base-content/70 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Informacion Sucursales*/}
      <div className="bg-base-100 py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ amount: 0.3 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <h2 className="text-5xl font-light tracking-widest mb-4 text-base-content">
              NUESTRAS SUCURSALES
            </h2>
            <div className="w-16 h-px bg-primary mx-auto mb-6"></div>
            <p className="text-base-content/70 text-lg font-light">
              Visite nuestras boutiques
            </p>
          </motion.div>

          {/* Sucursal 1 - Desde la izquierda */}
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ amount: 0.5, once: false }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="mb-32"
          >
            <div className="card lg:card-side bg-base-100 shadow-xl">
              <figure className="lg:w-1/2">
                <img
                  src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80"
                  alt="Sucursal Centro"
                  className="w-full h-full object-cover"
                />
              </figure>
              <div className="card-body lg:w-1/2 justify-center">
                <h3 className="card-title text-3xl font-light tracking-wide text-base-content">
                  MYKONOS PARANÁ
                </h3>
                <div className="w-12 h-px bg-primary/50 my-4"></div>
                <p className="text-base-content/80 text-lg leading-relaxed mb-4">
                  Nuestra boutique insignia ubicada en el corazón de la ciudad.
                  Un espacio elegante donde la moda contemporánea cobra vida.
                </p>
                <div className="space-y-2 text-base-content/70">
                  <p className="flex items-center gap-2">
                    <span className="font-light">📍</span>
                    <span>Peatonal San Martin 695, Paraná, Entre Ríos</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="font-light">📞</span>
                    <span>+54 9 343 509 1341</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <div className="flex">
                      <span className="font-light">🕐</span>
                      <span>Lunes a Sábado 8:30 a 12:30 16:30 a 20:30hs</span>
                    </div>
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Sucursal 2 - Desde la derecha */}
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ amount: 0.5, once: false }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="mb-20"
          >
            <div className="card lg:card-side bg-base-100 shadow-xl">
              <div className="card-body lg:w-1/2 justify-center lg:order-1">
                <h3 className="card-title text-3xl font-light tracking-wide text-base-content">
                  MYKONOS CONCORDIA
                </h3>
                <div className="w-12 h-px bg-primary/50 my-4"></div>
                <p className="text-base-content/80 text-lg leading-relaxed mb-4">
                  Nuestra sucursal a pasos de la peatonal Concordia. Un espacio
                  diseñado para ofrecer una experiencia de compra exclusiva y
                  personalizada.
                </p>
                <div className="space-y-2 text-base-content/70">
                  <p className="flex items-center gap-2">
                    <span className="font-light">📍</span>
                    <span>A. del Valle 26, Concordia, Entre Ríos</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="font-light">📞</span>
                    <span>+54 9 345 5201 623</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="font-light">🕐</span>
                    <span>Lunes a Sábado 8:30 a 12:30 16:30 a 20:30hs</span>
                  </p>
                </div>
              </div>
              <figure className="lg:w-1/2 lg:order-2">
                <img
                  src="https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=800&q=80"
                  alt="Sucursal Plaza"
                  className="w-full h-full object-cover"
                />
              </figure>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Brand Statement Section */}
      <motion.div
        className="min-h-screen flex items-center justify-center bg-gradient-to-br from-base-300 to-base-200 px-4"
        initial="offscreen"
        whileInView="onscreen"
        viewport={{ amount: 0.5 }}
      >
        <motion.div className="text-center" variants={cardVariants}>
          <h1
            className="text-base-content font-extralight tracking-[0.3em] mb-8"
            style={{
              fontSize: "clamp(3rem, 15vw, 12rem)",
            }}
          >
            MYKONOS
          </h1>
          <p className="text-base-content/60 text-xl font-light tracking-widest">
            ELEGANCIA CONTEMPORÁNEA
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
