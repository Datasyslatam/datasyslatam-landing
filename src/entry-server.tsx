import { renderToString } from "react-dom/server";
import App from "./App.tsx";

/** Renderiza la página de inicio a HTML para que buscadores y asistentes de IA la lean sin ejecutar JavaScript. */
export const render = () => renderToString(<App />);
