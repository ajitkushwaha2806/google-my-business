import { Store } from "lucide-react";
import { getImageUrl } from "@/lib/utils";

const RestaurantImage = ({ restaurant }) => {
  return (
    <div className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg border bg-muted shadow-sm">
      {restaurant?.logo ? (
        <img
          src={getImageUrl(restaurant.logo, true, "thumbnail")}
          alt={restaurant.name}
          className="h-full w-full object-cover"
        />
      ) : (
        <Store className="size-4 text-muted-foreground" />
      )}
    </div>
  );
}

export default RestaurantImage