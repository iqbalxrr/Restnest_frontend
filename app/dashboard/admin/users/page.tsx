"use client";

import { useState } from "react";
import { useAdminUsers, useUpdateUserStatus } from "@/hooks/useAdmin";
import { Skeleton } from "@/components/ui/Skeleton";
import { Badge } from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { formatDate } from "@/lib/utils";
import { ChevronLeft, ChevronRight, UserX, UserCheck } from "lucide-react";
import { User } from "@/lib/types";

export default function AdminUsersPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useAdminUsers(page, 10);
  const { mutate: updateStatus, isPending } = useUpdateUserStatus();

  const users: User[] = data?.users || [];
  const meta = data?.meta;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold">User Management</h2>
        <p className="text-[var(--muted)] text-sm mt-1">{meta?.total ?? 0} total users</p>
      </div>

      <div className="bg-white rounded-xl border border-[var(--border)] overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-[var(--secondary)] text-[var(--muted)]">
            <tr>
              <th className="text-left px-4 py-3">User</th>
              <th className="text-left px-4 py-3 hidden md:table-cell">Role</th>
              <th className="text-left px-4 py-3 hidden lg:table-cell">Joined</th>
              <th className="text-left px-4 py-3">Status</th>
              <th className="text-left px-4 py-3">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]">
            {isLoading
              ? Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    {[1, 2, 3, 4, 5].map((j) => (
                      <td key={j} className="px-4 py-3"><Skeleton className="h-4 w-full" /></td>
                    ))}
                  </tr>
                ))
              : users.map((u) => (
                  <tr key={u.id} className="hover:bg-[var(--secondary)]/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-[var(--primary)] text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                          {u.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-medium">{u.name}</div>
                          <div className="text-xs text-[var(--muted)]">{u.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <Badge className={
                        u.role === "ADMIN" ? "bg-purple-100 text-purple-800" :
                        u.role === "LANDLORD" ? "bg-blue-100 text-blue-800" :
                        "bg-gray-100 text-gray-700"
                      }>
                        {u.role}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-[var(--muted)] hidden lg:table-cell">{formatDate(u.createdAt)}</td>
                    <td className="px-4 py-3">
                      <Badge className={u.status === "ACTIVE" ? "badge-active" : "badge-rejected"}>
                        {u.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      {u.role !== "ADMIN" && (
                        u.status === "ACTIVE" ? (
                          <Button
                            size="sm"
                            variant="danger"
                            className="gap-1"
                            loading={isPending}
                            onClick={() => updateStatus({ id: u.id, status: "BANNED" })}
                          >
                            <UserX size={13} /> Ban
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            className="gap-1"
                            loading={isPending}
                            onClick={() => updateStatus({ id: u.id, status: "ACTIVE" })}
                          >
                            <UserCheck size={13} /> Unban
                          </Button>
                        )
                      )}
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>

      {meta && meta.totalPages > 1 && (
        <div className="flex items-center justify-center gap-4">
          <Button variant="secondary" size="sm" disabled={page === 1} onClick={() => setPage(page - 1)} className="gap-1">
            <ChevronLeft size={15} /> Prev
          </Button>
          <span className="text-sm text-[var(--muted)]">Page {page} of {meta.totalPages}</span>
          <Button variant="secondary" size="sm" disabled={page >= meta.totalPages} onClick={() => setPage(page + 1)} className="gap-1">
            Next <ChevronRight size={15} />
          </Button>
        </div>
      )}
    </div>
  );
}
