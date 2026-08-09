import dbConnect from "@/lib/db";
import { notFound } from "next/navigation";
import TenantHome from "@/components/tenant";

import { getRestaurantFromSlug } from "@/lib/api/hooks/getRestaurant";
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
