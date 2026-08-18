"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { MAIN_NAV } from "@/lib/nav";
import { useAuth } from "@/lib/auth/context";

function AccountLink() {
  const { user } = useAuth();
  if (user) {
    return (
      <Link
        href="/configuracoes/conta"
        className="whitespace-nowrap rounded-lg border border-[var(--nr-border)] px-3 py-2 text-sm font-medium text-[var(--nr-text)] hover:bg-[var(--nr-surface-alt)]"
      >
        {user.pseudonym}
      </Link>
    );
  }
  return (
    <Link
      href="/entrar"
      className="whitespace-nowrap rounded-lg border border-[var(--nr-border)] px-3 py-2 text-sm font-medium text-[var(--nr-text)] hover:bg-[var(--nr-surface-alt)]"
    >
      Entrar
    </Link>
  );
}

export function NavHeader() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="border-b border-[var(--nr-border)] bg-[var(--nr-surface)]">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link href="/" className="flex flex-col leading-tight">
          <span className="text-lg font-bold text-[var(--nr-text)]">NeuroRefúgio</span>
          <span className="text-xs text-[var(--nr-text-muted)]" data-decorative="true">
            um espaço para existir no seu ritmo
          </span>
        </Link>

        <nav aria-label="Navegação principal" className="hidden lg:block">
          <ul className="flex flex-wrap items-center gap-1 text-sm">
            {MAIN_NAV.map((item) => {
              const active = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={`inline-block rounded-lg px-3 py-2 font-medium hover:bg-[var(--nr-surface-alt)] ${
                      active ? "bg-[var(--nr-surface-alt)] text-[var(--nr-accent-primary)]" : "text-[var(--nr-text)]"
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="hidden lg:block">
          <AccountLink />
        </div>

        <button
          type="button"
          className="rounded-lg border border-[var(--nr-border)] px-3 py-2 text-sm font-medium text-[var(--nr-text)] lg:hidden"
          aria-expanded={menuOpen}
          aria-controls="menu-principal-movel"
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? "Fechar menu" : "Menu"}
        </button>
      </div>

      {menuOpen && (
        <nav id="menu-principal-movel" aria-label="Navegação principal" className="border-t border-[var(--nr-border)] lg:hidden">
          <ul className="flex flex-col px-4 py-2">
            {MAIN_NAV.map((item) => {
              const active = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    onClick={() => setMenuOpen(false)}
                    className={`block rounded-lg px-3 py-3 text-base font-medium hover:bg-[var(--nr-surface-alt)] ${
                      active ? "text-[var(--nr-accent-primary)]" : "text-[var(--nr-text)]"
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
          <div className="px-4 pb-4">
            <AccountLink />
          </div>
        </nav>
      )}
    </header>
  );
}
