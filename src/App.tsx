import { MotionConfig } from "framer-motion";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";

// Landing de una sola página: cualquier ruta distinta de "/" muestra el 404.
const isHome = ["/", "/index.html"].includes(window.location.pathname);

const App = () => (
  <MotionConfig reducedMotion="user">
    {isHome ? <Index /> : <NotFound />}
  </MotionConfig>
);

export default App;
