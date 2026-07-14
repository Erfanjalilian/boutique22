import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import CheckoutPageClient from "./CheckoutPageClient";

export default async function CheckoutPage() {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  return <CheckoutPageClient />;
}
