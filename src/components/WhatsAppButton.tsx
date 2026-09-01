import { useState, useEffect } from "react";

const WhatsAppButton = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <a
      href="https://wa.me/573246249237?text=Hola%2C%20quisiera%20m%C3%A1s%20informaci%C3%B3n%20sobre%20sus%20servicios"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contactenos por WhatsApp y conversemos sobre su proximo proyecto"
      className="whatsapp-btn"
    >
      <span className="whatsapp-pulse" />
      <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 relative z-10 text-white">
        <path d="M16 2C8.268 2 2 8.268 2 16c0 2.48.648 4.81 1.78 6.84L2 30l7.34-1.72A13.94 13.94 0 0016 30c7.732 0 14-6.268 14-14S23.732 2 16 2zm0 25.2c-2.14 0-4.14-.56-5.9-1.54l-.42-.24-4.36 1.02 1.06-4.24-.28-.44A11.14 11.14 0 014.8 16c0-6.18 5.02-11.2 11.2-11.2S27.2 9.82 27.2 16 22.18 27.2 16 27.2zm6.16-8.4c-.34-.16-2-1-2.3-1.12-.32-.12-.54-.16-.78.16s-.92 1.12-1.12 1.34-.42.24-.78.08c-.34-.16-1.44-.52-2.74-1.68-1.02-.9-1.7-2-1.9-2.34-.2-.34-.02-.52.14-.68.16-.14.34-.38.52-.56.16-.2.22-.34.34-.56.12-.24.06-.42-.02-.6-.1-.16-.78-1.88-1.06-2.56-.28-.68-.56-.58-.78-.58-.2 0-.42-.02-.64-.02-.24 0-.6.08-.92.42-.32.34-1.22 1.2-1.22 2.92s1.24 3.38 1.42 3.6c.16.24 2.44 3.72 5.92 5.22.82.36 1.46.56 1.96.72.84.26 1.6.22 2.2.14.66-.1 2-.82 2.3-1.62.28-.8.28-1.48.2-1.62-.08-.14-.3-.22-.64-.38z" fill="currentColor" />
      </svg>
    </a>
  );
};

export default WhatsAppButton;
