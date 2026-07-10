import { getUsers } from "@/lib/data";
import { UsersAdminClient } from "@/features/admin/UsersAdminClient";

export default async function AdminUsersPage() {
  const users = await getUsers();
  return <UsersAdminClient initialUsers={users} />;
}
