import Image from "next/image";
import { notFound } from "next/navigation";

import { db } from "@/lib/prisma";

import { ConsumptionMethodOption } from "./components/consumption-option";

interface RestaurantPageProps {
  params: Promise<{ slug: string }>;
}
const Restaurantpage = async ({ params }: RestaurantPageProps) => {
  const { slug } = await params;
  const restaurant = await db.restaurant.findUnique({ where: { slug } });

  if (!restaurant) {
    return notFound();
  }

  return (
    <div className="flex h-screen flex-col items-center justify-center px-6 pt-24">
      <div>
        <div className="flex flex-col items-center gap-2">
          <Image
            src={restaurant.avatarImageUrl}
            alt={restaurant.name}
            height={82}
            width={82}
          />
          <h2 className="font-semibold">{restaurant.name} </h2>
        </div>
        <div className="space-y-2 pt-24 text-center">
          <h3 className="text-2xl font-semibold">Seja Bem Vindo</h3>
          <p className="opacity-55">
            Escolha como prefere aproveitar a sua refeição Estamos a oferecer
            praticidade e saboer em cada detalhe.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4 pt-14">
          <ConsumptionMethodOption
            slug={slug}
            buttonText="Comer aqui"
            imageAlt="Comer aqui"
            imageUrl="/dine_in.png"
            option="DINE_IN"
          />
          <ConsumptionMethodOption
            slug={slug}
            buttonText="Para levar"
            imageAlt="Para levar"
            imageUrl="/takeaway.png"
            option="TAKEAWAY"
          />
        </div>
      </div>
    </div>
  );
};

export default Restaurantpage;
