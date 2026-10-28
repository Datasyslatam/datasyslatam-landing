import { Fragment, type ReactNode } from "react";

// Markdown mínimo de las respuestas del asistente (**negrita**, listas "- " y [enlaces](/ruta)), convertido a
// elementos de React: nunca se inserta HTML, así una respuesta no puede inyectar código en la página.
// Solo se enlazan rutas del propio sitio y WhatsApp; cualquier otro enlace queda como texto.
const SAFE_LINK = /^(\/(?!\/)|https:\/\/(www\.)?datasyslatam\.com\/|https:\/\/wa\.me\/)/;

const INLINE = /\*\*([^*]+)\*\*|\[([^\]]+)\]\(([^)\s]+)\)/g;

const renderInline = (text: string, onNavigate: () => void): ReactNode[] => {
  const out: ReactNode[] = [];
  let last = 0;
  for (const m of text.matchAll(INLINE)) {
    if (m.index > last) out.push(text.slice(last, m.index));
    if (m[1]) out.push(<strong key={m.index}>{m[1]}</strong>);
    else if (SAFE_LINK.test(m[3])) {
      const external = m[3].startsWith("https://wa.me/");
      out.push(
        <a
          key={m.index}
          href={m[3]}
          className="font-medium text-electric-500 underline underline-offset-2 hover:text-electric-600"
          {...(external ? { target: "_blank", rel: "noopener noreferrer" } : { onClick: onNavigate })}
        >
          {m[2]}
        </a>,
      );
    } else out.push(m[2]);
    last = m.index + m[0].length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
};

const RichText = ({ text, onNavigate }: { text: string; onNavigate: () => void }) => {
  const blocks: ReactNode[] = [];
  let list: string[] = [];
  const flushList = () => {
    if (!list.length) return;
    blocks.push(
      <ul key={`ul${blocks.length}`} className="ml-4 list-disc space-y-1">
        {list.map((item, i) => (
          <li key={i}>{renderInline(item, onNavigate)}</li>
        ))}
      </ul>,
    );
    list = [];
  };
  for (const line of text.split("\n")) {
    const item = /^\s*(?:[-*•]|\d+[.)])\s+(.*)$/.exec(line);
    if (item) list.push(item[1]);
    else {
      flushList();
      if (line.trim()) blocks.push(<p key={`p${blocks.length}`}>{renderInline(line, onNavigate)}</p>);
    }
  }
  flushList();
  return <Fragment>{blocks}</Fragment>;
};

export default RichText;
