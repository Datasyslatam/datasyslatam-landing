const WHATSAPP_NUMBER = "573246249237";

/** Enlace de WhatsApp con un mensaje inicial ya escrito. */
export const whatsappUrl = (text: string) => `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
