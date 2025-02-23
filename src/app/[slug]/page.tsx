import { db } from "@/lib/prisma";

interface RestaurantPageProps {
  params: Promise<{ slug: string }>;
}
const Restaurantpage = async ({ params }: RestaurantPageProps) => {
  const { slug } = await params;
  const restaurant = await db.restaurant.findUnique({ where: { slug } });
  return <h2>{restaurant?.name}</h2>;
};

export default Restaurantpage;
