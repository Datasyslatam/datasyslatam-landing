import { useId } from "react";

/**
 * Avatar de Nova: una esfera de cristal (glassmorphism) con un destello estelar dentro. Es SVG para que se vea
 * nítido en cualquier tamaño, del botón flotante al encabezado, sin descargar imágenes.
 */
const NovaAvatar = ({ size = 40, animated = false, className = "" }: { size?: number; animated?: boolean; className?: string }) => {
  const id = useId().replace(/:/g, "");
  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      aria-hidden="true"
      className={`${animated ? "nova-orb" : ""} shrink-0 overflow-visible ${className}`}
    >
      <defs>
        <radialGradient id={`${id}-body`} cx="38%" cy="32%" r="75%">
          <stop offset="0%" stopColor="#f5d0fe" />
          <stop offset="30%" stopColor="#c084fc" />
          <stop offset="62%" stopColor="#7c3aed" />
          <stop offset="100%" stopColor="#2e1065" />
        </radialGradient>
        <radialGradient id={`${id}-tint`} cx="20%" cy="85%" r="60%">
          <stop offset="0%" stopColor="#2176e8" stopOpacity="0.75" />
          <stop offset="100%" stopColor="#2176e8" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`${id}-pink`} cx="85%" cy="75%" r="50%">
          <stop offset="0%" stopColor="#e879f9" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#e879f9" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`${id}-shine`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.75" />
          <stop offset="100%" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <filter id={`${id}-glow`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2.4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <circle cx="50" cy="50" r="47" fill={`url(#${id}-body)`} />
      <circle cx="50" cy="50" r="47" fill={`url(#${id}-tint)`} />
      <circle cx="50" cy="50" r="47" fill={`url(#${id}-pink)`} />
      {/* Brillo del cristal y borde */}
      <ellipse cx="38" cy="22" rx="24" ry="12" fill={`url(#${id}-shine)`} transform="rotate(-18 38 22)" />
      <circle cx="50" cy="50" r="46" fill="none" stroke="#fff" strokeOpacity="0.45" strokeWidth="2" />

      <g filter={`url(#${id}-glow)`} fill="#fff">
        {/* Destello principal de cuatro puntas */}
        <path className={animated ? "nova-star" : undefined} d="M50 21 C52.5 37 55 42 70 45 C55 48 52.5 53 50 68 C47.5 53 45 48 30 45 C45 42 47.5 37 50 21 Z" />
        {/* Destellos pequeños */}
        <path d="M30 24 C30.8 28.5 31.5 29.2 35 30 C31.5 30.8 30.8 31.5 30 35 C29.2 31.5 28.5 30.8 25 30 C28.5 29.2 29.2 28.5 30 24 Z" opacity="0.9" />
        <path d="M71 62 C71.5 64.6 72 65 74 65.5 C72 66 71.5 66.4 71 69 C70.5 66.4 70 66 68 65.5 C70 65 70.5 64.6 71 62 Z" opacity="0.8" />
      </g>
      {/* Ojos */}
      <g fill="#cffafe" filter={`url(#${id}-glow)`}>
        <rect x="38.5" y="72" width="7" height="10" rx="3.5" />
        <rect x="54.5" y="72" width="7" height="10" rx="3.5" />
      </g>
    </svg>
  );
};

export default NovaAvatar;
