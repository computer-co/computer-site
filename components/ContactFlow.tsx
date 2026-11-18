"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Check, CornerDownLeft, X } from "lucide-react";
import { brand, contactFlow, contactHash, scheduleUrl } from "@/lib/content";

/**
 * Formulário de qualificação em tela cheia, uma pergunta por vez.
 * Abre a partir de qualquer link para `#falar-com-o-time` (todos os CTAs
 * "Falar com o time"). No fim, envia o lead para /api/lead e mostra a agenda
 * do Calendly já preenchida.
 */

type Data = {
  nome: string;
  empresa: string;
  cargo: string;
  faturamento: string;
  motivo: string;
  email: string;
  whatsapp: string;
  site: string;
};

const empty: Data = {
  nome: "",
  empresa: "",
  cargo: "",
  faturamento: "",
  motivo: "",
  email: "",
  whatsapp: "",
  site: "",
};

type StepId = "nome" | "empresa" | "cargo" | "faturamento" | "motivo" | "contato";
const STEPS: StepId[] = ["nome", "empresa", "contato", "cargo", "faturamento", "motivo"];
// mínimo de caracteres para a pessoa descrever o problema de verdade
const MOTIVO_MIN = 120;
const MOTIVO_MAX = 1500;
const LETTERS = "ABCDEFGH";
// tempo que a pergunta anterior fica montada (inerte) enquanto some e a nova entra
const OUT_MS = 400;

const firstName = (n: string) => n.trim().split(/\s+/)[0] ?? "";

function maskPhone(v: string) {
  const d = v.replace(/\D/g, "").slice(0, 11);
  if (d.length <= 2) return d.length ? `(${d}` : "";
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());
// site (empresa.com.br, https://…) ou perfil (@empresa, instagram.com/empresa)
const isSiteOrProfile = (v: string) => {
  const t = v.trim();
  return /^@[\w.]{2,}$/.test(t) || /^(https?:\/\/)?[^\s.]+(\.[^\s.]+)+(\/\S*)?$/i.test(t);
};

// E-mail com domínio próprio já diz qual é o site da empresa. Só pedimos o
// site (ou Instagram) quando o e-mail é de um provedor genérico.
const GENERIC_PROVIDERS = new Set([
  "gmail", "googlemail", "hotmail", "outlook", "live", "msn", "yahoo", "ymail",
  "icloud", "me", "mac", "bol", "uol", "terra", "ig", "globo", "globomail",
  "protonmail", "proton", "aol", "gmx", "zoho", "yandex", "mail", "zipmail",
]);
const emailDomain = (v: string) => v.trim().toLowerCase().split("@")[1] ?? "";
const isGenericEmail = (v: string) =>
  isEmail(v) && GENERIC_PROVIDERS.has(emailDomain(v).split(".")[0]);

