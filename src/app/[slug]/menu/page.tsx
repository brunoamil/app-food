import { ChevronLeftIcon, ScrollTextIcon } from "lucide-react";
import Image from "next/image";
import { notFound } from "next/navigation";

import { Button } from "@/components/ui/button";
import { db } from "@/lib/prisma";

import { RestaurantHeader } from "./components/header";

interface RestaurantMenuPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ consumptionMethod: string }>;
}
const isConsumptionMethodValid = (consumptionMethod: string) => {
  return ["DINE_IN","TAKEAWAY"].includes(consumptionMethod?.toLowerCase());
};
const RestaurantMenuPage = async ({
  params,
  searchParams,
}: RestaurantMenuPageProps) => {
  const { slug } = await params;
  const { consumptionMethod } = await searchParams;

  console.log("consumptionMethod", consumptionMethod)
  if (isConsumptionMethodValid(consumptionMethod)) {
    return notFound();
  }

  const restaurant = await db.restaurant.findUnique({ where: { slug } });

  if (!restaurant){
    notFound();
  }

  return (
    <div>
      <RestaurantHeader restaurant={restaurant}/>
    </div>
  );
};

export default RestaurantMenuPage;
