"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MOBILE_PRIORITY_NAV } from "@/lib/nav";

export function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Navegação rápida"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-[var(--nr-border)] bg-[var(--nr-surface)] lg:hidden"
      data-nonessential="true"
    >
      <ul className="grid grid-cols-5">
        {MOBILE_PRIORITY_NAV.map((item) => {
          const active = pathname === item.href;
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`flex flex-col items-center gap-0.5 py-2 text-xs font-medium ${
                  active ? "text-[var(--nr-accent-primary)]" : "text-[var(--nr-text-muted)]"
                }`}
              >
                {item.shortLabel ?? item.label}
              </Link>
            </li>
          );
        })}
        <li>
          <Link
            href="/configuracoes"
            className="flex flex-col items-center gap-0.5 py-2 text-xs font-medium text-[var(--nr-text-muted)]"
          >
            Mais
          </Link>
        </li>
      </ul>
    </nav>
  );
}
