// Zona horaria fija: el prerender (servidor) y el navegador deben producir el mismo texto
// para que la hidratación no detecte diferencias.
const dateFormat = new Intl.DateTimeFormat("es-CO", { dateStyle: "long", timeZone: "UTC" });

export const formatDate = (isoDate: string) => dateFormat.format(new Date(`${isoDate}T12:00:00Z`));
