import type { ReactNode } from "react";
import { LazyMotion, MotionConfig, domAnimation } from "framer-motion";

/**
 * Envoltura común de todas las páginas (la página la elige loadPage.tsx).
 * Las animaciones usan los componentes livianos `m` de framer-motion con solo las funciones que el sitio necesita
 * (domAnimation): `strict` avisa si alguien vuelve a usar `motion`, que cargaría la librería completa.
 */
const App = ({ children }: { children: ReactNode }) => (
  <MotionConfig reducedMotion="user">
    <LazyMotion features={domAnimation} strict>
      {children}
    </LazyMotion>
  </MotionConfig>
);

export default App;
