const techs = [
  { name: "React",      color: "#61DAFB",  logo: "react" },
  { name: "Node.js",     color: "#339933",  logo: "nodejs" },
  { name: "Python",      color: "#3776AB",  logo: "python" },
  { name: "Django",      color: "#092E20",  logo: "django" },
  { name: "PostgreSQL",  color: "#4169E1",  logo: "postgres" },
  { name: "MySQL",       color: "#4479A1",  logo: "mysql" },
  { name: "Docker",      color: "#2496ED",  logo: "docker" },
  { name: "GitHub",      color: "#181717",  logo: "github" },
  { name: "Power BI",    color: "#F2C811",  logo: "powerbi" },
  { name: "OpenAI",      color: "#412991",  logo: "openai" },
];

function Logo({ type, color }) {
  const s = { width: 32, height: 32 };
  switch (type) {
    case "react": return (
      <svg viewBox="0 0 48 48" style={s} fill="none" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="24" cy="24" rx="22" ry="8.5" stroke="#61DAFB" stroke-width="2"/>
        <ellipse cx="24" cy="24" rx="22" ry="8.5" stroke="#61DAFB" stroke-width="2" transform="rotate(60 24 24)"/>
        <ellipse cx="24" cy="24" rx="22" ry="8.5" stroke="#61DAFB" stroke-width="2" transform="rotate(120 24 24)"/>
        <circle cx="24" cy="24" r="4" fill="#61DAFB"/>
      </svg>
    );
    case "nodejs": return (
      <svg viewBox="0 0 48 48" style={s} xmlns="http://www.w3.org/2000/svg">
        <path d="M44 24L36 40H12L4 24 12 8h24z" fill="#339933"/>
        <path d="M36 24l-4 8H20l-4-8 4-8h12z" fill="#ffffff" opacity="0.3"/>
        <text x="24" y="29" text-anchor="middle" font-family="Arial,sans-serif" font-size="11" font-weight="700" fill="#ffffff">N</text>
      </svg>
    );
    case "python": return (
      <svg viewBox="0 0 48 48" style={s} xmlns="http://www.w3.org/2000/svg">
        <path d="M24 4C14 4 8 9 8 16v6h16v2H6c-3 0-6 3-6 8s3 8 6 8h4v-6c0-3 3-6 6-6h14c3 0 6-3 6-8V12c0-5-4-8-8-8h-4z" fill="#3776AB"/>
        <path d="M24 44c10 0 16-5 16-12v-6H24v-2h18c3 0 6 3 6 8s-3 8-6 8h-4v6c0 3-3 6-6 6H14c-3 0-6-3-6-8V24c0 5 4 8 8 8h4z" fill="#FFD43B"/>
      </svg>
    );
    case "django": return (
      <svg viewBox="0 0 48 48" style={s} xmlns="http://www.w3.org/2000/svg">
        <rect x="4" y="4" width="40" height="40" rx="6" fill="#092E20"/>
        <text x="24" y="30" text-anchor="middle" font-family="Arial,sans-serif" font-size="14" font-weight="700" fill="#44B78B">d</text>
      </svg>
    );
    case "postgres": return (
      <svg viewBox="0 0 48 48" style={s} xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="24" cy="38" rx="16" ry="6" fill="#4169E1" opacity="0.3"/>
        <path d="M16 12c0-4 4-7 8-7s8 3 8 7v18c0 4-4 7-8 7s-8-3-8-7z" fill="#4169E1"/>
        <ellipse cx="24" cy="12" rx="8" ry="4" fill="#336791"/>
        <circle cx="20" cy="22" r="2" fill="#ffffff" opacity="0.6"/>
        <circle cx="28" cy="22" r="2" fill="#ffffff" opacity="0.6"/>
      </svg>
    );
    case "mysql": return (
      <svg viewBox="0 0 48 48" style={s} xmlns="http://www.w3.org/2000/svg">
        <path d="M24 6C14 6 8 12 8 18c0 8 16 22 16 22s16-14 16-22c0-6-6-12-16-12z" fill="#4479A1"/>
        <path d="M20 18c2-3 6-3 8 0l-4 8z" fill="#F29111"/>
      </svg>
    );
    case "docker": return (
      <svg viewBox="0 0 48 48" style={s} xmlns="http://www.w3.org/2000/svg">
        <rect x="8" y="20" width="32" height="18" rx="4" fill="#2496ED"/>
        <rect x="12" y="24" width="4" height="4" rx="1" fill="#ffffff" opacity="0.7"/>
        <rect x="18" y="24" width="4" height="4" rx="1" fill="#ffffff" opacity="0.7"/>
        <rect x="24" y="24" width="4" height="4" rx="1" fill="#ffffff" opacity="0.7"/>
        <rect x="12" y="30" width="4" height="4" rx="1" fill="#ffffff" opacity="0.7"/>
        <rect x="18" y="30" width="4" height="4" rx="1" fill="#ffffff" opacity="0.7"/>
        <path d="M32 26c1-2 4-2 5 0" stroke="#ffffff" stroke-width="2" fill="none" opacity="0.7"/>
        <rect x="14" y="16" width="22" height="4" rx="2" fill="#2496ED"/>
      </svg>
    );
    case "github": return (
      <svg viewBox="0 0 48 48" style={s} xmlns="http://www.w3.org/2000/svg">
        <circle cx="24" cy="24" r="20" fill="#181717"/>
        <path d="M24 10c-7.7 0-14 6.3-14 14 0 6.2 4 11.4 9.6 13.2.7.1.9-.3.9-.7v-2.4c-3.9.9-4.8-1.9-4.8-1.9-.6-1.6-1.6-2-1.6-2-1.3-.9.1-.9.1-.9 1.4.1 2.2 1.5 2.2 1.5 1.3 2.2 3.4 1.5 4.2 1.2.1-.9.5-1.5.9-1.9-3.1-.4-6.4-1.6-6.4-7 0-1.5.5-2.8 1.4-3.8-.1-.4-.6-1.8.1-3.7 0 0 1.1-.4 3.8 1.4 1.1-.3 2.3-.5 3.5-.5s2.4.2 3.5.5c2.7-1.8 3.8-1.4 3.8-1.4.7 1.9.2 3.3.1 3.7.9 1 1.4 2.3 1.4 3.8 0 5.4-3.3 6.6-6.4 7 .5.4.9 1.3.9 2.6v3.8c0 .4.2.8.9.7C34 35.4 38 30.2 38 24c0-7.7-6.3-14-14-14z" fill="#ffffff"/>
      </svg>
    );
    case "powerbi": return (
      <svg viewBox="0 0 48 48" style={s} xmlns="http://www.w3.org/2000/svg">
        <rect x="4" y="4" width="40" height="40" rx="6" fill="#F2C811"/>
        <rect x="10" y="24" width="6" height="14" rx="2" fill="#ffffff"/>
        <rect x="18" y="16" width="6" height="22" rx="2" fill="#ffffff"/>
        <rect x="26" y="20" width="6" height="18" rx="2" fill="#ffffff"/>
        <rect x="34" y="12" width="6" height="26" rx="2" fill="#ffffff"/>
      </svg>
    );
    case "openai": return (
      <svg viewBox="0 0 48 48" style={s} xmlns="http://www.w3.org/2000/svg">
        <path d="M24 8c-2 0-4 1-5 3l-8 14c-1 2-1 5 1 6l5 3c1.5 1 3.5 1 5 0l4-2.5 4 2.5c1.5 1 3.5 1 5 0l5-3c2-1 2-4 1-6l-8-14c-1-2-3-3-5-3z" fill="#412991"/>
        <circle cx="24" cy="22" r="5" fill="#ffffff" opacity="0.9"/>
      </svg>
    );
    default: return null;
  }
}

const TechCarouselSection = () => (
  <section className="relative w-full border-b border-gray-100 bg-white py-6" style={{ boxShadow: "0 4px 12px rgba(0,0,0,0.06)" }}>
    <div className="container mx-auto px-4 max-w-7xl">
      <p className="mb-5 text-center text-sm font-bold uppercase tracking-wide text-blue-600">
        Algunas de las tecnologías que utilizamos
      </p>
    </div>

    {/* carousel track */}
    <div className="relative overflow-hidden">
      {/* gradient fade edges */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-20 bg-gradient-to-r from-white to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-20 bg-gradient-to-l from-white to-transparent" />

      <div className="flex w-max animate-marquee gap-10">
        {[...techs, ...techs].map((t, i) => (
          <div key={i} className="flex shrink-0 items-center gap-2.5">
            <Logo type={t.logo} color={t.color} />
            <span className="text-sm font-semibold" style={{ color: t.color }}>{t.name}</span>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default TechCarouselSection;