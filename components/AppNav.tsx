"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  ["/app", "Início"],
  ["/app/trilha", "Trilha"],
  ["/app/conta", "Conta"],
];

export function AppNav() {
  const path = usePathname();
  return (
    <nav className="flex gap-1">
      {LINKS.map(([href, label]) => {
        const on = href === "/app" ? path === "/app" : path.startsWith(href);
        return (
          <Link key={href} href={href} className={`rounded-full px-3.5 py-2 text-sm font-bold transition ${on ? "bg-navy text-white" : "text-muted hover:bg-bg2"}`}>
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
