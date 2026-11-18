// Fonte única de verdade da entidade "The Computer Company" para SEO/GEO.
// Mantenha a mesma descrição canônica no LinkedIn, Instagram, Google Business Profile e diretórios.
// Só inclua aqui fatos públicos e aprovados (sem CNPJ, endereço ou preços sem OK do Caio).

export const siteUrl = "https://thecomputercompany.com.br";

export const entity = {
  name: "The Computer Company",
  alternateName: "Computer",
  description:
    "The Computer Company é uma empresa brasileira que cria agentes de IA para eliminar gargalos operacionais que drenam tempo e dinheiro.",
  instagram: "https://www.instagram.com/thecomputer.company/",
  founder: {
    name: "Caio Saback",
    linkedin: "https://www.linkedin.com/in/caio-saback-21b439314/",
  },
};

const orgId = `${siteUrl}/#organization`;

export const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "ProfessionalService",
      "@id": orgId,
      name: entity.name,
      alternateName: entity.alternateName,
      url: siteUrl,
      logo: `${siteUrl}/icon.png`,
      image: `${siteUrl}/images/hero.jpg`,
      description: entity.description,
      areaServed: { "@type": "Country", name: "Brasil" },
      knowsAbout: [
        "Agentes de IA",
        "Automação de processos com IA",
        "Agentes de IA para operações empresariais",
      ],
      founder: {
        "@type": "Person",
        "@id": `${siteUrl}/#founder`,
        name: entity.founder.name,
        sameAs: [entity.founder.linkedin],
      },
      sameAs: [entity.instagram],
    },
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: siteUrl,
      name: entity.name,
      inLanguage: "pt-BR",
      publisher: { "@id": orgId },
    },
  ],
};
