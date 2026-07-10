import { getSettings } from "@/lib/data";
import { SettingsAdminClient } from "@/features/admin/SettingsAdminClient";

export default async function AdminSettingsPage() {
  const settings = await getSettings();
  return <SettingsAdminClient initialSettings={settings} />;
}
