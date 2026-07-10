import { getAbout } from "@/lib/data";
import { AboutAdminClient } from "@/features/admin/AboutAdminClient";

export default async function AdminAboutPage() {
  const about = await getAbout();
  return <AboutAdminClient initialAbout={about} />;
}