export default function ContactFlow() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState<"fwd" | "back">("fwd");
  // pergunta anterior, mantida na tela enquanto some (crossfade com a nova)
  const [prev, setPrev] = useState<{ id: StepId; dir: "fwd" | "back"; n: number } | null>(null);
  const prevTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const [data, setData] = useState<Data>(empty);
  const [error, setError] = useState("");
  const [shake, setShake] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [sending, setSending] = useState(false);
  const [otherCargo, setOtherCargo] = useState(false);
  const honeypot = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const lastFocus = useRef<HTMLElement | null>(null);

  const id = STEPS[step];
  const total = STEPS.length;
  const progress = done ? 1 : step / total;

  // ---- abrir / fechar -------------------------------------------------------
  const openFlow = useCallback(() => {
    lastFocus.current = document.activeElement as HTMLElement | null;
    setOpen(true);
  }, []);

  const close = useCallback(() => {
    setOpen(false);
    if (window.location.hash === contactHash) {
      history.replaceState(null, "", window.location.pathname + window.location.search);
    }
    // depois de concluído, o próximo clique recomeça do zero
    if (done) {
      setTimeout(() => {
        setDone(false);
        setStep(0);
        setData(empty);
        setOtherCargo(false);
      }, 400);
    }
    lastFocus.current?.focus?.();
  }, [done]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey) return;
      const a = (e.target as HTMLElement).closest?.("a");
      if (!a) return;
      const href = a.getAttribute("href") ?? "";
      if (href.endsWith(contactHash)) {
        e.preventDefault();
        openFlow();
      }
    };
    const onHash = () => window.location.hash === contactHash && openFlow();
    document.addEventListener("click", onClick, true);
    window.addEventListener("hashchange", onHash);
    onHash(); // link direto: site.com/#falar-com-o-time
    return () => {
      document.removeEventListener("click", onClick, true);
      window.removeEventListener("hashchange", onHash);
    };
  }, [openFlow]);

  // trava o scroll da página enquanto aberto
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    // depois que o overlay terminou de abrir, esconde o site por baixo
    // (html.cf-lock no globals.css): o navegador para de compor a página
    // inteira atrás do formulário a cada frame
    const lock = setTimeout(() => document.documentElement.classList.add("cf-lock"), 400);
    return () => {
      clearTimeout(lock);
      document.documentElement.classList.remove("cf-lock");
      document.body.style.overflow = prev;
    };
  }, [open]);

  // foca o primeiro campo de cada etapa
  useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => {
      const el = panelRef.current?.querySelector<HTMLElement>("[data-autofocus]");
      el?.focus({ preventScroll: true });
    }, 60);
    return () => clearTimeout(t);
  }, [open, step, done, otherCargo]);

  // ---- navegação ------------------------------------------------------------
  const fail = (msg: string) => {
    setError(msg);
    setShake((n) => n + 1);
  };

  // Fade-through: a pergunta anterior continua montada (inerte) enquanto some
  // rápido; a nova entra logo em seguida, na mesma posição ancorada.
  const transition = (d: "fwd" | "back", apply: () => void) => {
    setPrev({ id, dir: d, n: Date.now() });
    setDir(d);
    apply();
    clearTimeout(prevTimer.current);
    prevTimer.current = setTimeout(() => setPrev(null), OUT_MS);
  };

  const go = (to: number) =>
    transition(to > step ? "fwd" : "back", () => {
      setError("");
      setPicked(null);
      setStep(to);
    });

  // "parcial": enviado assim que a pessoa passa do contato (não perdemos quem
  // desiste no meio). "completo": enviado no fim, com todas as respostas.
  const sendLead = (d: Data, etapa: "parcial" | "completo") =>
    fetch("/api/lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      keepalive: true,
      body: JSON.stringify({
        ...d,
        etapa,
        website: honeypot.current?.value ?? "",
        origem: window.location.pathname,
      }),
    }).catch(() => {
      // não trava a pessoa: ela ainda consegue seguir e agendar
    });

  const submit = async (final: Data) => {
    setSending(true);
    await sendLead(final, "completo");
    setSending(false);
    transition("fwd", () => setDone(true));
  };

  const next = (override?: Partial<Data>) => {
    const d = { ...data, ...override };
    switch (id) {
      case "nome":
        if (d.nome.trim().length < 2) return fail("Conta pra gente seu nome.");
        break;
      case "empresa":
        if (!d.empresa.trim()) return fail("Qual o nome da empresa?");
        break;
      case "cargo":
        if (!d.cargo.trim()) return fail("Escolha uma opção ou escreva seu cargo.");
        break;
      case "faturamento":
        if (!d.faturamento) return fail("Escolha uma faixa.");
        break;
      case "motivo": {
        const falta = MOTIVO_MIN - d.motivo.trim().length;
        if (falta > 0)
          return fail(`Conta um pouco mais: faltam ${falta} caracteres. Quanto mais contexto, melhor a conversa.`);
        return submit(d);
      }
      case "contato":
        if (!isEmail(d.email)) return fail("Esse e-mail parece incompleto.");
        if (isGenericEmail(d.email)) {
          if (!isSiteOrProfile(d.site))
            return fail("Coloque o site da empresa ou o @ do Instagram.");
        } else {
          // e-mail corporativo: o domínio é o site
          d.site = emailDomain(d.email);
        }
        if (d.whatsapp.replace(/\D/g, "").length < 10)
          return fail("Inclua o DDD no WhatsApp.");
        setData(d);
        sendLead(d, "parcial");
        break;
    }
    go(step + 1);
  };

  const pick = (field: "cargo" | "faturamento", value: string) => {
    setPicked(value);
    setData((d) => ({ ...d, [field]: value }));
    // pequena pausa para o "check" respirar antes de avançar
    setTimeout(
      () =>
        transition("fwd", () => {
          setError("");
          setPicked(null);
          setStep((s) => s + 1);
        }),
      320,
    );
  };

  const set = (field: keyof Data) => (v: string) => {
    setError("");
    setData((d) => ({ ...d, [field]: v }));
  };

  // teclado: Esc fecha; letras escolhem opções; Enter avança
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") return close();
      if (done || picked) return;
      const target = e.target as HTMLElement;
      const typing = target.tagName === "INPUT" || target.tagName === "TEXTAREA";
      if ((id === "cargo" || id === "faturamento") && !typing && !e.metaKey && !e.ctrlKey) {
        const opts = id === "cargo" ? contactFlow.cargos : contactFlow.faturamentos;
        const i = LETTERS.indexOf(e.key.toUpperCase());
        if (i >= 0 && i < opts.length) {
          e.preventDefault();
          if (id === "cargo" && i === opts.length - 1) {
            setOtherCargo(true);
          } else {
            pick(id, opts[i]);
          }
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // `pick` só usa setters e refs: uma cópia antiga dele se comporta igual
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, id, done, picked, close]);

  const onEnter = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      next();
    }
  };

  // texto longo: Enter quebra linha; Ctrl/⌘ + Enter avança
  const onCtrlEnter = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      next();
    }
  };

  // ---- agenda (Calendly pré-preenchido) -------------------------------------
  const calendlySrc = useMemo(() => {
    if (!done) return "";
    const p = new URLSearchParams({
      embed_type: "Inline",
      embed_domain: typeof window !== "undefined" ? window.location.host : "",
      hide_gdpr_banner: "1",
      hide_event_type_details: "1",
      background_color: "f2f1ec",
      text_color: "111111",
      primary_color: "111111",
      name: data.nome.trim(),
      email: data.email.trim(),
      a1: [
        `${data.cargo} na ${data.empresa}`,
        `Faturamento: ${data.faturamento}`,
        `Site/perfil: ${data.site}`,
        `WhatsApp: ${data.whatsapp}`,
        `Motivo: ${data.motivo}`,
      ]
        .filter(Boolean)
        .join("\n"),
    });
    return `${scheduleUrl}?${p.toString()}`;
  }, [done, data]);

  if (!open) return null;

  const fn = firstName(data.nome);

  const renderStep = (sid: StepId) => (
    <>
                {sid === "nome" && (
                  <Question
                    eyebrow={contactFlow.intro}
                    title="Para começar, como podemos te chamar?"
                  >
                    <BigInput
                      value={data.nome}
                      onChange={set("nome")}
                      onKeyDown={onEnter}
                      placeholder="Seu nome"
                      autoComplete="name"
                    />
                  </Question>
                )}

                {sid === "empresa" && (
                  <Question title={<>Prazer, {fn}. <Muted>Em qual empresa você está?</Muted></>}>
                    <BigInput
                      value={data.empresa}
                      onChange={set("empresa")}
                      onKeyDown={onEnter}
                      placeholder="Nome da empresa"
                      autoComplete="organization"
                    />
                  </Question>
                )}

                {sid === "cargo" && (
                  <Question title={<>E qual é o seu cargo, {fn}?</>}>
                    {!otherCargo ? (
                      <Options
                        options={contactFlow.cargos}
                        value={data.cargo}
                        picked={picked}
                        onPick={(v, i) =>
                          i === contactFlow.cargos.length - 1
                            ? (setData((d) => ({ ...d, cargo: "" })), setOtherCargo(true))
                            : pick("cargo", v)
                        }
                      />
                    ) : (
                      <div>
                        <BigInput
                          value={data.cargo}
                          onChange={set("cargo")}
                          onKeyDown={onEnter}
                          placeholder="Seu cargo"
                          autoComplete="organization-title"
                        />
                        <button
                          type="button"
                          onClick={() => setOtherCargo(false)}
                          className="mt-4 text-[13px] text-muted underline-offset-4 hover:text-ink hover:underline"
                        >
                          Ver opções de novo
                        </button>
                      </div>
                    )}
                  </Question>
                )}

                {sid === "faturamento" && (
                  <Question
                    title="Qual o faturamento anual da empresa?"
                    hint="Ajuda a gente a chegar na conversa com a proposta certa. Fica só entre nós."
                  >
                    <Options
                      options={contactFlow.faturamentos}
                      value={data.faturamento}
                      picked={picked}
                      onPick={(v) => pick("faturamento", v)}
                    />
                  </Question>
                )}

                {sid === "motivo" && (
                  <Question
                    title={<>Por que você quer conversar com a gente, {fn}?</>}
                    hint={
                      <>
                        <p>
                          Descreva o problema como ele é hoje: o que acontece, quem faz, quanto
                          tempo leva e o que dá errado.
                        </p>
                        <p className="mt-4">
                          Quanto mais informação, melhor: é com ela que a gente chega na reunião
                          já com a solução pensada para o seu problema.
                        </p>
                      </>
                    }
                  >
                    <BigInput
                      as="textarea"
                      value={data.motivo}
                      onChange={set("motivo")}
                      onKeyDown={onCtrlEnter}
                      maxLength={MOTIVO_MAX}
                      examples={contactFlow.exemplosMotivo}
                    />
                    <MinMeter count={data.motivo.trim().length} min={MOTIVO_MIN} />
                  </Question>
                )}

                {sid === "contato" && (
                  <Question title={<>Antes de seguir, {fn}. <Muted>Onde a gente te encontra?</Muted></>}>
                    <div className="space-y-7">
                      <BigInput
                        label="E-mail"
                        type="email"
                        inputMode="email"
                        value={data.email}
                        onChange={set("email")}
                        onKeyDown={onEnter}
                        placeholder="voce@empresa.com"
                        autoComplete="email"
                      />
                      {/* site aparece logo abaixo do e-mail, só se o e-mail for genérico */}
                      {isGenericEmail(data.email) && (
                      <div className="cf-in-fwd">
                        <BigInput
                          label="Site da empresa"
                          type="url"
                          inputMode="url"
                          value={data.site}
                          onChange={set("site")}
                          onKeyDown={onEnter}
                          placeholder="empresa.com.br"
                          autoComplete="url"
                          autoFocus={false}
                        />
                        <p className="mt-2.5 text-[13px] leading-relaxed text-muted">
                          Ainda não tem site? Coloque o Instagram (<span className="text-ink">@empresa</span>) ou
                          outro perfil online da empresa.
                        </p>
                      </div>
                      )}
                      <BigInput
                        label="WhatsApp"
                        type="tel"
                        inputMode="tel"
                        value={data.whatsapp}
                        onChange={(v) => set("whatsapp")(maskPhone(v))}
                        onKeyDown={onEnter}
                        placeholder="(11) 98765-4321"
                        autoComplete="tel-national"
                        autoFocus={false}
                      />
                      <p className="text-[12px] leading-relaxed text-muted">
                        Usamos esses dados só para falar com você sobre esta conversa. Nada de spam.
                      </p>
                    </div>
                  </Question>
                )}
    </>
  );

  // ---- render ---------------------------------------------------------------
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Falar com o time"
      className="cf-overlay fixed inset-0 z-[100] flex flex-col bg-paper text-ink"
    >
      {/* barra de progresso */}
      <div className="absolute inset-x-0 top-0 h-[3px] bg-line/50">
        <div
          // scaleX (GPU) em vez de width: animar width recalcula o layout a cada frame
          className="h-full w-full origin-left bg-accent transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform"
          style={{ transform: `scaleX(${Math.max(progress, 0.04)})` }}
        />
      </div>

      {/* topo */}
      <div className="shell flex h-16 shrink-0 items-center justify-between pt-2">
        <span className="flex items-center gap-2">
          <span
            aria-hidden
            className="grid h-7 w-7 place-items-center bg-ink font-serif text-[15px] italic leading-none text-paper"
          >
            {brand.mark}
          </span>
          <span className="hidden font-serif text-[17px] tracking-tight sm:inline">
            {brand.name}
          </span>
        </span>
        <div className="flex items-center gap-5">
          {!done && (
            <span className="eyebrow tabular-nums">
              {String(step + 1).padStart(2, "0")}
              <span className="mx-1.5 text-line">/</span>
              {String(total).padStart(2, "0")}
            </span>
          )}
          <button
            type="button"
            onClick={close}
            aria-label="Fechar"
            className="grid h-10 w-10 place-items-center rounded-full text-muted transition-colors hover:bg-beige hover:text-ink"
          >
            <X size={20} strokeWidth={1.75} />
          </button>
        </div>
      </div>

      {/* honeypot anti-spam: invisível para pessoas */}
      <input
        ref={honeypot}
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden
        className="absolute -left-[9999px] h-0 w-0 opacity-0"
      />

      {/* palco */}
      <div ref={panelRef} className="flex-1 overflow-y-auto">
        <div className="shell flex min-h-full flex-col">
          {!done ? (
            // pergunta centralizada na vertical. A anterior fica numa camada
            // absoluta, também centralizada por conta própria: assim nenhuma das
            // duas muda de lugar durante a troca, mesmo com alturas diferentes.
            <div className="relative mx-auto flex w-full max-w-2xl flex-1 flex-col">
                <div
                  key={`${id}-${otherCargo}`}
                  className={`cf-stage cf-in-${dir} flex flex-1 flex-col justify-center py-10`}
                >
                {renderStep(id)}

                {/* erro */}
                <p
                  key={shake}
                  role="alert"
                  className={`mt-4 h-5 text-[13px] text-accent ${error ? "cf-shake" : ""}`}
                >
                  {error}
                </p>
                </div>

                {prev && (
                  <div
                    key={`prev-${prev.n}`}
                    aria-hidden
                    inert
                    className={`cf-stage cf-out-${prev.dir} pointer-events-none absolute inset-0 flex flex-col justify-center py-10`}
                  >
                    {renderStep(prev.id)}
                    {/* mesmo espaço da linha de erro, para centralizar igual */}
                    <p className="mt-4 h-5" />
                  </div>
                )}
            </div>
          ) : (
            <div className="cf-in-fwd mx-auto flex w-full max-w-5xl flex-1 flex-col py-8 md:py-10">
              <div className="mx-auto max-w-2xl text-center">
                <span className="cf-pop mx-auto mb-6 grid h-12 w-12 place-items-center rounded-full bg-ink text-paper">
                  <Check size={22} strokeWidth={2} />
                </span>
                <h2 className="font-display text-[clamp(1.9rem,4vw,2.8rem)] font-light leading-[1.1] tracking-[-0.02em] text-balance">
                  Tudo certo, {fn}. Agora escolha um horário.
                </h2>
                <p className="mt-4 text-[15px] leading-relaxed text-muted">
                  Suas respostas já estão com o time. Escolha o melhor horário para a
                  conversa — se preferir, a gente te chama no WhatsApp.
                </p>
              </div>
              <div className="relative mt-8 min-h-[680px] flex-1 overflow-hidden rounded-[6px] border border-line bg-paper">
                <div className="absolute inset-0 grid place-items-center">
                  <span className="cf-dots" aria-label="Carregando agenda" />
                </div>
                <iframe
                  title="Agendar conversa"
                  src={calendlySrc}
                  className="relative h-full min-h-[680px] w-full"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* rodapé de navegação */}
      {!done && (
        <div className="shell flex h-20 shrink-0 items-center justify-between border-t border-line/70">
          <button
            type="button"
            onClick={() => (otherCargo && id === "cargo" ? setOtherCargo(false) : go(step - 1))}
            disabled={step === 0}
            className="inline-flex items-center gap-2 text-[13px] text-muted transition-colors hover:text-ink disabled:pointer-events-none disabled:opacity-0"
          >
            <ArrowLeft size={16} strokeWidth={1.75} /> Voltar
          </button>

          <div className="flex items-center gap-4">
            {!((id === "cargo" && !otherCargo) || id === "faturamento") && (
              <>
                <span className="hidden items-center gap-1.5 text-[12px] text-muted md:inline-flex">
                  ou pressione{" "}
                  <kbd className="font-sans font-medium text-ink">
                    {id === "motivo" ? "Ctrl + Enter" : "Enter"}
                  </kbd>
                  <CornerDownLeft size={13} strokeWidth={1.75} />
                </span>
                <button
                  type="button"
                  onClick={() => next()}
                  disabled={sending}
                  className="group inline-flex items-center gap-2 rounded-[var(--radius-md)] border border-ink bg-ink px-6 py-3 text-[13px] font-medium tracking-wide text-paper transition-colors hover:bg-transparent hover:text-ink disabled:opacity-60"
                >
                  {id === "motivo" ? (sending ? "Enviando…" : "Ver horários") : "Continuar"}
                  <ArrowRight
                    size={15}
                    strokeWidth={1.75}
                    className="transition-transform duration-300 group-hover:translate-x-0.5"
                  />
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ---- peças ------------------------------------------------------------------

function Muted({ children }: { children: React.ReactNode }) {
  // segunda frase do título: sempre em linha própria, em cinza
  return <span className="block text-muted">{children}</span>;
}

function Question({
  eyebrow,
  title,
  hint,
  children,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  hint?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div>
      {eyebrow && <p className="cf-q-eyebrow eyebrow mb-5">{eyebrow}</p>}
      <h2 className="font-display text-[clamp(1.75rem,4.2vw,3rem)] font-light leading-[1.1] tracking-[-0.02em] text-balance">
        {title}
      </h2>
      {hint && <div className="cf-q-hint mt-4 max-w-lg text-[15px] leading-relaxed text-muted">{hint}</div>}
      <div className="cf-q-body mt-10">{children}</div>
    </div>
  );
}

function BigInput({
  as = "input",
  label,
  value,
  onChange,
  onKeyDown,
  placeholder,
  type = "text",
  inputMode,
  autoComplete,
  autoFocus = true,
  maxLength = 160,
  examples,
}: {
  examples?: readonly string[];
  as?: "input" | "textarea";
  label?: string;
  value: string;
  onChange: (v: string) => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  placeholder?: string;
  type?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  autoComplete?: string;
  autoFocus?: boolean;
  maxLength?: number;
}) {
  const cls =
    "peer w-full resize-none border-0 bg-transparent pb-3 font-display text-[clamp(1.4rem,3vw,2.1rem)] font-light tracking-[-0.01em] text-ink outline-none placeholder:text-ink/20";
  return (
    <label className="block">
      {label && <span className="eyebrow mb-2 block">{label}</span>}
      <span className="relative block">
        {as === "textarea" ? (
          <textarea
            rows={5}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder={placeholder}
            maxLength={maxLength}
            {...(autoFocus ? { "data-autofocus": true } : {})}
            className={`${cls} !text-[clamp(1.1rem,1.8vw,1.35rem)] leading-relaxed`}
          />
        ) : (
          <input
            type={type}
            inputMode={inputMode}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder={placeholder}
            autoComplete={autoComplete}
            maxLength={maxLength}
            {...(autoFocus ? { "data-autofocus": true } : {})}
            className={cls}
          />
        )}
        {/* exemplos que se revezam enquanto o campo está vazio */}
        {examples && !value && <RotatingExamples examples={examples} />}
        {/* linha base + linha que "desenha" no foco */}
        <span className="absolute inset-x-0 bottom-0 h-px bg-line" />
        <span className="absolute bottom-0 left-0 h-px w-full origin-left scale-x-0 bg-ink opacity-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] peer-focus:scale-x-100 peer-focus:opacity-100" />
      </span>
    </label>
  );
}

// Placeholder animado: troca de exemplo a cada poucos segundos com fade + leve
// subida. Fica por cima do textarea (sem capturar clique) e some ao digitar.
const EXAMPLE_EVERY_MS = 4200;
const EXAMPLE_FADE_MS = 450;

function RotatingExamples({ examples }: { examples: readonly string[] }) {
  const [i, setI] = useState(0);
  // in: visível · out: saindo para cima · pre: posicionado embaixo, sem transição
  const [phase, setPhase] = useState<"in" | "out" | "pre">("in");

  useEffect(() => {
    let swap: ReturnType<typeof setTimeout>;
    let raf = 0;
    const tick = setInterval(() => {
      setPhase("out");
      swap = setTimeout(() => {
        setI((n) => (n + 1) % examples.length);
        setPhase("pre");
        raf = requestAnimationFrame(() => {
          raf = requestAnimationFrame(() => setPhase("in"));
        });
      }, EXAMPLE_FADE_MS);
    }, EXAMPLE_EVERY_MS);
    return () => {
      clearInterval(tick);
      clearTimeout(swap);
      cancelAnimationFrame(raf);
    };
  }, [examples.length]);

  const state =
    phase === "in"
      ? "translate-y-0 opacity-100"
      : phase === "out"
        ? "-translate-y-2 opacity-0"
        : "translate-y-2 opacity-0 !transition-none";

  return (
    <span
      aria-hidden
      className={`pointer-events-none absolute inset-x-0 top-0 select-none font-display text-[clamp(1.1rem,1.8vw,1.35rem)] font-light leading-relaxed tracking-[-0.01em] text-ink/25 transition-[opacity,transform] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${state}`}
      style={{ transitionDuration: `${EXAMPLE_FADE_MS}ms` }}
    >
      {examples[i]}
    </span>
  );
}

function MinMeter({ count, min }: { count: number; min: number }) {
  const ok = count >= min;
  const pct = Math.min(count / min, 1);
  return (
    <div className="mt-3 flex items-center gap-3 text-[12px] tabular-nums">
      <span className="relative h-[3px] flex-1 overflow-hidden rounded-full bg-line/60">
        <span
          className={`absolute inset-y-0 left-0 rounded-full transition-[width,background-color] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            ok ? "bg-ink" : "bg-accent"
          }`}
          style={{ width: `${pct * 100}%` }}
        />
      </span>
      {ok ? (
        <span key="ok" className="cf-pop inline-flex items-center gap-1 text-ink">
          <Check size={13} strokeWidth={2.25} /> Ótimo, isso ajuda muito
        </span>
      ) : (
        <span className="text-muted">
          {count}/{min} caracteres
        </span>
      )}
    </div>
  );
}

function Options({
  options,
  value,
  picked,
  onPick,
}: {
  options: readonly string[];
  value: string;
  picked: string | null;
  onPick: (v: string, i: number) => void;
}) {
  return (
    <div className="grid gap-2.5 sm:grid-cols-2">
      {options.map((o, i) => {
        const active = picked ? picked === o : value === o;
        const flashing = picked === o;
        return (
          <button
            key={o}
            type="button"
            onClick={() => !picked && onPick(o, i)}
            {...(i === 0 ? { "data-autofocus": true } : {})}
            className={`cf-opt group flex items-center gap-3.5 rounded-[6px] border px-4 py-3.5 text-left text-[15px] transition-all duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ink ${
              active
                ? "border-ink bg-ink text-paper"
                : "border-line bg-card hover:-translate-y-px hover:border-ink/60"
            } ${flashing ? "cf-flash" : ""} ${picked && !flashing ? "opacity-40" : ""}`}
            style={{ animationDelay: `${520 + i * 50}ms` }}
          >
            <span
              className={`grid h-6 w-6 shrink-0 place-items-center rounded-[3px] border text-[11px] font-medium transition-colors ${
                active ? "border-paper/40 text-paper" : "border-line text-muted group-hover:border-ink/50 group-hover:text-ink"
              }`}
            >
              {active ? <Check size={13} strokeWidth={2.25} /> : LETTERS[i]}
            </span>
            <span className="leading-snug">{o}</span>
          </button>
        );
      })}
    </div>
  );
}
