import { redirect } from "next/navigation";

export default function AdminAliasPage() {
  redirect("/api/admin/auto-login");
}
