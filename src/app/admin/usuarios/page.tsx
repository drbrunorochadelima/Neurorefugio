"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth/context";
import { listAllUsers, setUserRole } from "@/lib/auth/store";
import { logAdminAction } from "@/lib/services/audit-log";
import { USER_ROLES, type UserRole } from "@/lib/schemas/auth";

const ROLE_LABELS: Record<UserRole, string> = {
  visitante: "Visitante",
  usuario: "Usuário(a)",
  moderador: "Moderador(a)",
  revisor: "Revisor(a) científico",
  administrador: "Administrador(a)",
};

export default function AdminUsuariosPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === "administrador";
  const [users, setUsers] = useState<ReturnType<typeof listAllUsers>>([]);

  useEffect(() => {
    if (!isAdmin) return;
    const timeout = setTimeout(() => setUsers(listAllUsers()), 0);
    return () => clearTimeout(timeout);
  }, [isAdmin]);

  if (!user || user.role !== "administrador") {
    return (
      <div className="mx-auto max-w-md px-4 py-12 text-center sm:px-6">
        <p className="text-[var(--nr-text)]">Acesso restrito a administradores.</p>
        <Link href="/admin" className="mt-4 inline-block text-[var(--nr-accent-primary)] hover:underline">
          Voltar
        </Link>
      </div>
    );
  }

  function handleRoleChange(targetId: string, role: UserRole) {
    if (!user) return;
    setUserRole(targetId, role);
    logAdminAction(user.id, user.pseudonym, `Alterou papel do usuário ${targetId} para ${role}`);
    setUsers(listAllUsers());
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="text-2xl font-bold text-[var(--nr-text)]">Usuários e permissões</h1>

      <div className="mt-6 overflow-x-auto">
        <table className="w-full min-w-max border-collapse text-sm">
          <thead>
            <tr>
              <th scope="col" className="border-b border-[var(--nr-border)] px-2 py-1 text-left">Pseudônimo</th>
              <th scope="col" className="border-b border-[var(--nr-border)] px-2 py-1 text-left">E-mail</th>
              <th scope="col" className="border-b border-[var(--nr-border)] px-2 py-1 text-left">Papel</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td className="px-2 py-1.5">{u.pseudonym}</td>
                <td className="px-2 py-1.5">{u.email}</td>
                <td className="px-2 py-1.5">
                  <select
                    value={u.role}
                    onChange={(e) => handleRoleChange(u.id, e.target.value as UserRole)}
                    className="rounded-lg border border-[var(--nr-border)] bg-[var(--nr-surface)] px-2 py-1 text-sm text-[var(--nr-text)]"
                  >
                    {USER_ROLES.map((r) => (
                      <option key={r} value={r}>
                        {ROLE_LABELS[r]}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Link href="/admin" className="mt-6 inline-block text-sm text-[var(--nr-accent-primary)] hover:underline">
        Voltar ao painel
      </Link>
    </div>
  );
}
