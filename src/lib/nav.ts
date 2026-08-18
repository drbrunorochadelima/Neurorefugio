export interface NavItem {
  href: string;
  label: string;
  /** Ícone simplificado (texto/emoji neutro) usado na navegação inferior do celular. */
  shortLabel?: string;
}

export const MAIN_NAV: NavItem[] = [
  { href: "/", label: "Início" },
  { href: "/meu-espaco", label: "Meu Espaço" },
  { href: "/corpo-monitor", label: "Corpo-Monitor" },
  { href: "/quero-me-regular", label: "Quero me regular", shortLabel: "Regular" },
  { href: "/games", label: "Games" },
  { href: "/hiperfocos", label: "Hiperfocos" },
  { href: "/comunidade", label: "Comunidade" },
  { href: "/biblioteca", label: "Biblioteca" },
  { href: "/instituicoes", label: "Instituições" },
  { href: "/pesquisa", label: "Conheça a pesquisa" },
  { href: "/configuracoes", label: "Configurações" },
];

/** Itens priorizados na navegação inferior do celular (os demais ficam em "Mais"). */
export const MOBILE_PRIORITY_NAV: NavItem[] = [
  { href: "/", label: "Início" },
  { href: "/meu-espaco", label: "Meu Espaço" },
  { href: "/quero-me-regular", label: "Regular" },
  { href: "/games", label: "Games" },
];
