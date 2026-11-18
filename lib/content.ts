// Copy do site, extraída de STRUCTURE.md. Componentes consomem daqui — sem hardcode.

export const brand = {
  name: "the computer company",
  mark: "c",
  // no footer a marca aparece curta
  footerName: "Computer",
  copyright: "© 2026 The Computer Company",
};

// Link de agendamento (Calendly)
export const scheduleUrl = "https://calendly.com/thecomputer/computer-reuniao";

// Todos os CTAs "Falar com o time" abrem o formulário de qualificação
// (components/ContactFlow.tsx), que termina na agenda do Calendly.
export const contactHash = "#falar-com-o-time";

export const contactFlow = {
  intro: "Falar com o time · leva menos de 1 minuto",
  cargos: [
    "Sócio(a) / CEO",
    "Diretor(a) / C-level",
    "Gerente / Head",
    "Coordenador(a) / Analista",
    "Outro",
  ],
  faturamentos: [
    "Até R$ 1 milhão",
    "R$ 1 – 10 milhões",
    "R$ 10 – 50 milhões",
    "R$ 50 – 200 milhões",
    "Acima de R$ 200 milhões",
  ],
  // exemplos que se revezam no campo "Por que você quer conversar com a gente?"
  exemplosMotivo: [
    "Ex.: hoje 3 pessoas passam a manhã conferindo pedidos que chegam pelo WhatsApp e lançando no ERP. Erra muito e atrasa a expedição.",
    "Ex.: o financeiro gasta 2 dias por mês conciliando extratos de 4 bancos numa planilha. Sempre sobra uma diferença que ninguém sabe explicar.",
    "Ex.: o comercial demora horas pra responder os leads no WhatsApp. Quando responde, o cliente já fechou com outro.",
    "Ex.: o suporte responde as mesmas 20 perguntas o dia inteiro. São 2 pessoas só nisso, e o cliente ainda espera horas.",
    "Ex.: recebemos centenas de notas e boletos por e-mail. Alguém baixa, confere e lança um por um no sistema.",
    "Ex.: cada proposta leva meio dia, copiando dados de 3 sistemas diferentes. Já perdemos venda por erro de preço.",
  ],
} as const;

export const nav = {
  links: [
    { label: "Produto", href: "/#produto" },
    { label: "Soluções", href: "/#solucoes" },
  ],
  cta: { label: "Falar com o time", href: contactHash },
};

export const hero = {
  title: "Agentes que eliminam o trabalho repetitivo.",
  subtitle:
    "Sua operação tem gargalos repetitivos que drenam tempo e dinheiro. Nós construímos agentes de IA que eliminam esses gargalos.",
  cta: { label: "Falar com o time", href: contactHash },
  image: "/images/hero.jpg",
  imageAlt: "Pessoa caminhando em um espaço de concreto com luz diagonal",
};

export const statement = {
  text: "O limite do que a IA faz na sua empresa não é o modelo. É o quanto o modelo conhece como a sua empresa opera. E esse contexto só se captura de um jeito: fazendo o trabalho.",
};

export const startsWithAgents = {
  eyebrow: "O tipo de trabalho que fazemos",
  title: "Tudo começa com agentes",
  description:
    "Agentes de IA autônomos, implantados para executar funções reais do negócio — começando pelos processos mais fragmentados, confusos e cheios de exceções.",
  cta: { label: "Falar com o time", href: contactHash },
  items: [
    {
      n: "01",
      text: "Agentes são trabalhadores de IA autônomos, capazes de comunicação e coordenação.",
    },
    {
      n: "02",
      text: "Para colocá-los para trabalhar, implantamos e escalamos funções centrais do negócio.",
    },
    {
      n: "03",
      text: "Ambientes complexos são fragmentados, operacionalmente confusos e cheios de exceções.",
    },
  ],
};

export const platform = {
  eyebrow: "Metodologia",
  title: "Como colocamos agentes para trabalhar",
  cta: { label: "Falar com o time", href: contactHash },
  points: [
    {
      title: "Entendemos o gargalo",
      description:
        "Cada projeto começa com uma conversa para mapear o processo que drena tempo e dinheiro. O agente é desenhado para aquele fluxo específico — nada genérico.",
    },
    {
      title: "O agente aprende com o trabalho real",
      description:
        "Cada interação em produção vira contexto. O agente melhora continuamente com as exceções, variações e surpresas que só a operação real revela.",
    },
    {
      title: "Encaixamos no seu time",
      description:
        "Slack, WhatsApp, e-mail, navegador — o agente vive onde sua equipe já está, sem obrigar ninguém a mudar de ferramenta.",
    },
  ],
  diagram: {
    center: "Agentes",
    nodes: [
      { label: "Governança", icon: "shield" },
      { label: "Interfaces", icon: "layout" },
      { label: "Integrações empresariais", icon: "plug" },
      { label: "Contexto", icon: "database" },
    ],
  },
};

export const deployed = {
  eyebrow: "Trabalho real",
  title: "Implantado no mundo real",
  description:
    "Resultado de verdade, sem slideware. Agentes que já estão em produção resolvendo problemas reais — com métricas e aprendizado contínuo.",
  cards: [
    {
      title: "Agente de suporte autônomo com 7 ferramentas integradas",
      subtitle: "FAQ, tickets, busca semântica e classificação — em produção.",
      // fundo abstrato/tech (sem logo de cliente)
      bg: "radial-gradient(130% 120% at 18% 0%, #1d4250 0%, #0c1d2c 55%, #081521 100%)",
    },
    {
      title: "Agente financeiro pessoal — pipeline de dados e conversa",
      subtitle: "Upload de extrato, categorização, projeções. Em desenvolvimento.",
      bg: "radial-gradient(130% 120% at 82% 8%, #2c2658 0%, #161433 55%, #0e0c22 100%)",
    },
  ],
};

export const optimized = {
  eyebrow: "Nossa filosofia",
  title: "Otimizado para impacto",
  columns: [
    {
      icon: "sparkle",
      title: "Sob medida",
      description:
        "Soluções relevantes atendem a empresa onde ela está — o que muitas vezes exige contexto, tecnologia e padrões totalmente próprios, diferentes do que qualquer sistema genérico usa hoje.",
    },
    {
      icon: "layers",
      title: "Complexo",
      description:
        "Ambientes complexos, sozinhos, exigem profundidade — o que faz da realidade o teste mais difícil, sustentando a criação e a captura de lógica e capacidade globais entre fluxos de trabalho.",
    },
    {
      icon: "boxes",
      title: "Multifunção",
      description:
        "Empresas têm uma amplitude de conhecimento e insight ao longo de funções. Quando um agente aprende, ele melhora — e os agentes devem aprender e melhorar em toda parte.",
    },
  ],
};

export const finalCta = {
  title: "Coloque os agentes para trabalhar",
  cta: { label: "Falar com o time", href: contactHash },
};

export const footer = {
  // apenas o que precisa estar ali por lei (LGPD/consentimento) + copyright
  // Links legais removidos enquanto as páginas não existem (links "#" prejudicam SEO/confiança).
  // Reative quando houver /privacidade e /termos publicados.
  legal: [] as { label: string; href: string }[],
};
