import Link from "next/link";

type Variant = "primary" | "secondary" | "ghost-light";

const styles: Record<Variant, string> = {
  primary:
    "bg-ink text-paper border border-ink hover:bg-transparent hover:text-ink",
  secondary:
    "bg-transparent text-ink border border-ink hover:bg-ink hover:text-paper",
  "ghost-light":
    "bg-paper text-ink border border-paper hover:bg-transparent hover:text-paper",
};

export default function Button({
  href,
  children,
  variant = "primary",
  className = "",
}: {
  href: string;
  children: React.ReactNode;
  variant?: Variant;
  className?: string;
}) {
  const cls = `inline-flex items-center justify-center rounded-[var(--radius-md)] px-6 py-3 text-[13px] font-medium tracking-wide transition-colors duration-200 ${styles[variant]} ${className}`;

  // links externos (agendamento) abrem em nova aba
  if (/^https?:|^mailto:/.test(href)) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={cls}
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={cls}>
      {children}
    </Link>
  );
}
