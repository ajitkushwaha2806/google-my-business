"use client"
import { useQuery } from "@tanstack/react-query"
import { RestaurantService } from "@/services/frontend/restaurant"
import { useRestaurant } from "@/store/hooks/useRestaurant"
import ProfilePage from "@/components/pages/restaurant/profile"

const Page = () => {
  const { restaurantId } = useRestaurant()
  const { data, isPending, isError, error } = useQuery({
    queryKey: ["restaurant-details"],
    queryFn: () =>  RestaurantService.getRestaurantById(restaurantId),
    enabled: !!restaurantId
  });
  
  console.log("data", data)

  return (
    <ProfilePage />
  )
}

export default Page