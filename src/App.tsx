import { MotionConfig } from "framer-motion";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";

/** Landing de una sola página: cualquier ruta distinta de "/" muestra el 404. */
export const isHomePath = (pathname: string) => ["/", "/index.html"].includes(pathname);

// En el prerender (Node) no hay window: se genera siempre la página de inicio.
const isHome = typeof window === "undefined" || isHomePath(window.location.pathname);

const App = () => (
  <MotionConfig reducedMotion="user">
    {isHome ? <Index /> : <NotFound />}
  </MotionConfig>
);

export default App;
