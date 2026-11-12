import type { ImgHTMLAttributes } from "react";

/** Ancho máximo en el que se usa la versión liviana de una foto de fondo (celulares). */
export const MOBILE_IMAGE_QUERY = "(max-width: 767px)";

/**
 * Foto de fondo con versión liviana para el celular: allí el héroe queda casi cubierto por el azul, así que no hace
 * falta la foto completa. Las versiones *-movil.webp se generan junto a cada foto.
 */
const ResponsiveImage = ({ src, mobileSrc, ...img }: ImgHTMLAttributes<HTMLImageElement> & { src: string; mobileSrc?: string }) =>
  mobileSrc ? (
    <picture>
      <source media={MOBILE_IMAGE_QUERY} srcSet={mobileSrc} />
      <img src={src} {...img} />
    </picture>
  ) : (
    <img src={src} {...img} />
  );

export default ResponsiveImage;
