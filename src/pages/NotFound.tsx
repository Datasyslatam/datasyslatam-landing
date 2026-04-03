const NotFound = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="text-center space-y-4">
      <h1 className="text-6xl font-bold gradient-text">404</h1>
      <p className="text-muted-foreground text-lg">Página no encontrada</p>
      <a href="/" className="inline-block gradient-bg text-primary-foreground px-6 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity">
        Volver al inicio
      </a>
    </div>
  </div>
);

export default NotFound;