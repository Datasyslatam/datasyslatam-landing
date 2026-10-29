import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { Send, CheckCircle2, AlertCircle } from "lucide-react";
import { SUBMIT_ERROR_MESSAGES, submitWeb3Forms } from "@/lib/web3forms";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show:   { opacity: 1, y: 0 },
};

/** subject: asunto del correo; las páginas de servicios lo cambian para saber de dónde llegó cada solicitud. */
const ContactSection = ({ subject = "Nuevo mensaje de contacto - DatasysLatam Group" }: { subject?: string }) => {
  const [submitted,   setSubmitted]   = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [errors, setErrors]           = useState<Record<string, string>>({});

  const validate = (data: Record<string, string>) => {
    const errs: Record<string, string> = {};
    if (!data.name.trim())    errs.name    = "El nombre es obligatorio.";
    if (!data.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email))
                               errs.email   = "Ingrese un correo válido.";
    if (!data.message.trim()) errs.message = "El mensaje es obligatorio.";
    return errs;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const data = {
      name:    String(formData.get("name")    ?? ""),
      email:   String(formData.get("email")   ?? ""),
      company: String(formData.get("company") ?? ""),
      message: String(formData.get("message") ?? ""),
    };
    const validationErrors = validate(data);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    setSubmitError("");
    // Honeypot: los bots suelen marcar el campo oculto; se descarta sin enviar.
    if (formData.get("botcheck")) {
      setSubmitted(true);
      form.reset();
      return;
    }
    setIsSubmitting(true);
    const result = await submitWeb3Forms({ subject, ...data });
    setIsSubmitting(false);
    if (result.ok) {
      setSubmitted(true);
      form.reset();
    } else {
      setSubmitError(SUBMIT_ERROR_MESSAGES[result.reason]);
    }
  };

  const resetForm = () => {
    setSubmitted(false);
    setSubmitError("");
    setErrors({});
  };

  const inputBase =
    "w-full px-4 py-3 rounded bg-navy-800/60 border text-hero-foreground text-sm placeholder:text-steel-500 focus:outline-none focus:ring-1 focus:ring-primary transition-colors duration-200";
  const inputOk  = "border-navy-600 focus:border-primary";
  const inputErr = "border-destructive/60 focus:border-destructive";

  return (
    <section id="contacto" className="relative overflow-hidden py-16" style={{ background: "linear-gradient(135deg, #061224 0%, #0A192F 100%)" }}>
      {/* node-network background */}
      <svg className="pointer-events-none absolute inset-0 h-full w-full" preserveAspectRatio="none" viewBox="0 0 1000 600" aria-hidden="true" style={{ opacity: 0.22 }}>
        <defs>
          <radialGradient id="cng" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#00B4D8" stopOpacity="0.45"/>
            <stop offset="100%" stopColor="#00B4D8" stopOpacity="0"/>
          </radialGradient>
        </defs>
        <polyline points="80,150 220,180 360,120 500,200 640,150 780,210 920,160" fill="none" stroke="#00B4D8" strokeWidth="1.5" opacity="0.5"/>
        <polyline points="40,350 180,300 320,380 460,320 600,390 740,310 880,370" fill="none" stroke="#0052CC" strokeWidth="1.5" opacity="0.4"/>
        <polyline points="100,480 260,420 400,500 540,430 680,490 820,400 960,460" fill="none" stroke="#00B4D8" strokeWidth="1" opacity="0.3"/>
        <g fill="#00B4D8">
          <circle cx="220" cy="180" r="3"/><circle cx="500" cy="200" r="4"/><circle cx="780" cy="210" r="3"/>
          <circle cx="180" cy="300" r="3"/><circle cx="460" cy="320" r="4"/><circle cx="740" cy="310" r="3"/>
          <circle cx="260" cy="420" r="3"/><circle cx="540" cy="430" r="4"/><circle cx="820" cy="400" r="3"/>
        </g>
        <circle cx="200" cy="120" r="60" fill="url(#cng)"/>
        <circle cx="650" cy="280" r="80" fill="url(#cng)"/>
        <circle cx="850" cy="480" r="50" fill="url(#cng)"/>
      </svg>

      <div className="relative z-10 container mx-auto px-4 max-w-6xl">

        {/* Encabezado */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          className="mb-8"
        >
          <p className="label-corp text-electric-400 mb-3">Contacto</p>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight">
              Hablemos de su <span className="gradient-text">próximo</span>{" "}
              proyecto
            </h2>
            <p className="text-steel-300 text-sm leading-relaxed max-w-sm">
              Nuestro equipo está disponible para evaluar sus necesidades y proponer una solución a medida.
            </p>
          </div>
        </motion.div>

        {/* Divisor */}
        <div className="border-t border-navy-700/60 mb-8" />

        <div className="grid lg:grid-cols-5 gap-8">

          {/* Info lateral */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-2 flex flex-col gap-5"
          >
            <div className="flex flex-col gap-5">
              <h3 className="text-2xl font-bold text-white">
                ¿Tiene en mente un desafío tecnológico?
              </h3>
              <p className="text-sm leading-relaxed text-white/70">
                Cuéntenos qué necesita transformar. Nuestro equipo puede ayudarle a convertir su necesidad empresarial en una solución tecnológica que genere resultados positivos.
              </p>
            </div>
          </motion.div>

          {/* Formulario */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-3"
          >
            {submitted ? (
              <div className="flex flex-col items-center justify-center gap-4 p-8 rounded-lg border border-primary/30 bg-primary/5 text-center h-full min-h-[320px]">
                <CheckCircle2 size={40} className="text-primary" strokeWidth={1.5} />
                <h3 className="font-heading font-semibold text-white text-xl">Mensaje enviado</h3>
                <p className="text-sm text-steel-300 max-w-xs leading-relaxed">
                  Gracias por contactarnos. Nos pondremos en contacto con usted a la brevedad.
                </p>
              <button
                type="button"
                onClick={resetForm}
                className="mt-2 inline-flex items-center gap-2 px-5 py-2.5 rounded border border-white/30 text-sm font-semibold text-white/80 hover:bg-white/10 transition-all duration-200"
              >
                Enviar otro mensaje
              </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
                {/* Honeypot anti-spam (Web3Forms) */}
                <input type="checkbox" name="botcheck" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />

                {/* Nombre + Email */}
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="contact-name" className="block text-xs font-medium text-steel-300 mb-1.5 tracking-wide">
                      Nombre <span className="text-destructive">*</span>
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      name="name"
                      autoComplete="name"
                      maxLength={100}
                      aria-invalid={!!errors.name}
                      placeholder="Su nombre completo"
                      className={`${inputBase} ${errors.name ? inputErr : inputOk}`}
                    />
                    {errors.name && (
                      <p className="mt-1.5 text-xs text-destructive flex items-center gap-1">
                        <AlertCircle size={12} /> {errors.name}
                      </p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="contact-email" className="block text-xs font-medium text-steel-300 mb-1.5 tracking-wide">
                      Correo electrónico <span className="text-destructive">*</span>
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      name="email"
                      autoComplete="email"
                      maxLength={150}
                      aria-invalid={!!errors.email}
                      placeholder="correo@empresa.com"
                      className={`${inputBase} ${errors.email ? inputErr : inputOk}`}
                    />
                    {errors.email && (
                      <p className="mt-1.5 text-xs text-destructive flex items-center gap-1">
                        <AlertCircle size={12} /> {errors.email}
                      </p>
                    )}
                  </div>
                </div>

                {/* Empresa */}
                <div>
                  <label htmlFor="contact-company" className="block text-xs font-medium text-steel-300 mb-1.5 tracking-wide">
                    Empresa <span className="text-steel-500 font-normal">(opcional)</span>
                  </label>
                  <input
                    id="contact-company"
                    type="text"
                    name="company"
                    autoComplete="organization"
                    maxLength={150}
                    placeholder="Nombre de su organización"
                    className={`${inputBase} ${inputOk}`}
                  />
                </div>

                {/* Mensaje */}
                <div>
                  <label htmlFor="contact-message" className="block text-xs font-medium text-steel-300 mb-1.5 tracking-wide">
                    Mensaje <span className="text-destructive">*</span>
                  </label>
                  <textarea
                    id="contact-message"
                    name="message"
                    maxLength={5000}
                    aria-invalid={!!errors.message}
                    rows={5}
                    placeholder="Cuéntenos sobre su proyecto o necesidad…"
                    className={`${inputBase} resize-none ${errors.message ? inputErr : inputOk}`}
                  />
                  {errors.message && (
                    <p className="mt-1.5 text-xs text-destructive flex items-center gap-1">
                      <AlertCircle size={12} /> {errors.message}
                    </p>
                  )}
                </div>

                {/* Error global */}
                {submitError && (
                  <p className="text-sm text-destructive flex items-center gap-1.5">
                    <AlertCircle size={14} /> {submitError}
                  </p>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="self-start inline-flex items-center gap-2.5 px-7 py-3 rounded bg-[#FF6B00] text-white font-semibold text-sm tracking-wide hover:bg-[#FF8040] disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 shadow-card"
                >
                  <Send size={15} strokeWidth={1.8} />
              {isSubmitting ? "Enviando..." : "Solicitar asesoría"}
                </button>
              </form>
            )}
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default ContactSection;
