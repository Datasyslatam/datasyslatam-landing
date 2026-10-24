// Forma y colores compartidos por los botones de todas las diapositivas del hero.
const HERO_BTN = "inline-flex items-center justify-center gap-2 rounded-md px-5 py-3 text-sm font-semibold transition-colors duration-200";

export const heroBtnBlue = `${HERO_BTN} bg-primary text-white shadow-card hover:bg-electric-400`;
// Texto oscuro sobre naranja: el blanco no alcanza contraste suficiente en texto pequeño.
export const heroBtnOrange = `${HERO_BTN} bg-[#FF8024] text-navy-900 hover:brightness-110`;
export const heroBtnOutline = `${HERO_BTN} border border-white/70 text-white hover:bg-white/10`;
/** Variante de contorno para fondos claros (p. ej. el diálogo del autodiagnóstico). */
export const heroBtnOutlineLight = `${HERO_BTN} border border-navy-900/25 text-navy-900 hover:bg-navy-900/5`;
