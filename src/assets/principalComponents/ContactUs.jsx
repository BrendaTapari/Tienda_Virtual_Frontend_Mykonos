export default function ContactUs() {
  return (
    <div className="bg-base-100 min-h-screen flex flex-col items-center justify-center py-12 px-4">
      <h1 className="text-4xl font-light text-base-content mb-6">
        Contáctanos
      </h1>
      <p className="text-lg text-center text-base-content mb-8 max-w-2xl">
        ¿Tienes alguna pregunta, comentario o necesitas ayuda? Estamos aquí para
        ayudarte. No dudes en ponerte en contacto con nuestro equipo de soporte.
        Puedes enviarnos un correo electrónico a
        <a href="mailto:support@mykonos.com" className="text-primary underline">
          support@mykonos.com
        </a>
        .
      </p>
    </div>
  );
}
