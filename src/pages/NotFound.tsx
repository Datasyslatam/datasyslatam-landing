import { useEffect } from "react";

const NotFound = () => {
  // El servidor responde index.html para cualquier ruta; evita que los buscadores indexen el 404.
  useEffect(() => {
    document.title = "Página no encontrada — DATASYSLATAM";
    const robots = document.querySelector<HTMLMetaElement>('meta[name="robots"]');
    const previous = robots?.content;
    if (robots) robots.content = "noindex";
    return () => {
      if (robots && previous) robots.content = previous;
    };
  }, []);

  return (
    <main className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-4">
        <h1 className="text-6xl font-bold gradient-text">404</h1>
        <p className="text-muted-foreground text-lg">Página no encontrada</p>
        <a href="/" className="inline-block gradient-bg text-primary-foreground px-6 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity">
          Volver al inicio
        </a>
      </div>
    </main>
  );
};

export default NotFound;
