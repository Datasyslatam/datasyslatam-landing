import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { Send, MapPin, Mail, Phone } from "lucide-react";

const contactInfo = [
  { icon: MapPin, text: "Barranquilla, Atlántico, Colombia" },
  { icon: Mail, text: "contacto@datasyslatam.com" },
  { icon: Phone, text: "+57 324-624-9237" },
];

const web3FormsAccessKey = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY;

const ContactSection = () => {
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (data: Record<string, string>) => {
    const errs: Record<string, string> = {};
    if (!data.name.trim()) errs.name = "El nombre es obligatorio";
    if (!data.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      errs.email = "Ingresa un correo válido";
    }
    if (!data.message.trim()) errs.message = "El mensaje es obligatorio";
    return errs;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const data = {
      name: String(formData.get("name") ?? ""),
      email: String(formData.get("email") ?? ""),
      company: String(formData.get("company") ?? ""),
      message: String(formData.get("message") ?? ""),
    };

    const validationErrors = validate(data);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    if (!web3FormsAccessKey) {
      setSubmitError("El formulario no está configurado. Inténtalo más tarde o usa el correo de contacto.");
      return;
    }

    setErrors({});
    setSubmitError("");
    setIsSubmitting(true);

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          ...data,
          access_key: web3FormsAccessKey,
          subject: "Nuevo mensaje de contacto - Sitio web",
        }),
      });
      const result = (await response.json()) as { success?: boolean };

      if (!response.ok || !result.success) {
        throw new Error("Web3Forms rejected the request");
      }

      setSubmitted(true);
      form.reset();
      window.setTimeout(() => setSubmitted(false), 5000);
    } catch (error) {
      console.error("Contact form submission failed:", error);
      setSubmitError("No fue posible enviar el mensaje. Revisa tu conexión e inténtalo nuevamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass =
    "w-full bg-card border border-border rounded-lg px-4 py-3 text-sm text-card-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow";

  return (
    <section id="contacto" className="py-24 bg-muted/50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-lm font-semibold uppercase tracking-widest mb-3" style={{ color: "#e8711a" }}>
            Contáctenos
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            Hablemos de tu <span className="gradient-text">próximo proyecto</span>
          </h2>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
          >
            <div>
              <h3 className="text-xl font-bold text-foreground mb-4">DataSys Latam Group S.A.S.</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Empresa de tecnología enfocada en soluciones informáticas, asesoramiento en implementación de
                sistemas de calidad, infraestructura tecnológica y transformación digital.
              </p>
            </div>

            <div className="space-y-4">
              {contactInfo.map((item) => (
                <div key={item.text} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <item.icon size={18} className="text-primary" />
                  </div>
                  <span className="text-sm text-foreground">{item.text}</span>
                </div>
              ))}
            </div>

            <div className="p-6 rounded-xl bg-card border border-border card-shadow">
              <p className="text-xs text-muted-foreground leading-relaxed">
                <strong className="text-foreground">Nota legal:</strong> DataSys Latam Group S.A.S. (sigla
                comercial DATASYSLATAM S.A.S.) - Sociedad por Acciones Simplificada constituida en 2026 bajo las
                leyes de la República de Colombia. Los datos personales recopilados a través de este formulario
                serán tratados conforme a la Ley 1581 de 2012 y su decreto reglamentario 1377 de 2013.
              </p>
            </div>
          </motion.div>

          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-card rounded-xl p-8 border border-border card-shadow space-y-5"
            noValidate
          >
            {submitted && (
              <div role="status" className="bg-green-50 border border-green-200 text-green-800 rounded-lg px-4 py-3 text-sm font-medium">
                ¡Mensaje enviado! Nos comunicaremos pronto.
              </div>
            )}
            {submitError && (
              <div role="alert" className="bg-red-50 border border-red-200 text-red-800 rounded-lg px-4 py-3 text-sm font-medium">
                {submitError}
              </div>
            )}

            <div>
              <label htmlFor="name" className="block text-sm font-medium text-card-foreground mb-1.5">Nombre completo *</label>
              <input id="name" name="name" type="text" className={inputClass} placeholder="Tu nombre" maxLength={100} aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? "name-error" : undefined} />
              {errors.name && <p id="name-error" className="text-xs text-destructive mt-1">{errors.name}</p>}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-card-foreground mb-1.5">Correo electrónico *</label>
              <input id="email" name="email" type="email" className={inputClass} placeholder="correo@empresa.com" maxLength={255} aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? "email-error" : undefined} />
              {errors.email && <p id="email-error" className="text-xs text-destructive mt-1">{errors.email}</p>}
            </div>

            <div>
              <label htmlFor="company" className="block text-sm font-medium text-card-foreground mb-1.5">Empresa</label>
              <input id="company" name="company" type="text" className={inputClass} placeholder="Nombre de tu empresa" maxLength={100} />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-card-foreground mb-1.5">Mensaje *</label>
              <textarea id="message" name="message" rows={4} className={inputClass} placeholder="Cuéntanos sobre tu proyecto..." maxLength={1000} aria-invalid={Boolean(errors.message)} aria-describedby={errors.message ? "message-error" : undefined} />
              {errors.message && <p id="message-error" className="text-xs text-destructive mt-1">{errors.message}</p>}
            </div>

            <p className="text-xs text-muted-foreground">
              Al enviar aceptas el tratamiento de tus datos personales conforme a la Ley 1581 de 2012.
            </p>

            <button type="submit" disabled={isSubmitting} className="w-full gradient-bg text-primary-foreground font-semibold py-3 px-6 rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2 glow-shadow disabled:cursor-not-allowed disabled:opacity-70">
              <Send size={16} />
              {isSubmitting ? "Enviando..." : "Enviar mensaje"}
            </button>
          </motion.form>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
