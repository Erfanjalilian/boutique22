import { getAbout } from "@/lib/data";
import { Card } from "@/components/ui/Card";

export default async function AboutPage() {
  const about = await getAbout();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in">
      <h1 className="text-4xl font-bold mb-6">درباره ما</h1>
      <p className="text-lg leading-8 text-muted">{about.description}</p>
    </div>
  );
}
