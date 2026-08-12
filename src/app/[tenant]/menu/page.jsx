import { notFound } from "next/navigation";
import TenantHome from "@/components/tenant";

export async function generateMetadata({ params }) {
  const { tenant } = await params;
  return {
    title: `Menu — ${tenant}`,
    description: `Browse the menu for ${tenant}`,
  };
}

export default async function TenantMenuPage({ params }) {
  const { tenant } = await params;
  return <TenantHome slug={tenant} />;
}
