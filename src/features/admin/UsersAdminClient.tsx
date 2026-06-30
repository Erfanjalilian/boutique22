"use client";

import { Card } from "@/components/ui/Card";
import { formatDate } from "@/utils/helpers";
import type { User } from "@/types";

export function UsersAdminClient({
  initialUsers,
}: {
  initialUsers: User[];
}) {
  return (
    <div className="animate-fade-in">
      <h1 className="text-2xl font-bold mb-6">مدیریت کاربران</h1>
      <div className="space-y-3">
        {initialUsers.map((user) => (
          <Card key={user.id} className="p-5">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="font-medium">{user.name || "کاربر بدون نام"}</p>
                <p className="text-sm text-muted">{user.phone}</p>
                <p className="text-xs text-muted mt-1">
                  عضویت: {formatDate(user.createdAt)}
                </p>
              </div>
              <div className="text-sm text-muted">
                {user.role === "admin" ? "مدیر" : "کاربر"}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
