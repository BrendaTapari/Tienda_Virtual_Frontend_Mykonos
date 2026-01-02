import { motion } from "motion/react";

export default function InitialLoader() {
  // Calcular la longitud aproximada de los paths para la animación
  // Rectángulo: perímetro = 2 * (300 + 300) = 1200
  const rectPathLength = 1200;
  
  // Path L-shape: calculado aproximadamente
  // Segmentos: (760-90) + (760-90) + (760-380) + (390-90) = 670 + 670 + 380 + 300 = 2020
  const lShapePathLength = 2020;

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-base-100 via-base-200 to-base-300"
    >
      <div className="flex flex-col items-center gap-8">
        {/* Logo animado con SVG */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="w-48 h-48"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 800 800"
            width="100%"
            height="100%"
          >
            {/* Cuadrado completo (superior izquierdo) - animado */}
            <motion.rect
              x="40"
              y="40"
              width="300"
              height="300"
              fill="none"
              stroke="#FF6B1A"
              strokeWidth="16"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{
                pathLength: 0,
                opacity: 0,
              }}
              animate={{
                pathLength: [0, 1, 1],
                opacity: [0, 1, 1],
              }}
              transition={{
                pathLength: {
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  times: [0, 0.5, 1],
                },
                opacity: {
                  duration: 0.3,
                  repeat: Infinity,
                  repeatDelay: 1.7,
                },
              }}
            />

            {/* Cuadrado incompleto (forma en L) - animado con delay */}
            <motion.path
              d="M 90 390 L 90 760 L 760 760 L 760 90 L 380 90 L 380 390 Z"
              fill="none"
              stroke="#FF6B1A"
              strokeWidth="16"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{
                pathLength: 0,
                opacity: 0,
              }}
              animate={{
                pathLength: [0, 1, 1],
                opacity: [0, 1, 1],
              }}
              transition={{
                pathLength: {
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.3,
                  times: [0, 0.5, 1],
                },
                opacity: {
                  duration: 0.3,
                  repeat: Infinity,
                  repeatDelay: 1.7,
                  delay: 0.3,
                },
              }}
            />
          </svg>
        </motion.div>

        {/* Texto de carga */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0] }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="text-base-content/60 text-lg font-light tracking-wide"
        >
          Cargando tienda...
        </motion.p>
      </div>
    </motion.div>
  );
}
