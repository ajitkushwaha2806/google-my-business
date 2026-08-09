"use client";
import { useFormik } from "formik";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RestaurantService } from "@/services/frontend/restaurant";
import { useRestaurant } from "@/store/hooks/useRestaurant";
import { useFormMutation } from "@/store/hooks/useFormMutation";
import { MapPin, Building, Map, Hash, Globe, Compass, Save, Loader2 } from "lucide-react";

const LocationTab = ({ locationData }) => {
  console.log("locationData" , locationData)
  const { restaurantId } = useRestaurant();
  
  const { mutate, isPending } = useFormMutation({
    mutationFn: (data) => RestaurantService.updateRestaurant(restaurantId, data),
    queryKey: ["restaurant-details", restaurantId],
    invalidateKeys: [["restaurant-details", restaurantId]],
    extractUpdatedData: (response) => response?.data?.restaurant || response?.restaurant,
    successMessage: "Location information updated successfully!"
  });

  const formik = useFormik({
    initialValues: {
      street: locationData?.street || "",
      city: locationData?.city || "",
      state: locationData?.state || "",
      postalCode: locationData?.postalCode || "",
      country: locationData?.country || "IN",
      lat: locationData?.lat || "",
      long: locationData?.long || "",
    },
    enableReinitialize: true,
    onSubmit: (values, { resetForm }) => {
      if (!restaurantId) return;
      mutate({ address: values }, {
        onSuccess: () => resetForm({ values }),
      });
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className="flex flex-col">
      <div className="mb-8">
        <h3 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Location Details</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage your restaurant's physical address and precise map coordinates.</p>
      </div>
      
      <div className="p-6 rounded-2xl border border-border/40 bg-card shadow-sm space-y-6">
        {/* Street Address */}
        <div className="relative group">
          <div className="absolute -top-2.5 left-3 px-1.5 bg-card z-10">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 group-focus-within:text-orange-600 transition-colors">Street Address</span>
          </div>
          <div className="relative flex items-center border border-gray-300 dark:border-gray-700 rounded-md focus-within:border-orange-500 focus-within:ring-1 focus-within:ring-orange-500 transition-all bg-white dark:bg-zinc-900/50">
            <div className="pl-3.5 flex items-center pointer-events-none">
              <MapPin className="h-5 w-5 text-orange-500" />
            </div>
            <Input 
              id="street" 
              name="street"
              value={formik.values.street}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="123 Main Street, Phase 1" 
              className="border-0 focus-visible:ring-0 shadow-none h-12 bg-transparent text-base px-3 w-full" 
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          {/* City */}
          <div className="relative group">
            <div className="absolute -top-2.5 left-3 px-1.5 bg-card z-10">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 group-focus-within:text-orange-600 transition-colors">City</span>
            </div>
            <div className="relative flex items-center border border-gray-300 dark:border-gray-700 rounded-md focus-within:border-orange-500 focus-within:ring-1 focus-within:ring-orange-500 transition-all bg-white dark:bg-zinc-900/50">
              <div className="pl-3.5 flex items-center pointer-events-none">
                <Building className="h-5 w-5 text-orange-500" />
              </div>
              <Input 
                id="city" 
                name="city"
                value={formik.values.city}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Mumbai" 
                className="border-0 focus-visible:ring-0 shadow-none h-12 bg-transparent text-base px-3 w-full" 
              />
            </div>
          </div>

          {/* State */}
          <div className="relative group">
            <div className="absolute -top-2.5 left-3 px-1.5 bg-card z-10">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 group-focus-within:text-orange-600 transition-colors">State</span>
            </div>
            <div className="relative flex items-center border border-gray-300 dark:border-gray-700 rounded-md focus-within:border-orange-500 focus-within:ring-1 focus-within:ring-orange-500 transition-all bg-white dark:bg-zinc-900/50">
              <div className="pl-3.5 flex items-center pointer-events-none">
                <Map className="h-5 w-5 text-orange-500" />
              </div>
              <Input 
                id="state" 
                name="state"
                value={formik.values.state}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Maharashtra" 
                className="border-0 focus-visible:ring-0 shadow-none h-12 bg-transparent text-base px-3 w-full" 
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          {/* Postal Code */}
          <div className="relative group">
            <div className="absolute -top-2.5 left-3 px-1.5 bg-card z-10">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 group-focus-within:text-orange-600 transition-colors">Postal Code</span>
            </div>
            <div className="relative flex items-center border border-gray-300 dark:border-gray-700 rounded-md focus-within:border-orange-500 focus-within:ring-1 focus-within:ring-orange-500 transition-all bg-white dark:bg-zinc-900/50">
              <div className="pl-3.5 flex items-center pointer-events-none">
                <Hash className="h-5 w-5 text-orange-500" />
              </div>
              <Input 
                id="postalCode" 
                name="postalCode"
                value={formik.values.postalCode}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="400001" 
                className="border-0 focus-visible:ring-0 shadow-none h-12 bg-transparent text-base px-3 w-full" 
              />
            </div>
          </div>

          {/* Country */}
          <div className="relative group">
            <div className="absolute -top-2.5 left-3 px-1.5 bg-card z-10">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 group-focus-within:text-orange-600 transition-colors">Country</span>
            </div>
            <div className="relative flex items-center border border-gray-300 dark:border-gray-700 rounded-md focus-within:border-orange-500 focus-within:ring-1 focus-within:ring-orange-500 transition-all bg-white dark:bg-zinc-900/50">
              <div className="pl-3.5 flex items-center pointer-events-none">
                <Globe className="h-5 w-5 text-orange-500" />
              </div>
              <Input 
                id="country" 
                name="country"
                value={formik.values.country}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="IN" 
                className="border-0 focus-visible:ring-0 shadow-none h-12 bg-transparent text-base px-3 w-full" 
              />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 p-6 rounded-2xl border border-border/40 bg-muted/10 shadow-sm space-y-6">
        <h4 className="text-lg font-semibold tracking-tight text-gray-800 dark:text-gray-100 flex items-center gap-2">
          <MapPin className="w-5 h-5 text-orange-500" />
          Map Coordinates
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          {/* Latitude */}
          <div className="relative group">
            <div className="absolute -top-2.5 left-3 px-1.5 bg-white dark:bg-zinc-900 z-10">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 group-focus-within:text-orange-600 transition-colors">Latitude</span>
            </div>
            <div className="relative flex items-center border border-gray-300 dark:border-gray-700 rounded-md focus-within:border-orange-500 focus-within:ring-1 focus-within:ring-orange-500 transition-all bg-white dark:bg-zinc-900/50">
              <div className="pl-3.5 flex items-center pointer-events-none">
                <Compass className="h-5 w-5 text-orange-500" />
              </div>
              <Input 
                id="lat" 
                name="lat"
                value={formik.values.lat}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="19.0760" 
                className="border-0 focus-visible:ring-0 shadow-none h-12 bg-transparent text-base px-3 w-full" 
              />
            </div>
            <p className="text-[11px] text-muted-foreground mt-1.5 pl-1">Used for map pins and distance calculations.</p>
          </div>

          {/* Longitude */}
          <div className="relative group">
            <div className="absolute -top-2.5 left-3 px-1.5 bg-white dark:bg-zinc-900 z-10">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 group-focus-within:text-orange-600 transition-colors">Longitude</span>
            </div>
            <div className="relative flex items-center border border-gray-300 dark:border-gray-700 rounded-md focus-within:border-orange-500 focus-within:ring-1 focus-within:ring-orange-500 transition-all bg-white dark:bg-zinc-900/50">
              <div className="pl-3.5 flex items-center pointer-events-none">
                <Compass className="h-5 w-5 text-orange-500" />
              </div>
              <Input 
                id="long" 
                name="long"
                value={formik.values.long}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="72.8777" 
                className="border-0 focus-visible:ring-0 shadow-none h-12 bg-transparent text-base px-3 w-full" 
              />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-10 pt-6 flex justify-end">
        <Button 
          type="submit" 
          disabled={isPending || !formik.dirty} 
          className="h-11 px-8 rounded-md font-medium shadow-md hover:shadow-lg transition-all active:scale-[0.98] bg-orange-600 hover:bg-orange-700 text-white"
        >
          {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
          {isPending ? "Saving changes..." : "Save Location"}
        </Button>
      </div>
    </form>
  );
};

export default LocationTab;
