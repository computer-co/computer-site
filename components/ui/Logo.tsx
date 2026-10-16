import { brand } from "@/lib/content";

/**
 * Lockup da marca: ícone (quadrado escuro com "c" serifado em itálico) +
 * wordmark da empresa na serifa display. Segue o sistema de logo.
 *
 * `tone`:
 *  - "dark"  → ícone preto/texto claro sobre fundos claros (padrão)
 *  - "light" → ícone claro/texto claro sobre fundos escuros
 */
export default function Logo({
  size = 26,
  className = "",
  tone = "dark",
  name = brand.name,
}: {
  size?: number;
  className?: string;
  tone?: "dark" | "light";
  name?: string;
}) {
  const icon =
    tone === "light"
      ? "bg-paper text-navy"
      : "bg-ink text-paper";

  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <span
        aria-hidden
        className={`grid shrink-0 place-items-center font-display italic leading-none ${icon}`}
        style={{ width: size, height: size, fontSize: size * 0.52 }}
      >
        {brand.mark}
      </span>
      <span
        className="font-display leading-none tracking-[-0.01em]"
        style={{ fontSize: size * 0.74 }}
      >
        {name}
      </span>
    </span>
  );
}
